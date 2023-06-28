import { avatars } from "statics";

export const getDefaultUserAvatar = () =>
  avatars[Math.floor(Math.random() * avatars.length)];

export const verifyEmail = (email: string) => {
  return !!email.match(
    /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
  );
};

export const parseJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const getTodayDate = (): string => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const getDateNow = (): number => {
  return Date.now();
};

export const changeDateFormat = (date: string): string | null => {
  const pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
  if (!date || !date.match(pattern)) {
    return null;
  }
  return date.replace(pattern, "$2/$3/$1");
};

export const isFirstDateMoreRecent = (dateOne: string, dateTwo: string) => {
  return Date.parse(dateOne) > Date.parse(dateTwo);
};

export const trimString = (count: number, string: string): string => {
  if (string.length > count) {
    return string.substring(0, count - 3) + "...";
  } else {
    return string;
  }
};

export const setDimensionsForWindow = (
  width: number,
  height: number,
  windowWidth: number,
  windowHeight: number
): { width: number; height: number } => {
  const isLandscape = width >= height;
  if (isLandscape) {
    const scale = windowHeight / height;
    const newWidth = width * scale;
    return {
      width: newWidth,
      height: windowHeight,
    };
  } else {
    const scale = windowWidth / width;
    const newHeight = height * scale;
    return {
      width: windowWidth,
      height: newHeight,
    };
  }
};

export const setMaxDimensions = (
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const isLandscape = width >= height;
  if (isLandscape) {
    const isTooWide = width > maxWidth;
    if (isTooWide) {
      const shrinkPercentage = maxWidth / width;
      const newHeight = Math.round(height * shrinkPercentage);
      return {
        width: maxWidth,
        height: newHeight,
      };
    } else {
      return {
        width,
        height,
      };
    }
  } else {
    const isTooTall = height > width;
    if (isTooTall) {
      const shrinkPercentage = maxHeight / height;
      const newWidth = Math.round(width * shrinkPercentage);
      return {
        width: newWidth,
        height: maxHeight,
      };
    } else {
      return {
        width,
        height,
      };
    }
  }
};
