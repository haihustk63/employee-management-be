export const transformFileName = (fileName: string) => {
  return encodeURI(fileName);
};

export const isGetAllRecords = (
  fieldAffected: string[],
  query: { [key: string]: any }
) => {
  return Object.keys(query).every(
    (key: string) => !fieldAffected.includes(key)
  );
};

export const roundHalf = (num: number) => {
  return (Math.round(num * 2) / 2).toFixed(1);
};
