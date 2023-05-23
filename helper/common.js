export const getFullDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + date.getMonth()).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
export const getFullTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString();
};
export const paginationFun = (data) => {
  const { page, limit } = data;
  return {
    limit: Number(limit) || 10,
    skip: Number(page) * Number(limit) || 0,
  };
};
export const inputPattern = {
  time: /^([01]\d|2[0-3]):[0-5]\d(?:AM|PM)$/,
  date: /^([0-2]\d|3[01])-(0\d|1[0-2])-20\d{2}$/,
  color: /^#[A-Fa-f0-9]{6}/,
};
export const validateMsg = (min, max, type) => {
  switch (type) {
    case "string":
      return {
        "string.empty": "This field cannot be empty.",
        "any.required": "This field is required and cannot be left blank.",
        "string.pattern.base":
          "The input value does not match the required pattern.",
        "string.base": "The input value must be a string.",
        "string.min":
          "The input value must be greater than or equal to " + min + ".",
        "string.max":
          "The input value must be less than or equal to " + max + ".",
      };
    case "number":
      return {
        "number.empty": "This field cannot be empty.",
        "any.required": "This field is required and cannot be left blank.",
        "number.pattern.base":
          "The input value does not match the required pattern.",
        "number.base": "The input value must be a number.",
        "number.min":
          "The input value must be greater than or equal to " + min + ".",
        "number.max":
          "The input value must be less than or equal to " + max + ".",
      };
    case "array":
      return {
        "array.empty": "This field cannot be empty.",
        "any.required": "This field is required and cannot be left blank.",
        "array.pattern.base":
          "The input value does not match the required pattern.",
        "array.base": "The input value must be a number.",
        "array.min":
          "The input value must be greater than or equal to " + min + ".",
        "array.max":
          "The input value must be less than or equal to " + max + ".",
      };
    default:
      break;
  }
};
