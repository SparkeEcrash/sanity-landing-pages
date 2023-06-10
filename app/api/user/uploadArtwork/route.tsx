import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { getTodayDate } from "utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@nextauth/route";
import { v4 as uuidv4 } from "uuid";
import { groq } from "next-sanity";
import { getTagLabels, getTag } from "utils/getData";

export async function POST(request: NextRequest) {
  // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
  const data = await getServerSession(authOptions);
  const uid = data && data.user.uid;

  //https://www.sanity.io/plugins/sanity-plugin-media-library

  const form = await request.formData();
  const blob = form.get("blob");
  const formData = JSON.parse(await (blob as Blob)!.text());
  const { posted, imageDetails, name, comment, tags } = formData;
  const images = form.getAll("image");
  const dateUploaded = getTodayDate();
  const id = uuidv4();
  
  /* Validation check */
  if (imageDetails && name && comment && tags && images.length !== 0) {
    const doc = {
      _type: "artwork",
      _id: id,
      name,
      comment,
      uid,
      dateUploaded,
      posted,
    };

    /* Handle Artwork Document */
    if (false) {
      const document = await sanityClient.create(doc);
      if (!("_id" in document)) {
        return NextResponse.json(
          { error: "failed to create artwork document" },
          { status: 500 }
        );
      }
    }

    /* Handle Images */
    if (false) {
      for (let i = 0; i < images.length; i++) {
        const { type, name: imageName } = images[i] as Blob;
        const buffer = Buffer.from(await (images[i] as Blob).arrayBuffer());
        sanityClient.assets
          .upload("image", buffer, {
            filename: imageName,
            contentType: type,
          })
          .then((doc) => {
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
            sanityClient.create(artworkImage).then((doc) => {
              if (!("_id" in doc)) {
                return NextResponse.json(
                  { error: "failed to create artwork image" },
                  { status: 500 }
                );
              }
              sanityClient
                .patch(id)
                .setIfMissing({ images: [] })
                .insert("after", "images[-1]", [
                  {
                    _key: `artworkImage-${i}`,
                    _type: "reference",
                    _ref: doc._id,
                  },
                ])
                .commit()
                .then((doc) => {
                  if (doc.images.length === 0) {
                    return NextResponse.json(
                      { error: "failed to attach artwork image to document" },
                      { status: 500 }
                    );
                  }
                });
            });
          });
      }
    }

    /* Handle Tags */
    if (false) {
      const { data: tagLabels } = await getTagLabels();
      for (const [i, tag] of tags.entries()) {
        if (tagLabels.includes(tag)) {
          const {
            data: { _id: tagId },
          } = await getTag(tag);
          sanityClient
            .patch(id)
            .setIfMissing({ tags: [] })
            .insert("after", "tags[-1]", [
              {
                _key: `tag-${i}`,
                _type: "reference",
                _ref: tagId,
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
            });
        } else {
          const doc = {
            _type: "tag",
            label: tag,
          };
          sanityClient.create(doc).then((doc) => {
            sanityClient
              .patch(id)
              .setIfMissing({ tags: [] })
              .insert("after", "tags[-1]", [
                {
                  _key: `tag-${i}`,
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
              });
          });
        }
      }
    }
    return NextResponse.json(
      { success: "artwork upload was successful" },
      { status: 200 }
    );
  }
}
