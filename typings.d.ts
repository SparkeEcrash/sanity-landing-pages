interface SanityBody {
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
  _type: string;
  _updatedAt?: string;
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

interface ILike extends SanityBody {
  uid: string;
  aid: string;
  name: string;
  userEmail: string;
  userImage: string;
  username: string;
  datePosted: string;
  datePostedNumber: number;
}

interface IComment extends SanityBody {
  uid: string;
  name: string;
  userImage: string;
  userEmail: string;
  username: string;
  comment: string;
  datePosted: string;
  datePostedNumber: number;
  dateUpdated?: string;
  dateUpdatedNumber?: number;
}

interface IArtwork extends SanityBody {
  title: string;
  comment: string;
  images: IArtworkImage[];
  tags: ITag[];
  posted: boolean;
  uid: string;
  name: string;
  userImage: string;
  userEmail: string;
  username: string;
  likes: ILike[];
  comments: IComment[];
  views: number;
  isMaker: boolean;
  isForSale: boolean;
  price: string;
  dateUploaded: string;
  dateUploadedNumber: number;
}
