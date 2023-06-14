interface ArtworkProps {
  title: string;
  images: ArtworkImageProps[];
	comment: string;
  posted: boolean;
	tags: TagProps[];
	uid: string;
  views: number;
  likes: number;
	isMaker: boolean;
	isForSale: boolean;
	price: string;
	dateUploaded: string;
	dateUploadedNumber: number;
}

interface ArtworkImageProps {
	height: number;
	width: number;
	imageUrl: string;
}

interface TagProps {
	label: string;
}
