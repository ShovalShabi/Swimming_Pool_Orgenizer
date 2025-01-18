import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Text, Button } from "react-native-paper";
import CustomModal from "../components/Modal";
import CalendarCell from "../components/CalendarCell";
import { DaysOfWeek } from "../utils/days-week-enum.utils";
import LessonService from "../services/lesson.service";
import Lesson from "../dto/lesson/lesson.dto";
import InstructorService from "../services/instructor.service";
import Instructor from "../dto/instructor/instructor.dto";

const { width, height } = Dimensions.get("window");

const getWeekDates = (offset: number) => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay + offset);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

const CalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    day: string;
    hour: string;
    lessons: Lesson[];
    date: Date;
  } | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [availableInstructors, setAvailableInstructors] = useState<
    Instructor[]
  >([]);
  const [errorMessage, setErrorMessage] = useState("");

  const weekDates = getWeekDates(currentWeekOffset);

  const fetchLessons = async () => {
    const start = weekDates[0];
    const end = new Date(weekDates[6].getTime() + 24 * 60 * 60 * 1000);

    const fetchedLessons = await LessonService.getLessonsWithinRange(
      start,
      end
    );
    setLessons(fetchedLessons);
  };

  const fetchAvailableInstructors = async (
    day: number,
    startTime: Date,
    endTime: Date
  ) => {
    try {
      const instructors = await InstructorService.getInstructorsByAvailability(
        day,
        startTime,
        endTime
      );
      console.log(instructors);
      setAvailableInstructors(instructors);
      setErrorMessage(
        instructors.length ? "" : "No instructors available for this time."
      );
    } catch (error) {
      setErrorMessage("Error fetching instructors.");
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [currentWeekOffset]);

  const handleCellPress = async (day: string, hour: string, date: Date) => {
    const cellLessons = lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.startAndEndTime.startTime);
      return (
        lessonDate.toDateString() === date.toDateString() &&
        lessonDate.getHours() === parseInt(hour.split(":")[0], 10)
      );
    });

    if (!cellLessons.length) {
      const startTime = new Date(date);
      startTime.setHours(parseInt(hour.split(":")[0], 10), 0, 0);

      const endTime = new Date(startTime);
      endTime.setHours(startTime.getHours() + 1);

      await fetchAvailableInstructors(date.getDay(), startTime, endTime);
    }

    setSelectedCell({ day, hour, lessons: cellLessons, date });
    setModalVisible(true);
  };

  const goToPreviousWeek = () => setCurrentWeekOffset((prev) => prev - 7);
  const goToNextWeek = () => setCurrentWeekOffset((prev) => prev + 7);

  const today = new Date();

  return (
    <View style={styles.container}>
      <View style={styles.navigation}>
        <Button mode="outlined" onPress={goToPreviousWeek}>
          {"<"}
        </Button>
        <Button mode="outlined" onPress={goToNextWeek}>
          {">"}
        </Button>
      </View>

      <ScrollView style={styles.scrollable} contentContainerStyle={styles.grid}>
        <View style={styles.column}>
          <View>
            <Text style={styles.dayHeader}>Hours\Days</Text>
          </View>
          {Array.from({ length: 18 }, (_, i) => (
            <View key={i} style={styles.column}>
              <Text style={styles.hourLabel}>{i + 6}:00</Text>
              <View style={styles.hourLine} />
            </View>
          ))}
        </View>

        {Object.keys(DaysOfWeek).map((key, index) => {
          const day = DaysOfWeek[key as keyof typeof DaysOfWeek];
          const date = weekDates[index];

          const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

          return (
            <View
              key={day}
              style={[styles.column, isToday ? styles.highlightedColumn : null]}
            >
              <Text style={styles.dayHeader}>
                {day} {date.getDate()}/{date.getMonth() + 1}
              </Text>
              {Array.from({ length: 18 }).map((_, hour) => {
                const cellLessons = lessons.filter((lesson) => {
                  const lessonDate = new Date(lesson.startAndEndTime.startTime);
                  return (
                    lessonDate.toDateString() === date.toDateString() &&
                    lessonDate.getHours() === hour + 6
                  );
                });

                return (
                  <CalendarCell
                    key={`${day}-${hour}`}
                    time={`${hour + 6}:00`}
                    isHighlighted={isToday && hour + 6 === today.getHours()}
                    hasLessons={cellLessons.length > 0}
                    onPress={() => handleCellPress(day, `${hour + 6}:00`, date)}
                  />
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        title={`Details for ${selectedCell?.day || ""}, ${
          selectedCell?.hour || ""
        }`}
        onClose={() => setModalVisible(false)}
      >
        {errorMessage ? (
          <Text>{errorMessage}</Text>
        ) : selectedCell?.lessons.length ? (
          selectedCell.lessons.map((lesson) => (
            <Button
              key={lesson.lessonId}
              onPress={() => {
                setModalVisible(false);
                setLessonModalVisible(true);
              }}
            >
              {lesson.typeLesson} -{" "}
              {new Date(lesson.startAndEndTime.startTime).toLocaleTimeString()}
            </Button>
          ))
        ) : (
          <Text>No lessons. Add a new one?</Text>
        )}
      </CustomModal>

      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Back to Main
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 24,
    backgroundColor: "#f6f6f6",
  },
  backButton: {
    margin: 10,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scrollable: {
    flex: 1,
  },
  grid: {
    flexDirection: "row",
  },
  hoursColumn: {
    width: width * 0.15,
    backgroundColor: "#d1c4e9",
    justifyContent: "flex-start",
    paddingTop: height / 40,
  },
  hourCell: {
    height: height / 20,
    justifyContent: "center",
    position: "relative",
  },
  hourLabel: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },
  hourLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#ddd",
  },
  column: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: "#ddd",
  },
  highlightedColumn: {
    backgroundColor: "#bbdefb",
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#e1bee7",
    paddingVertical: 5,
    width: "100%",
  },
});

export default CalendarScreen;
