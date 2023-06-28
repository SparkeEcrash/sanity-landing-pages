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
  user: IUser;
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
  user: IUser;
  artwork: IArtwork;
  uid: string;
  aid: string;
  datePosted: string;
  datePostedNumber: number;
}

interface CommentProps {
  _id: string;
  uid: string;
  user: IUser;
  aid: string;
  artwork: IArtwork;
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
