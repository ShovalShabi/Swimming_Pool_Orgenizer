import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  time: string;
  isHighlighted: boolean;
  onPress: () => void;
}

const CalendarCell: React.FC<Props> = ({ time, isHighlighted, onPress }) => (
  <TouchableOpacity
    style={[styles.cell, isHighlighted && styles.highlighted]}
    onPress={onPress}
  >
    <Text style={styles.text}>{time}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  highlighted: {
    backgroundColor: "#d0f0fd",
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});

export default CalendarCell;
