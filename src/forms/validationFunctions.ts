export const validation = {
  isNotPlaceholderValue(placeholder: string) {
    return (value: string) => {
      if (value === placeholder) {
        return "Please select an option"
      }
      return true
    };
  },
};