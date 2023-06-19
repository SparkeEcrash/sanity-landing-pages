import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate, getDateNow } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { groq } from "next-sanity";
import { getTagLabels } from "utils/getData";
import { toggleHideComment } from "utils/patchData";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const user = session && session.user;
  const uid = user && user.uid;
  const form = await request.formData();
  const blob = form.get("blob");
  const formData = JSON.parse(await (blob as Blob)!.text());
  const {
    posted: postedUpdated,
    imageDetails: imageDetailsUpdated,
    title: titleUpdated,
    comment: commentUpdated,
    tags: tagsUpdated,
    isMaker: isMakerUpdated,
    isForSale: isForSaleUpdated,
    price: priceUpdated,
    comments: commentsUpdated,
    aid,
  } = formData;
  const imagesUpdated = form.getAll("image");

  const titleTrimmedUpdated = titleUpdated.trim();
  const commentTrimmedUpdated = commentUpdated.trim();

  if (
    imageDetailsUpdated &&
    titleUpdated &&
    commentUpdated &&
    tagsUpdated &&
    imagesUpdated.length !== 0 &&
    aid
  ) {
    const query = groq`
    *[_type == "artwork" && _id == "${aid}"][0]{
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
    const artworkToUpdate = await sanityClient
      .fetch(query)
      .catch(console.error);
    const { tags, comments, images } = artworkToUpdate;
    const dateUpdated = getTodayDate();
    const dateUpdatedNumber = getDateNow();

    if (artworkToUpdate !== null) {
      //handle shallow updates
      await sanityClient
        .patch(aid)
        .set({ posted: postedUpdated })
        .set({ title: titleTrimmedUpdated })
        .set({ comment: commentTrimmedUpdated })
        .set({ isMaker: isMakerUpdated })
        .set({ isForSale: isForSaleUpdated })
        .set({ price: priceUpdated })
        .setIfMissing({ dateUpdated: "" })
        .setIfMissing({ dateUpdatedNumber: 0 })
        .set({ dateUpdated })
        .set({ dateUpdatedNumber })
        .commit()
        .catch((err) =>
          console.error("Updating artwork failed: ", err.message)
        );

      //handle tags
      let isTagsChanged = false;
      if (tagsUpdated.length !== tags.length) {
        isTagsChanged = true;
      } else {
        for (let i = 0; i < tagsUpdated.length; i++) {
          if (tagsUpdated[i] !== tags[i].label) {
            isTagsChanged = true;
          }
        }
      }
      if (isTagsChanged) {
        await sanityClient.patch(aid).unset(["tags"]).commit();
        const { data: tagLabels } = await getTagLabels();
        for (let i = 0; i < tagsUpdated.length; i++) {
          if (tags[i] && tagsUpdated[i] === tags[i].label) {
            await sanityClient
              .patch(aid)
              .setIfMissing({ tags: [] })
              .insert("after", "tags[-1]", [
                {
                  _key: tags[i]._id,
                  _ref: tags[i]._id,
                  _type: "reference",
                },
              ])
              .commit();
          } else {
            const existingTag = tagLabels.find(
              (tagDoc: TagProps) => tagDoc.label === tagsUpdated[i]
            );
            if (existingTag) {
              await sanityClient
                .patch(aid)
                .setIfMissing({ tags: [] })
                .insert("after", "tags[-1]", [
                  {
                    _key: existingTag._id,
                    _ref: existingTag._id,
                    _type: "reference",
                  },
                ])
                .commit();
            } else {
              const newTag = {
                _type: "tag",
                label: tagsUpdated[i],
              };
              const docTag = await sanityClient.create(newTag);
              await sanityClient
                .patch(aid)
                .setIfMissing({ tags: [] })
                .insert("after", "tags[-1]", [
                  {
                    _key: docTag._id,
                    _ref: docTag._id,
                    _type: "reference",
                  },
                ])
                .commit();
            }
          }
        }
      }
      //handle comments
      for (let i = 0; i < commentsUpdated.length; i++) {
        if (commentsUpdated[i].isHidden !== comments[i].isHidden) {
          await toggleHideComment({
            comment_id: commentsUpdated[i]._id,
            isHidden: comments[i].isHidden,
          });
        }
      }
      //handle images
      let isImagesChanged = false;
      if (imagesUpdated.length !== images.length) {
        isImagesChanged = true;
      } else {
        for (let i = 0; i < imagesUpdated.length; i++) {
          if (typeof imagesUpdated[i] !== "string") {
            isImagesChanged = true;
          } else {
          }
        }
      }
      if (isImagesChanged) {
        await sanityClient.patch(aid).unset(["images"]).commit();
        for (let i = 0; i < imagesUpdated.length; i++) {
          if (images[i] && imagesUpdated[i] === images[i]._id) {
            await sanityClient
              .patch(aid)
              .setIfMissing({ images: [] })
              .insert("after", "images[-1]", [
                {
                  _key: images[i]._id,
                  _ref: images[i]._id,
                  _type: "reference",
                },
              ])
              .commit();
          } else {
            const { type, name } = imagesUpdated[i] as Blob;
            const buffer = Buffer.from(
              await (imagesUpdated[i] as Blob).arrayBuffer()
            );
            const uploadedImage = await sanityClient.assets.upload(
              "image",
              buffer,
              {
                filename: name,
                contentType: type,
              }
            );
            if (!("_id" in uploadedImage)) {
              return NextResponse.json(
                { error: "failed to upload image" },
                { status: 500 }
              );
            }
            const { height, width } = imageDetailsUpdated[i].dimensions;
            const artworkImage = {
              _type: "artworkImage",
              height,
              width,
              aid,
              uid,
              dateUploaded: dateUpdated,
              image: {
                _type: "image",
                asset: {
                  _type: "reference",
                  _ref: uploadedImage._id,
                },
              },
            };
            const docArtImage = await sanityClient.create(artworkImage);
            if (!("_id" in docArtImage)) {
              return NextResponse.json(
                { error: "failed to create artwork image" },
                { status: 500 }
              );
            }
            const docArtworkWithImage = await sanityClient
              .patch(aid)
              .setIfMissing({ images: [] })
              .insert("after", "images[-1]", [
                {
                  _key: docArtImage._id,
                  _type: "reference",
                  _ref: docArtImage._id,
                },
              ])
              .commit();
            if (docArtworkWithImage.images.length === 0) {
              return NextResponse.json(
                { error: "failed to attach artwork image to document" },
                { status: 500 }
              );
            }
          }
        }
        //check for deleted artworks and set their status to deleted
        const deletedArtworks: string[] = [];
        images.forEach(({ _id }: { _id: string }) => {
          if (!imagesUpdated.includes(_id)) {
            deletedArtworks.push(_id);
          }
        });
        if (deletedArtworks.length > 0) {
          for (let i = 0; deletedArtworks.length > i; i++) {
            sanityClient
              .patch(deletedArtworks[i])
              .setIfMissing({ isDeleted: true })
              .commit()
              .catch((err) =>
                console.error("Marking deleted artworks failed: ", err.message)
              );
          }
        }
      }
    } else {
      return NextResponse.json(
        { data: "Updating artwork failed" },
        { status: 500 }
      );
    }

    //return updated data
    const queryTwo = groq`
		*[_type == "artwork" && uid == "${uid}"]{
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
  } else {
    return NextResponse.json(
      { data: "Updating artwork failed" },
      { status: 500 }
    );
  }
}
