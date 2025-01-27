import { Alert } from "react-native";

/**
 * Custom Hook: useAlert
 *
 * Provides a reusable `showAlert` function to display alert dialogs in a React Native application.
 *
 * @returns {object} - An object containing the `showAlert` function.
 */
const useAlert = () => {
  /**
   * Displays an alert dialog.
   *
   * @param message - The message to display in the alert dialog.
   * @param title - The title of the alert dialog. Defaults to "Alert".
   * @param actions - An optional array of actions for the alert buttons. Each action contains:
   *   - `text`: The text to display on the button.
   *   - `onPress`: An optional callback function executed when the button is pressed.
   */
  const showAlert = (
    message: string,
    title: string = "Alert",
    actions?: { text: string; onPress?: () => void }[]
  ) => {
    Alert.alert(
      title,
      message,
      actions || [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
  };

  return { showAlert };
};

export default useAlert;
