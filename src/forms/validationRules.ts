export const validationRules = {
  requiredAndMinMaxLength: (minLength: number, maxLength: number) => ({
    required: {
      value: true,
      message: "Must specify a field name",
    },
    minLength: {
      value: minLength,
      message: `Must be at least ${minLength} characters long`,
    },
    maxLength: {
      value: maxLength,
      message: `Must be at most ${maxLength} characters long`,
    },
  }),
};
