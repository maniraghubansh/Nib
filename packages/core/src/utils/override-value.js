/**
 * The function will override values in first object,
 * with the corresponding value if present in second object, and
 * add key-value pairs which are not present in obj1 but are in obj2
 */
const overrideValue = (obj1, obj2) => {
  if (obj2 === undefined) return obj1;
  const result = {};
  Object.keys(obj1).forEach(key => {
    if (typeof obj1[key] === "object") {
      result[key] = overrideValue(obj1[key], obj2[key]);
    } else {
      result[key] = obj2[key] === undefined ? obj1[key] : obj2[key];
    }
  });
  Object.keys(obj2).forEach(key => {
    if (result[key] === undefined) {
      result[key] = obj2[key];
    }
  })
  return result;
};

export default overrideValue;
