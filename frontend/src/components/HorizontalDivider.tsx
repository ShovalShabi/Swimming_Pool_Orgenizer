import React from "react";
import { View, StyleSheet } from "react-native";

const HorizontalDivider = ({
  color = "#ccc",
  thickness = 1,
  marginVertical = 10,
}) => {
  return (
    <View
      style={[
        styles.divider,
        { backgroundColor: color, height: thickness, marginVertical },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: "100%", // Full width by default
  },
});

export default HorizontalDivider;
