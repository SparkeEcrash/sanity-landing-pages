/* reference */
/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */

//use object.assign to overwrite data
export const toggleLike = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery/toggleLike`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const updateComment = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery/editComment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteComment = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery/deleteComment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const toggleHideComment = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/toggleHideComment`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const editUserArtwork = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/editUserArtwork`,
      {
        method: "PATCH",
        body: data,
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteUserArtwork = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/deleteUserArtwork`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const editUserProfile = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/editUserProfile`,
      {
        method: "PATCH",
        body: data,
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const deleteUserProfile = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/deleteUserProfile`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const resetPassword = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/resetPassword`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};
