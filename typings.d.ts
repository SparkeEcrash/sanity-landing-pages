interface SanityBody {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
}

interface ITag extends SanityBody {
  label: string;
}

interface IImage {
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

interface IArtworkImage extends SanityBody {
  image: IImage;
  height: number;
  width: number;
  aid: string;
  uid: string;
  dateUploaded: string;
  imageUrl: string;
}

interface IUser extends SanityBody {
  uid: string;
  name: string;
  email: string;
  image: string;
  username: string;
  password: string;
  provider: string;
  roles: string[];
  isEmailVerified?: boolean;
  isPasswordSet: boolean;
  dateJoined: string;
  dateUpdated: string;
  dateUpdatedNumber: number;
}

interface ILike extends SanityBody {
  user: IUser;
  artwork: IArtwork;
  uid: string;
  aid: string;
  datePosted: string;
  datePostedNumber: number;
}

interface IComment extends SanityBody {
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

interface IArtwork extends SanityBody {
  title: string;
  comment: string;
  images: IArtworkImage[];
  tags: ITag[];
  posted: boolean;
  uid: string;
  user: IUser;
  likes: ILike[];
  comments: IComment[];
  views: number;
  isMaker: boolean;
  isForSale: boolean;
  price: string;
  dateUploaded: string;
  dateUploadedNumber: number;
  dateUpdated?: string;
  dateUpdatedNumber?: number;
  isDeleted?: boolean;
}
