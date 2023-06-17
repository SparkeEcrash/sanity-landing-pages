interface ArtworkProps {
  _id: string;
  title: string;
  images: ArtworkImageProps[];
  comment: string;
  posted: boolean;
  tags: TagProps[];
  uid: string;
  name: string;
  userImage: string;
  userEmail: string;
  username: string;
  views: number;
  likes: LikeProps[];
  comments: CommentProps[];
  isMaker: boolean;
  isForSale: boolean;
  price: string;
  dateUploaded: string;
  dateUploadedNumber: number;
  dateModified?: string;
  aid: string;
  isVisitorLiked?: boolean;
}

interface ArtworkImageProps {
  height: number;
  width: number;
  imageUrl: string;
}

interface LikeProps {
  _id: string;
  uid: string;
  name: string;
  username: string;
  userImage: string;
  userEmail: string;
  datePosted: string;
  datePostedNumber: number;
}

interface CommentProps {
  _id: string;
  uid: string;
  name: string;
  username: string;
  userImage: string;
  userEmail: string;
  comment: string;
  datePosted: string;
  datePostedNumber: number;
  dateUpdated?: string;
  dateUpdatedNumber?: number;
}

interface TagProps {
  _id: string;
  label: string;
}
