/**
 * HorizontalDivider Component
 *
 * A simple horizontal divider for separating content in React Native layouts.
 *
 * @param {string} [color="#ccc"] - The color of the divider. Defaults to light gray (`#ccc`).
 * @param {number} [thickness=1] - The thickness (height) of the divider in pixels. Defaults to `1`.
 * @param {number} [marginVertical=10] - The vertical margin (spacing) around the divider. Defaults to `10`.
 */

import React from "react";
import { View, StyleSheet } from "react-native";

// Props interface for HorizontalDivider
interface HorizontalDividerProps {
  /**
   * The color of the divider.
   * @default "#ccc"
   */
  color?: string;

  /**
   * The thickness (height) of the divider in pixels.
   * @default 1
   */
  thickness?: number;

  /**
   * The vertical margin (spacing) around the divider in pixels.
   * @default 10
   */
  marginVertical?: number;
}

// HorizontalDivider functional component
const HorizontalDivider: React.FC<HorizontalDividerProps> = ({
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

// Styles for HorizontalDivider
const styles = StyleSheet.create({
  divider: {
    width: "100%", // Full width by default
  },
});

export default HorizontalDivider;
