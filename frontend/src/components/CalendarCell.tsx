import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Lesson from "../dto/lesson/lesson.dto";

interface Props {
  isHighlighted: boolean;
  cellLessons: Lesson[];
  onPress: () => void;
}

const CalendarCell: React.FC<Props> = ({
  isHighlighted,
  cellLessons,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.cell,
      isHighlighted && styles.highlighted,
      cellLessons.length > 0 && styles.withLessons,
    ]}
    onPress={onPress}
  >
    {cellLessons.length > 0 ? (
      <Text style={styles.notification}>
        <Text style={styles.notificationText}>{cellLessons.length}</Text>
      </Text>
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
  notification: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default CalendarCell;
