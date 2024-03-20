export const validation = {
  isNotPlaceholderValue(placeholder: string | number | undefined) {
    return (value: string | number | undefined) => {
      if (value === placeholder) {
        return "Please select an option";
      }
      return true;
    };
  },
  isEmail(value: string) {
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      return "Please enter a valid email";
    }
    return true;
  },
};
