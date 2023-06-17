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

// export const addLike = async (args: { aid: string; uid: string }) => {
//   const { aid, uid } = args;
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery/addLike?aid=${aid}&uid=${uid}`
//   );
//   return await res.json();
// };
