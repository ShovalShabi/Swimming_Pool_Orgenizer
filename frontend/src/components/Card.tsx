/**
 * CustomCard Component
 *
 * A reusable and customizable card component for React Native applications.
 *
 * @param {string} title - The title text displayed at the top of the card.
 * @param {string} [description] - An optional description text displayed below the title.
 * @param {() => void} onPress - A callback function triggered when the card is pressed.
 * @param {ViewStyle | ViewStyle[]} [style] - Optional custom styles for the card, either as a single style object or an array of style objects.
 * @param {React.ReactNode} [children] - Optional child components to be rendered inside the card.
 */

import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

// Props interface for the CustomCard component
interface CustomCardProps {
  /**
   * The title text displayed at the top of the card.
   */
  title: string;

  /**
   * Optional description text displayed below the title.
   */
  description?: string;

  /**
   * Callback function triggered when the card is pressed.
   */
  onPress: () => void;

  /**
   * Optional custom styles for the card.
   * Can be a single style object or an array of style objects.
   */
  style?: ViewStyle | ViewStyle[];

  /**
   * Optional child components to be rendered inside the card.
   */
  children?: React.ReactNode;
}

// CustomCard functional component
const CustomCard: React.FC<CustomCardProps> = ({
  title,
  description,
  onPress,
  style,
  children,
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
    <Text style={styles.title}>{title}</Text>
    {description && <Text style={styles.description}>{description}</Text>}
    {children}
  </TouchableOpacity>
);

// Styles for the CustomCard component
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#00D5FA", // Bright blue background color for the card
    borderRadius: 10, // Rounded corners for the card
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    padding: 20, // Padding inside the card
  },
  title: {
    fontSize: 18, // Large font size for the title
    fontWeight: "bold", // Bold font style for the title
    color: "#FFFFFF", // White text color for the title
  },
  description: {
    fontSize: 14, // Medium font size for the description
    color: "#FFFFFF", // White text color for the description
  },
});

export default CustomCard;
