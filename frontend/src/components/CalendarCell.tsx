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
      cellLessons.length > 0 && styles.withLessons,
      isHighlighted && styles.highlighted,
    ]}
    onPress={onPress}
  >
    {cellLessons.length >= 3 && (
      <View style={styles.notification}>
        <Text style={styles.notificationText}>{cellLessons.length}</Text>
      </View>
    )}
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
