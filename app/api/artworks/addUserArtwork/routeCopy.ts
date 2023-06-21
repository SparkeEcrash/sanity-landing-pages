import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { v4 as uuidv4 } from "uuid";
import { getTagLabels } from "utils/getData";
import { groq } from "next-sanity";
//TODO: Convert then .then() callbacks to async await
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
    if (true) {
      const document = await sanityClient.create(doc).catch(console.error);
      if (!document) {
        return NextResponse.json(
          { error: "failed to create artwork document" },
          { status: 500 }
        );
      }
    }

    /* Handle Images */
    if (true) {
      for (let i = 0; i < images.length; i++) {
        const { type, name } = images[i] as Blob;
        const buffer = Buffer.from(await (images[i] as Blob).arrayBuffer());
        await sanityClient.assets
          .upload("image", buffer, {
            filename: name,
            contentType: type,
          })
          .then(async (doc) => {
            if (!("_id" in doc)) {
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
                  _ref: doc._id,
                },
              },
            };
            await sanityClient
              .create(artworkImage)
              .then(async (doc) => {
                if (!("_id" in doc)) {
                  return NextResponse.json(
                    { error: "failed to create artwork image" },
                    { status: 500 }
                  );
                }
                await sanityClient
                  .patch(id)
                  .setIfMissing({ images: [] })
                  .insert("after", "images[-1]", [
                    {
                      _key: doc._id,
                      _type: "reference",
                      _ref: doc._id,
                    },
                  ])
                  .commit()
                  .then((doc) => {
                    //TODO: proper validation check here necessary
                    if (doc.images.length === 0) {
                      return NextResponse.json(
                        { error: "failed to attach artwork image to document" },
                        { status: 500 }
                      );
                    }
                  })
                  .catch(console.error);
              })
              .catch(console.error);
          })
          .catch(console.error);
      }
    }

    /* Handle Tags */
    if (true) {
      const { data: tagLabels } = await getTagLabels();
      tags.forEach(async (tag: string) => {
        const existingTag = tagLabels.find(
          (tagDoc: TagProps) => tagDoc.label === tag
        );
        if (existingTag) {
          // let obj = arr.find(o => o.name === 'string 1');
          await sanityClient
            .patch(id)
            .setIfMissing({ tags: [] })
            .insert("after", "tags[-1]", [
              {
                _key: existingTag._id,
                _type: "reference",
                _ref: existingTag._id,
              },
            ])
            .commit()
            .then((doc) => {
              if (doc.tags.length === 0) {
                return NextResponse.json(
                  { error: "failed to attach tag to document" },
                  { status: 500 }
                );
              }
            })
            .catch(console.error);
        } else {
          const doc = {
            _type: "tag",
            label: tag,
          };
          await sanityClient
            .create(doc)
            .then(async (doc) => {
              await sanityClient
                .patch(id)
                .setIfMissing({ tags: [] })
                .insert("after", "tags[-1]", [
                  {
                    _key: doc._id,
                    _type: "reference",
                    _ref: doc._id,
                  },
                ])
                .commit()
                .then((doc) => {
                  if (doc.tags.length === 0) {
                    return NextResponse.json(
                      { error: "failed to attach tag to document" },
                      { status: 500 }
                    );
                  }
                })
                .catch(console.error);
            })
            .catch(console.error);
        }
      });
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
