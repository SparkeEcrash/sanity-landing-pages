import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { v4 as uuidv4 } from "uuid";
import { getTagLabels } from "utils/getData";
import { groq } from "next-sanity";

export async function POST(request: NextRequest) {
  // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
  const data = await getServerSession(authOptions);
  const uid = data && data.user.uid;
  const name = data && data.user.name;
  const userImage = data && data.user.image;
  const userEmail = data && data.user.email;
  const username = data && data.user.username;

  //https://www.sanity.io/plugins/sanity-plugin-media-library

  const form = await request.formData();
  const blob = form.get("blob");
  const formData = JSON.parse(await (blob as Blob)!.text());
  const {
    posted,
    imageDetails,
    title,
    comment,
    tags,
    isMaker,
    isForSale,
    price,
  } = formData;
  const images = form.getAll("image");
  const dateUploaded = getTodayDate();
  const dateUploadedNumber = getDateNow();
  const id = uuidv4();
  const titleTrimmed = title.trim();
  const commentTrimmed = comment.trim();

  /* Validation check */
  if (imageDetails && title && comment && name && tags && images.length !== 0) {
    const doc = {
      _type: "artwork",
      _id: id,
      title: titleTrimmed,
      comment: commentTrimmed,
      uid,
      name,
      userImage,
      userEmail,
      username,
      dateUploaded,
      dateUploadedNumber,
      posted,
      isMaker,
      isForSale,
      price,
      views: 0,
      likes: [],
      comments: [],
    };

    /* Handle Artwork Document */
    const document = await sanityClient.create(doc).catch(console.error);
    if (!document) {
      return NextResponse.json(
        { error: "failed to create artwork document" },
        { status: 500 }
      );
    }

    /* Handle Artwork Images */
    for (let i = 0; i < images.length; i++) {
      const { type, name } = images[i] as Blob;
      const buffer = Buffer.from(await (images[i] as Blob).arrayBuffer());
      const uploadedImage = await sanityClient.assets.upload("image", buffer, {
        filename: name,
        contentType: type,
      });
      if (uploadedImage === null) {
        return NextResponse.json(
          { error: "failed to upload image" },
          { status: 500 }
        );
      }
      const { height, width } = imageDetails[i].dimensions;
      const artworkImage = {
        _type: "artworkImage",
        height,
        width,
        aid: id,
        uid,
        dateUploaded,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: uploadedImage._id,
          },
        },
      };
      const docArtImage = await sanityClient.create(artworkImage);
      if (docArtImage === null) {
        return NextResponse.json(
          { error: "failed to create artwork image" },
          { status: 500 }
        );
      }
      const docArtworkWithImage = await sanityClient
        .patch(id)
        .setIfMissing({ images: [] })
        .insert("after", "images[-1]", [
          {
            _key: docArtImage._id,
            _type: "reference",
            _ref: docArtImage._id,
          },
        ])
        .commit();
      if (docArtworkWithImage === null) {
        return NextResponse.json(
          { error: "failed to attach artwork image to document" },
          { status: 500 }
        );
      }
    }

    /* Handle Tags */
    if (tags.length > 0) {
      const { data: tagLabels } = await getTagLabels();
      for (let i = 0; i < tags.length; i++) {
        const existingTag = tagLabels.find(
          (tagDoc: TagProps) => tagDoc.label === tags[i]
        );
        if (existingTag) {
          const docArtworkWithTag = await sanityClient
            .patch(id)
            .setIfMissing({ tags: [] })
            .insert("after", "tags[-1]", [
              {
                _key: existingTag._id,
                _type: "reference",
                _ref: existingTag._id,
              },
            ])
            .commit();
          if (docArtworkWithTag.tags.length === 0) {
            return NextResponse.json(
              { error: "failed to attach tag to document" },
              { status: 500 }
            );
          }
        } else {
          const newTag = {
            _type: "tag",
            label: tags[i],
          };
          const docTag = await sanityClient.create(newTag);
          const docArtworkWithNewTag = await sanityClient
            .patch(id)
            .setIfMissing({ tags: [] })
            .insert("after", "tags[-1]", [
              {
                _key: docTag._id,
                _type: "reference",
                _ref: docTag._id,
              },
            ])
            .commit();
          if (docArtworkWithNewTag.tags.length === 0) {
            return NextResponse.json(
              { error: "failed to attach tag to document" },
              { status: 500 }
            );
          }
        }
      }
      //return updated data
      const queryTwo = groq`
		*[_type == "artwork" && uid == "${uid}" && isDeleted != true]{
			...,
			comments[]-> {
				_id,
				uid,
				aid,
				name,
				userEmail,
				userImage,
				username,
				comment,
				datePosted,
				datePostedNumber,
				dateUpdated,
				dateUpdatedNumber,
				isHidden,
				hiddenBy,
			},
			likes[]-> {
				_id,
				uid,
				aid,
				name,
				userEmail,
				userImage,
				username,
				datePosted,
				datePostedNumber,
			},
			tags[]-> {
				_id,
				label,
			},
			images[]-> {
				_id,
				height,
				width,
				"imageUrl": image.asset->url,
			}
		}
		`;

      const data = await sanityClient.fetch(queryTwo).catch(console.error);
      return NextResponse.json({ data }, { status: 200 });
    }
  }
}
