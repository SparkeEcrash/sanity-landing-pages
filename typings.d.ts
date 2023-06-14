interface ISanityBody {
  _createdAt: string;
  _id: string;
  _rev: string;
  _updatedAt: string;
  _type: string;
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

interface IArtworkImage extends SantiyBody {
  image: IImage;
  height: number;
  width: number;
  aid: string;
  uid: string;
  dateUploaded: string;
  imageUrl: string;
}

interface IArtwork extends SanityBody {
  title: string;
  comment: string;
  images: IArtworkImage[];
  tags: ITag[];
  posted: boolean;
  uid: string;
  dateUploaded: string;
  likes: number;
  views: number;
  isMaker: boolean;
  isForSale: boolean;
  price: string;
  dateUploaded: string;
  dateUploadedNumber: number;
}
