import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
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
    {cellLessons.length > 0 && (
      <View style={styles.notification}>
        <Text style={styles.notificationText}>{cellLessons.length}</Text>
      </View>
    )}
    <Text style={styles.text}></Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // Ensure notification positioning works
    width: "100%", // Consistent cell width
    height: 50, // Consistent cell height
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
  notification: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 12, // Ensure a perfect circle
    width: 24, // Adjust size to fully surround text
    paddingHorizontal: 8, // Add horizontal padding for larger numbers
    height: 24,
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
