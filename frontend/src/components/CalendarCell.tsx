/**
 * CalendarCell Component
 *
 * A reusable component that represents a cell in a calendar, displaying information about lessons for a specific time slot.
 *
 * @param {boolean} isHighlighted - Determines if the cell is highlighted (e.g., the current hour).
 * @param {Lesson[]} cellLessons - An array of lessons scheduled for the specific time slot represented by this cell.
 * @param {() => void} onPress - A callback function triggered when the cell is pressed.
 */

import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Lesson from "../dto/lesson/lesson.dto";

// Props interface for the CalendarCell component
interface Props {
  /**
   * Indicates whether the cell is highlighted (e.g., current time slot).
   */
  isHighlighted: boolean;

  /**
   * Array of lessons scheduled for the time slot this cell represents.
   */
  cellLessons: Lesson[];

  /**
   * Callback function to handle cell press events.
   */
  onPress: () => void;
}

// CalendarCell functional component
const CalendarCell: React.FC<Props> = ({
  isHighlighted,
  cellLessons,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.cell,
      cellLessons.length > 0 && styles.withLessons,
      isHighlighted && styles.highlighted,
    ]}
    onPress={onPress}
  >
    {/* Display a notification badge if there are 3 or more lessons */}
    {cellLessons.length >= 3 && (
      <View style={styles.notification}>
        <Text style={styles.notificationText}>{cellLessons.length}</Text>
      </View>
    )}

    {/* Display details of each lesson if there are fewer than 3 lessons */}
    {cellLessons.length < 3 && (
      <View style={styles.lessonContent}>
        {cellLessons.map((lesson, index) => (
          <View key={index} style={styles.lessonInfo}>
            <Text style={styles.lessonType}>{lesson.typeLesson}</Text>
            <Text style={styles.lessonSpecialties}>
              {lesson.specialties.length > 1
                ? "Mixed Swimming Styles"
                : lesson.specialties.join(", ")}
            </Text>
          </View>
        ))}
      </View>
    )}
  </TouchableOpacity>
);

// Styles for the CalendarCell component
const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 145,
    height: 125,
    backgroundColor: "transparent", // Make the background transparent
  },
  highlighted: {
    backgroundColor: "#d0f0fd", // Subtle blue for the current hour cell
  },
  withLessons: {
    backgroundColor: "#c8e6c9", // Light green for cells with lessons
  },
  notification: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "red",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  lessonContent: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  lessonInfo: {
    marginBottom: 5,
    alignItems: "center",
  },
  lessonType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  lessonSpecialties: {
    fontSize: 12,
    color: "#555",
  },
});

export default CalendarCell;
