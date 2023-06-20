/* reference */
/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */

export const checkNewUser = async (uid: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/checkNewUser?user=${uid}`
  );
  return await res.json();
};

export const getTagLabels = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getTagLabels`
  );
  return await res.json();
};

export const getTag = async (tagLabel: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getTag?tagLabel=${tagLabel}`
  );
  return await res.json();
};

export const getUserArtworks = async (uid: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getArtworks?user=${uid}`
  );
  return await res.json();
};

export const getGalleryArtwork = async (aid: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery/getArtwork?aid=${aid}`
  );
  return await res.json();
};

export const getGalleryArtworks = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery/getArtworks`
  );
  return await res.json();
};

export const getGalleryTagsAndArtworks = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery/getTagsAndArtworks`
  );
  return await res.json();
};
