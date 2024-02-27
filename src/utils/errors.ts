export function getErrorMessage(response: any): string {
  if (response && response.error && response.error.data) {
    if (typeof response.error.data === "string") {
      return response.error.data;
    } else if (typeof response.error.data === "object") {
      if (response.error.data.message) {
        return response.error.data.message;
      } else if (response.error.data.error) {
        return response.error.data.error;
      }
    }
  }
  return "Unknown error occurred";
}
