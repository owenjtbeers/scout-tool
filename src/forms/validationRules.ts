export const validationRules = {
  requiredAndMinMaxLength: (minLength: number, maxLength: number) => ({
    required: {
      value: true,
      message: "Must specify a field name",
    },
    minLength: { value: minLength, message: "" },
    maxLength: maxLength,
  })
}