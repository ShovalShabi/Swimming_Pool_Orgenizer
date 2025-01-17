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
      <ScrollView contentContainerStyle={styles.grid}>
        {weekDates.map((date, index) => (
          <View
            key={daysOfWeek[index]}
            style={[
              styles.column,
              date.toDateString() === today ? styles.highlightedColumn : null,
            ]}
          >
            <Text style={styles.dayHeader}>
              {daysOfWeek[index]} {date.getDate()}/{date.getMonth() + 1}
            </Text>
            {Array.from({ length: 24 }).map((_, hour) => (
              <CalendarCell
                key={`${daysOfWeek[index]}-${hour}`}
                time={`${hour}:00`}
                isHighlighted={
                  hour === new Date().getHours() &&
                  date.toDateString() === today
                }
                onPress={() => handleCellPress(daysOfWeek[index], `${hour}:00`)}
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
    paddingHorizontal: 10,
    backgroundColor: "#f6f6f6",
  },
  backButton: {
    marginBottom: 10,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  column: {
    flex: 1,
    paddingHorizontal: 5,
  },
  highlightedColumn: {
    backgroundColor: "#b2ebf2", // Darker teal for highlighting today's column
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default CalendarScreen;
