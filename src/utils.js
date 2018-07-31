const uniqueFlatten = arr => {
  const newArr = arr.filter(item => !!item).reduce((prev, item) => {
    if (Array.isArray(item)) {
      return [...prev, ...item];
    }
    return [...prev, item];
  }, []);
  return Array.from(new Set(newArr));
};

const trimAndRemoveUnderscore = text => text.replace(/_/g, ' ').trim();

module.exports = {
  uniqueFlatten,
  trimAndRemoveUnderscore,
};
