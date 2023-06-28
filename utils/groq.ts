import { groq } from "next-sanity";

export const queryUser = groq`
user-> {
	name,
	email,
	image,
	username,
}
`;

export const queryComments = groq`
comments[]-> {
	_id,
	user-> {
		name,
		email,
		image,
		username,
	},
	artwork-> {
		...,
		images[]-> {
			_id,
			height,
			width,
			"imageUrl": image.asset->url,
		}
	},
	uid,
	aid,
	comment,
	datePosted,
	datePostedNumber,
	dateUpdated,
	dateUpdatedNumber,
	isHidden,
	hiddenBy,
	}`;

export const queryLikes = groq`
likes[]-> {
	_id,
	uid,
	aid,
	datePosted,
	datePostedNumber,
	}`;

export const queryTags = groq`
tags[]-> {
	_id,
	label,
	}`;

export const queryImages = groq`
images[]-> {
	_id,
	height,
	width,
	"imageUrl": image.asset->url,
	}`;

export const queryArtwork = groq`
...,
${queryUser},
${queryComments},
${queryLikes},
${queryTags},
${queryImages}`;
