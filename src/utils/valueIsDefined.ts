export const valueIsDefined = (
  value: string | number | null | undefined
): boolean => {
  if (value === "") {
    return false;
  }
  return value !== null && value !== undefined;
};
