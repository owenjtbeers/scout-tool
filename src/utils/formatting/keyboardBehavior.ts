import { Platform } from "react-native"

export const keyboardBehavior = () => {
  return Platform.OS === 'ios' ? 'height' : 'padding'
}