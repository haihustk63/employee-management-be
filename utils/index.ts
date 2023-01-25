export const transformFileName = (fileName: string) => {
  return fileName.replace(/[ ]+/g, "-");
};
