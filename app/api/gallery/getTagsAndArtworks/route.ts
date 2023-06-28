import { NextResponse, NextRequest } from "next/server";
import { sanityClient } from "sanity";
import { groq } from "next-sanity";
import { queryArtwork } from "@utils/groq";

export async function GET(request: NextRequest) {
  const query = groq`
	*[_type == "artwork" && posted == true && isDeleted != true]{
    ${queryArtwork}
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
