import React, { useState } from "react";
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

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Helper function to calculate the dates for the current week
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

const { width, height } = Dimensions.get("window");

const CalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    day: string;
    hour: string;
  } | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  const weekDates = getWeekDates(currentWeekOffset); // Get the dates for the current week
  const today = new Date().toDateString(); // Today's date as a string for comparison

  const handleCellPress = (day: string, hour: string) => {
    setSelectedCell({ day, hour });
    setModalVisible(true);
  };

  const goToPreviousWeek = () => setCurrentWeekOffset((prev) => prev - 7);
  const goToNextWeek = () => setCurrentWeekOffset((prev) => prev + 7);

  return (
    <View style={styles.container}>
      {/* Week Navigation */}
      <View style={styles.navigation}>
        <Button mode="outlined" onPress={goToPreviousWeek}>
          {"<"}
        </Button>
        <Button mode="outlined" onPress={goToNextWeek}>
          {">"}
        </Button>
      </View>

      {/* Calendar Grid */}
      <ScrollView style={styles.scrollable} contentContainerStyle={styles.grid}>
        <View style={styles.hoursColumn}>
          {Array.from({ length: 18 }, (_, i) => {
            const hour = i + 6; // Start from 06:00
            return (
              <View key={hour} style={styles.hourCell}>
                <Text style={styles.hourLabel}>{hour}:00</Text>
              </View>
            );
          })}
        </View>
        {weekDates.map((date, index) => (
          <View
            key={daysOfWeek[index]}
            style={[
              styles.column,
              date.toDateString() === today ? styles.highlightedColumn : null,
            ]}
          >
            <Text
              style={[
                styles.dayHeader,
                date.toDateString() === today ? styles.todayHeader : null,
              ]}
            >
              {daysOfWeek[index]} {date.getDate()}/{date.getMonth() + 1}
            </Text>
            {Array.from({ length: 18 }).map((_, hour) => (
              <CalendarCell
                key={`${daysOfWeek[index]}-${hour}`}
                time={`${hour + 6}:00`} // Start from 06:00
                isHighlighted={
                  hour + 6 === new Date().getHours() &&
                  date.toDateString() === today
                }
                onPress={() =>
                  handleCellPress(daysOfWeek[index], `${hour + 6}:00`)
                }
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Modal for Cell Details */}
      <CustomModal
        visible={modalVisible}
        title={`Details for ${selectedCell?.day || ""}, ${
          selectedCell?.hour || ""
        }`}
        onClose={() => setModalVisible(false)}
      >
        <Text>Lesson Details</Text>
      </CustomModal>
      {/* Back Button */}
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
    paddingTop: StatusBar.currentHeight || 24, // Add padding for status bar
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
    backgroundColor: "#d1c4e9", // Darker purple for the hours column
    justifyContent: "flex-start",
    paddingTop: height / 40, // Align hours with rows
  },
  hourCell: {
    height: height / 20, // Dynamic height for uniformity
    justifyContent: "center",
  },
  hourLabel: {
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },
  column: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: "#ddd",
  },
  highlightedColumn: {
    backgroundColor: "#bbdefb", // Light blue for today's column
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#e1bee7", // Light purple background for headers
    paddingVertical: 5,
    width: "100%",
  },
  todayHeader: {
    backgroundColor: "#7e57c2", // Stronger blue-purple for today's header
    color: "#fff", // White text for contrast
  },
});

export default CalendarScreen;
