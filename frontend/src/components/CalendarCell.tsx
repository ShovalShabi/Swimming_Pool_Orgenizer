import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface Props {
  time: string;
  isHighlighted: boolean;
  hasLessons: boolean;
  onPress: () => void;
}

const CalendarCell: React.FC<Props> = ({
  time,
  isHighlighted,
  hasLessons,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.cell,
      isHighlighted && styles.highlighted,
      hasLessons && styles.withLessons,
    ]}
    onPress={onPress}
  >
    {hasLessons ? (
      <Text style={styles.lessonIndicator}>Lessons</Text>
    ) : (
      <Text style={styles.text}></Text>
    )}
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
  withLessons: {
    backgroundColor: "#c8e6c9", // Light green to indicate lessons
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
  lessonIndicator: {
    fontSize: 14,
    color: "#1b5e20", // Dark green to indicate lessons
    fontWeight: "bold",
  },
});

export default CalendarCell;
