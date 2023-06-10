export const getTodayDate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
};

export const trimString = (count: number, string: string) => {
  if (string.length > count) {
    return string.substring(0, count - 3) + "...";
  } else {
    return string;
  }
};
