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