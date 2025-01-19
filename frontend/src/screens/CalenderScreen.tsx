import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  TextInput,
} from "react-native";
import { Text, Button, RadioButton } from "react-native-paper";
import CustomModal from "../components/Modal";
import CalendarCell from "../components/CalendarCell";
import { DaysOfWeek } from "../utils/days-week-enum.utils";
import LessonService from "../services/lesson.service";
import Lesson from "../dto/lesson/lesson.dto";
import InstructorService from "../services/instructor.service";
import Instructor from "../dto/instructor/instructor.dto";
import { Swimming } from "../utils/swimming-enum.utils";
import { LessonType } from "../utils/lesson-enum.utils";
import DateTimePicker from "@react-native-community/datetimepicker";
import StartAndEndTime from "../dto/instructor/start-and-end-time.dto";
import Student from "../dto/student/student.dto";
import HorizontalDivider from "../components/HorizontalDivider";

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
  >([] as Instructor[]);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const [studentName, setStudentName] = useState("");
  const [specialties, setSpecialties] = useState<Swimming[]>([] as Swimming[]);
  const [lessonsWithinCell, setLessonsWithinCell] = useState<Lesson[]>(
    [] as Lesson[]
  );
  const [addNewLessonSection, setAddNewLessonSection] = useState(false);
  const [lessonType, setLessonType] = useState<LessonType>(LessonType.PUBLIC);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [startHourAndDate, setStartHourAndDate] = useState<Date | null>(null);
  const [endHourAndDate, setEndHourAndDate] = useState<Date | null>(null);
  const [startAndEndTime, setStartAndEndTime] =
    useState<StartAndEndTime | null>(null);
  const [availableInstructorsInCell, setAvailableInstructorsInCell] = useState<
    Instructor[]
  >([]);
  const [studntsArr, setStudentsArr] = useState<Student[]>([]);
  const [currentStudent, setCurentStudent] = useState<Student | null>(null);
  const [studnetSpecialties, setStudnetSpecialties] = useState<Swimming[]>(
    [] as Swimming[]
  );

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

  // cosnt fetchLessonsOfOneCell = async (startTime:Date, endTime:Date) =>{

  //   try{
  //     const lessons:Lesson[] = await LessonService.getLessonsWithinRange(startTime,endTime);
  //     setLessonsWithinCell(lessons);
  //   }catch(error){

  //   }
  // }

  const handleChooseInstructor = (instructor: Instructor) => {
    setAvailableInstructors(
      availableInstructors.filter((i) => i !== instructor)
    );
    setSelectedInstructor(selectedInstructor);
    setSpecialties(instructor.specialties);
  };

  const handleRemoveInstructor = (instructor: Instructor) => {
    setAvailableInstructors([...availableInstructors, instructor]);
    setSelectedInstructor(null);
    setSpecialties([]);
  };

  const handleRemoveSpecialty = (specialty: Swimming) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
    setSpecialties([...specialties, specialty]);
  };

  const handleAddSpecialty = (specialty: Swimming) => {
    setSpecialties([...specialties, specialty]);
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const handleChooseLessonType = (value: string) => {
    setLessonType(value as LessonType);
  };

  const handleAddStartAndEndTime = () => {
    if (startHourAndDate && endHourAndDate) {
      const startEndObj: StartAndEndTime = new StartAndEndTime(
        startHourAndDate,
        endHourAndDate
      );
      setStartAndEndTime(startEndObj);
      setStartHourAndDate(null);
      setEndHourAndDate(null);
    }
  };

  const handleRemoveStartAndEndTime = () => {
    setStartAndEndTime(null);
  };

  const handleAddStudent = () => {
    if (studentName && studnetSpecialties && lessonType) {
      const student: Student = new Student(
        studentName,
        studnetSpecialties,
        lessonType
      );

      setStudentsArr([...studntsArr, student]);
    }
  };

  const handleRemoveStudent = (indexToRemove: number) => {
    const newArray = studntsArr.filter((_, index) => index !== indexToRemove);
    setStudentsArr(newArray);
  };

  useEffect(() => {
    fetchLessons();
  }, [currentWeekOffset]);

  const toggleAddLessonSection = () => {
    setAddNewLessonSection(addNewLessonSection ? false : true);
  };

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
        {!availableInstructors.length ? (
          <Text>{errorMessage}</Text>
        ) : (
          <ScrollView>
            <View>
              <Button
                key={"OpenExisitnglessons Section"}
                mode="contained"
                onPress={() => {
                  console.log("donothing");
                }}
                style={styles.specialtyBubble}
              >
                Edit Lessons
              </Button>
            </View>
            <HorizontalDivider color="#888" thickness={2} marginVertical={15} />
            <View>
              <Text>Would You Like to add a New Lesson?</Text>
              <Button
                key={"OpenLessonSection"}
                mode="contained"
                onPress={toggleAddLessonSection}
                style={styles.specialtyBubble}
              >
                + Add New Lesson
              </Button>
              {addNewLessonSection && (
                <View>
                  {selectedInstructor?.instructorId && (
                    <Text style={styles.systemId}>
                      System ID: {selectedInstructor.instructorId}
                    </Text>
                  )}
                  <TextInput
                    value={studentName}
                    onChangeText={setStudentName}
                    placeholder="Enter Student Name"
                    placeholderTextColor="#555"
                    style={styles.input}
                  />
                  <View>
                    <Text>Choose instructor:</Text>
                    <View style={styles.specialtiesContainer}>
                      {availableInstructors.map((instructor) => (
                        <Button
                          key={instructor.instructorId}
                          onPress={() => handleChooseInstructor(instructor)}
                          style={styles.dayButton}
                        >
                          {instructor.name}
                        </Button>
                      ))}
                    </View>
                    <View style={styles.specialtiesContainer}>
                      {selectedInstructor && (
                        <Button
                          key={selectedInstructor.instructorId}
                          mode="contained"
                          onPress={() =>
                            handleRemoveInstructor(selectedInstructor)
                          }
                          style={styles.specialtyBubble}
                        >
                          <Text style={styles.centeredText}>
                            {selectedInstructor.name}{" "}
                            <Text style={styles.xButton}>X</Text>
                          </Text>
                        </Button>
                      )}
                    </View>
                  </View>
                  <View>
                    <Text>Specialties:</Text>
                    <View style={styles.specialtiesContainer}>
                      {specialties.map((specialty) => (
                        <Button
                          key={specialty}
                          onPress={() => handleAddSpecialty(specialty)}
                          style={styles.dayButton}
                        >
                          {specialty}
                        </Button>
                      ))}
                    </View>
                    <View style={styles.specialtiesContainer}>
                      {specialties.map((specialty) => (
                        <Button
                          key={specialty}
                          mode="contained"
                          onPress={() => handleRemoveSpecialty(specialty)}
                          style={styles.specialtyBubble}
                        >
                          <Text style={styles.centeredText}>
                            {specialty} <Text style={styles.xButton}>X</Text>
                          </Text>
                        </Button>
                      ))}
                    </View>
                  </View>

                  <View style={styles.specialtiesContainer}>
                    <Text style={styles.title}>Select Lesson Type:</Text>
                    <RadioButton.Group
                      onValueChange={handleChooseLessonType} // Pass the handler
                      value={lessonType}
                    >
                      {Object.values(LessonType).map((type) => (
                        <View key={type} style={styles.option}>
                          <RadioButton value={type} />
                          <Text>{type}</Text>
                        </View>
                      ))}
                    </RadioButton.Group>
                    <Text style={styles.selected}>
                      Selected Lesson Type: {lessonType}
                    </Text>
                  </View>

                  <View>
                    <Text>Lesson Time Frame:</Text>
                    <Button
                      onPress={() => setShowStartPicker(!showStartPicker)}
                      style={styles.toggleButton}
                    >
                      Select Start Time
                    </Button>
                    {showStartPicker && (
                      <DateTimePicker
                        value={startHourAndDate || new Date()}
                        mode="time"
                        is24Hour
                        onChange={(event, date) => {
                          if (date) setStartHourAndDate(date);
                        }}
                      />
                    )}
                    <Button
                      onPress={() => setShowEndPicker(!showEndPicker)}
                      style={styles.toggleButton}
                    >
                      Select End Time
                    </Button>
                    {showEndPicker && (
                      <DateTimePicker
                        value={endHourAndDate || new Date()}
                        mode="time"
                        is24Hour
                        onChange={(event, date) => {
                          if (date) setEndHourAndDate(date);
                        }}
                      />
                    )}
                    <Button
                      onPress={handleAddStartAndEndTime}
                      style={styles.addButton}
                      disabled={!startHourAndDate || !endHourAndDate}
                    >
                      Add Time Frame
                    </Button>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
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
  selectedDayContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  selectedDayText: {
    marginRight: 10,
    fontSize: 16,
    color: "#333",
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    width: width * 0.4,
    height: height * 0.2,
    marginHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    color: "#333",
  },
  specialtyBubble: {
    backgroundColor: "#7e57c2",
    marginHorizontal: 5,
    marginVertical: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  centeredText: {
    textAlign: "center",
    color: "white",
  },
  availabilityBubble: {
    backgroundColor: "#d9f7be",
    marginHorizontal: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  xButton: {
    marginLeft: 10,
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ffcccc",
    marginTop: 10,
  },
  updateButton: {
    backgroundColor: "#ffd580",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#d9f7be",
    marginTop: 10,
  },
  modalScrollable: {
    maxHeight: height * 0.8,
  },
  toggleButton: {
    backgroundColor: "#cce5ff",
    marginVertical: 5,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 5,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 5,
  },
  dayButton: {
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
  },
  systemId: {
    color: "#d3d3d3",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    marginLeft: 5,
  },
  selected: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
  },
});

export default CalendarScreen;
