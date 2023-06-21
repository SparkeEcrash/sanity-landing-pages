/* reference */
/* https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch */

export const createUser = async (user: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/createUser`,
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

export const addUserArtwork = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/artworks/addUserArtwork`,
      {
        method: "POST", // or 'PUT'
        // headers: {
        //   "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary1nIgQNfiPQybbJjt",
        // },
        /*Deliberately set "Content-Type" to undefined so that the browser or client can set the proper webkit boundary value ("boundary=---....") depending on the content inside the formdata you are sending*/
        body: data,
      }
    );
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const addComment = async (data: any) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/gallery/addComment`,
      {
        method: "POST", // or 'PUT'
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
