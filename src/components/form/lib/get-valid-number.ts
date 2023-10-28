const numRegex = /^0$|^0[.][0-9]{0,2}$|^[1-9]{1}[0-9]{0,6}[.]?[0-9]{0,2}$/;

export const getValidNumber = (value: string, prevValue: string) => {
  if (value.length === 0) {
    return "";
  }

  if (/^0[0-9]/.test(value)) {
    return value.replace(/^0/, "");
  }

  if (numRegex.test(value)) {
    return value;
  }

  return prevValue;
};
