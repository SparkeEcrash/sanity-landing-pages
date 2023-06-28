/* reference */
/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */

const authorization = (accessToken: string) => ({
  headers: {
    authorization: accessToken,
  },
});

export const loginUser = async (user: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/login`,
      {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

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

export const getUserArtworks = async ({
  uid,
  accessToken,
}: {
  uid: string;
  accessToken: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getArtworks?user=${uid}`,
    authorization(accessToken)
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

export const getUserLikedArtworks = async ({
  uid,
  accessToken,
}: {
  uid: string;
  accessToken: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getLikedArtworks?user=${uid}`,
    authorization(accessToken)
  );
  return await res.json();
};

export const getUserCommentedArtworks = async ({
  uid,
  accessToken,
}: {
  uid: string;
  accessToken: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/getCommentedArtworks?user=${uid}`,
    authorization(accessToken)
  );
  return await res.json();
};
