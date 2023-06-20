import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";

export async function GET(request: NextRequest) {
  const query = groq`
	*[_type == "artwork" && posted == true && isDeleted != true]{
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

  const artworks = await sanityClient.fetch(query).catch(console.error);
  let tags: TagProps[] = [];
  let tagsWithCount: TagButtons[] = [];
  artworks.forEach((artwork: ArtworkProps) => {
    tags = [...tags, ...artwork.tags];
  });

  tags.forEach((tag) => {
    const index = tagsWithCount.findIndex(
      (tagCount) => tagCount._id === tag._id
    );
    if (index === -1) {
      tagsWithCount = [...tagsWithCount, { ...tag, count: 1 }];
    } else {
      tagsWithCount[index]["count"] = tagsWithCount[index]["count"]! + 1;
    }
  });

  if (artworks !== null) {
    return NextResponse.json({ artworks, tagsWithCount }, { status: 200 });
  } else {
    return NextResponse.json({ artworks, tagsWithCount }, { status: 404 });
  }
}
