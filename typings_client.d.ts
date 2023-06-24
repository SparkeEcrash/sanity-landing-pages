interface UserProfileProps {
  name: string;
  userEmail: string;
  userImage: string;
  username: string;
}

interface ArtworkProps {
  _id: string;
  _updatedAt: string;
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
  dateUpdated?: string;
  dateUpdatedNumber?: number;
  aid: string;
  isVisitorLiked?: boolean;
}

interface ArtworkImageProps {
  _id: string;
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
  isHidden: boolean;
  hiddenBy?: string;
}

interface TagProps {
  _id: string;
  label: string;
}

interface TagButtons {
  _id: string;
  label: string;
  count?: number;
}