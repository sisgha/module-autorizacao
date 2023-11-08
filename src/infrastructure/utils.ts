export const tryJSONParse = (data: any) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};
