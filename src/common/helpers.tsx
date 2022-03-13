export const isNumeric = (n: any) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const smartSplice = (
  array: (string | number | {})[],
  insertable: {} | string | number,
  index: number
): (string | number | {})[] => {
  return [...array.slice(0, index), insertable, ...array.slice(index)];
};

export const checkNumericInputValue = (input: any): boolean | "" =>
  isNumeric(input) || input === "";
export const sanitizeNumericInput = (input: any): number | "" => {
  if (input === "") return "";
  if (!isNumeric(input)) return "";
  return parseInt(input);
};
