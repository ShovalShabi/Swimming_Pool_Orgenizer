import { Alert } from "react-native";

const useAlert = () => {
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
