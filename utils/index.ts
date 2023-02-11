export const transformFileName = (fileName: string) => {
  return fileName.replace(/[ ]+/g, "-");
};

export const isGetAllRecords = (
  fieldAffected: string[],
  query: { [key: string]: any }
) => {
  return Object.keys(query).every(
    (key: string) => !fieldAffected.includes(key)
  );
};
