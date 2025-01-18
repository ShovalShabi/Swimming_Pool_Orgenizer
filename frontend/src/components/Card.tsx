import React, { Children } from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

interface CustomCardProps {
  title: string;
  description?: string;
  onPress: () => void;
  style?: ViewStyle; // Accept additional styles
  children?: React.ReactNode;
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  description,
  onPress,
  style,
  children,
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#00D5FA",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  description: {
    fontSize: 14,
    color: "#FFFFFF",
  },
});

export default CustomCard;
