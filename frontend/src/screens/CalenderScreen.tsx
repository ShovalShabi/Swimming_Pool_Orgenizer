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
import NewLesson from "../dto/lesson/new-lesson.dto";
import axios from "axios";
import useAlert from "../hooks/useAlert";

const { width, height } = Dimensions.get("window");

/**
 * Retrieves the start and end dates for a week based on the offset.
 *
 * @function getWeekDates
 * @param {number} offset - The week offset from the current week (e.g., 0 for the current week, -7 for the previous week).
 * @returns {Date[]} An array of dates representing the week.
 */
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

/**
 * CalendarScreen Component
 *
 * This component provides a weekly calendar view where users can manage lessons.
 * It supports adding, updating, and deleting lessons, selecting instructors, and setting lesson details.
 *
 * @component
 * @returns {JSX.Element} The rendered CalendarScreen component.
 */
const CalendarScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
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
  const [studentPhoneNumber, setstudentPhoneNumber] = useState("");
  const [availableSpecialties, setAvailableSpecialties] = useState<Swimming[]>(
    [] as Swimming[]
  );
  const [specialties, setSpecialties] = useState<Swimming[]>([] as Swimming[]);
  const [addNewLessonSection, setAddNewLessonSection] = useState(false);
  const [editLessonSection, setEditLessonSection] = useState(false);
  const [lessonType, setLessonType] = useState<LessonType>(LessonType.PUBLIC);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startHourAndDate, setStartHourAndDate] = useState<Date | null>(null);
  const [endHourAndDate, setEndHourAndDate] = useState<Date | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [modalAnchor, setModalAnchor] = useState(false);
  const [studentsArr, setStudentsArr] = useState<Student[]>([]);
  const [studnetSpecialties, setStudnetSpecialties] = useState<Swimming[]>(
    [] as Swimming[]
  );
  const { showAlert } = useAlert();

  const [errorMessage, setErrorMessage] = useState("");

  const weekDates = getWeekDates(currentWeekOffset);

  /**
   * Fetches lessons for the selected week and updates the state.
   *
   * @function fetchLessons
   */
  const fetchLessons = async () => {
    const start = weekDates[0];
    //Retriving lesssons from sunday 6:00 in the morining until 00:00 till saturday
    start.setHours(6);
    start.setMinutes(0);
    start.setSeconds(0);
    const end = new Date(weekDates[6].getTime() + 24 * 60 * 60 * 1000);

    try {
      const fetchedLessons = await LessonService.getLessonsWithinRange(
        start,
        end
      );
      const normalizedLessons: Lesson[] = fetchedLessons.map((lesson) => ({
        ...lesson,
        startAndEndTime: {
          startTime: new Date(lesson.startAndEndTime.startTime),
          endTime: new Date(lesson.startAndEndTime.endTime),
        },
      }));

      setLessons(normalizedLessons);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Display Axios error message or response details
        const message = error.response?.data?.error || error.message;
        showAlert(message, "Error");
      } else {
        // Handle non-Axios errors
        showAlert("An unexpected error occurred.", "Error");
      }
    }
  };

  /**
   * Fetches available instructors for a given day and time range.
   *
   * @function fetchAvailableInstructors
   * @param {number} day - The day of the week (0-Sunday, 6-Saturday).
   * @param {Date} startTime - The start time for the availability check.
   * @param {Date} endTime - The end time for the availability check.
   */
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
      setAvailableInstructors(instructors);
      setErrorMessage(
        instructors.length ? "" : "No instructors available for this time."
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Display Axios error message or response details
        const message = error.response?.data?.error || error.message;
        showAlert(message, "Error");
      } else {
        // Handle non-Axios errors
        showAlert("An unexpected error occurred.", "Error");
      }
    }
  };

  /**
   * Clears all input fields and resets state values.
   *
   * @function clearFields
   */
  const clearFields = () => {
    setModalAnchor(false);
    setAvailableSpecialties([]);
    setSpecialties([]);
    setSelectedInstructor(null);
    setStartHourAndDate(null);
    setShowStartPicker(false);
    setEndHourAndDate(null);
    setShowEndPicker(false);
    setStudentName("");
    setstudentPhoneNumber("");
    setStudentsArr([]);
    setStudnetSpecialties([]);
    setLessonType(LessonType.PUBLIC);
  };

  /**
   * Selects an instructor for the lesson and updates the state.
   *
   * @function handleChooseInstructor
   * @param {Instructor} instructor - The selected instructor.
   */
  const handleChooseInstructor = (instructor: Instructor) => {
    if (!instructor) {
      console.error("Cannot choose a null or undefined instructor");
      return;
    }

    // Return the currently selected instructor to the availableInstructors list
    if (selectedInstructor) {
      setAvailableInstructors((prev) => [...prev, selectedInstructor]);
      setSelectedInstructor(null);
    }

    // Update state with the new instructor
    setModalAnchor(true);
    setSelectedInstructor(instructor);
    setAvailableInstructors((prev) =>
      prev.filter((ins) => ins.instructorId !== instructor.instructorId)
    );
    setAvailableSpecialties(instructor.specialties);
    setSpecialties([]);
  };

  /**
   * Removes the selected instructor and updates the state.
   *
   * @function handleRemoveInstructor
   */
  const handleRemoveInstructor = () => {
    setModalAnchor(false);
    if (selectedInstructor) {
      setAvailableInstructors([...availableInstructors, selectedInstructor]);
    }
    setSelectedInstructor(null);
    setAvailableSpecialties([]);
  };

  /**
   * Removes the currently selected lesson and resets relevant state values.
   *
   * @function handleRemoveSelectedLesson
   */
  const handleRemoveSelectedLesson = () => {
    if (selectedInstructor) {
      handleRemoveInstructor();
    }
    setModalAnchor(false);
    setAvailableSpecialties([]);
    setSpecialties([]);
    setStartHourAndDate(null);
    setShowStartPicker(false);
    setEndHourAndDate(null);
    setShowEndPicker(false);
    setStudentName("");
    setstudentPhoneNumber("");
    setStudentsArr([]);
    setStudnetSpecialties([]);
    setLessonType(LessonType.PUBLIC);
    setSelectedLesson(null);
  };

  /**
   * Removes a specialty from the lesson's specialties list.
   *
   * @function handleRemoveSpecialtyFromLesson
   * @param {Swimming} specialty - The specialty to remove.
   */
  const handleRemoveSpecialtyFromLesson = (specialty: Swimming) => {
    setAvailableSpecialties([...availableSpecialties, specialty]);
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  /**
   * Adds a specialty to the lesson's specialties list.
   *
   * @function handleAddSpecialtyToLesson
   * @param {Swimming} specialty - The specialty to add.
   */
  const handleAddSpecialtyToLesson = (specialty: Swimming) => {
    setAvailableSpecialties(
      availableSpecialties.filter((s) => s !== specialty)
    );
    setSpecialties([...specialties, specialty]);
  };

  /**
   * Updates the lesson type.
   *
   * @function handleChooseLessonType
   * @param {string} value - The selected lesson type.
   */
  const handleChooseLessonType = (value: string) => {
    setLessonType(value as LessonType);
  };

  /**
   * Removes the start and end time for the lesson.
   *
   * @function handleRemoveStartAndEndTime
   */
  const handleRemoveStartAndEndTime = () => {
    setStartHourAndDate(null);
    setEndHourAndDate(null);
  };

  /**
   * Adds a student to the lesson.
   *
   * @function handleAddStudent
   */
  const handleAddStudent = () => {
    if (studentName && studnetSpecialties.length > 0 && studentPhoneNumber) {
      const student: Student = new Student(
        studentName,
        [...studnetSpecialties],
        studentPhoneNumber
      );
      setStudentsArr([...studentsArr, student]);
      setStudnetSpecialties([]);
      setStudentName("");
      setstudentPhoneNumber("");
      return;
    }
    showAlert("Student must have name, phone number and prefences");
  };

  /**
   * Toggles the selection of a specialty for a student.
   *
   * @function toggleSpecialtySelection
   * @param {Swimming} specialty - The specialty to toggle.
   */
  const toggleSpecialtySelection = (specialty: Swimming) => {
    setStudnetSpecialties((prevSpecialties) => {
      if (prevSpecialties.includes(specialty)) {
        return prevSpecialties.filter((s) => s !== specialty);
      } else {
        return [...prevSpecialties, specialty];
      }
    });
  };

  /**
   * Removes a student from the lesson by index.
   *
   * @function handleRemoveStudent
   * @param {number} indexToRemove - The index of the student to remove.
   */
  const handleRemoveStudent = (indexToRemove: number) => {
    const newArray = studentsArr.filter((_, index) => index !== indexToRemove);
    setStudentsArr(newArray);
  };

  useEffect(() => {
    fetchLessons();
  }, [currentWeekOffset]);

  /**
   * Toggles the add new lesson section.
   *
   * @function toggleAddLessonSection
   */
  const toggleAddLessonSection = () => {
    setAddNewLessonSection(addNewLessonSection ? false : true);
    handleRemoveSelectedLesson();
    setEditLessonSection(false);
  };

  /**
   * Toggles the edit lesson section.
   *
   * @function toggleEditLessonSection
   */
  const toggleEditLessonSection = () => {
    setEditLessonSection(editLessonSection ? false : true);
    setAddNewLessonSection(false);
  };

  /**
   * Creates a new lesson and updates the state.
   *
   * @function handleCreateLesson
   */
  const handleCreateLesson = async () => {
    // Validation based on lessonType

    if (!selectedInstructor || !selectedInstructor.instructorId) {
      showAlert("A lesson must be instructed by professional instructors.");
      return;
    }

    if (!specialties.length) {
      showAlert("A lesson must contain swimming styles.", "Error");
      return;
    }

    if (!startHourAndDate || !endHourAndDate) {
      showAlert("A lesson must be defined with a time frame.", "Error");
      return;
    }

    if (!selectedCell) {
      console.log("Cell is not defined");
      return;
    }
    const startTime = new Date(selectedCell.date);
    startTime.setMilliseconds(0); // Clear milliseconds for accuracy

    const endTime = new Date(selectedCell.date);
    endTime.setMilliseconds(0); // Clear milliseconds for accuracy
    if (lessonType !== LessonType.PRIVATE) {
      endTime.setHours(startTime.getHours() + 1);
    } else {
      endTime.setMinutes(startTime.getMinutes() + 45);
    }

    if (new Date() > endTime) {
      showAlert("You cannot create lessons in past.", "Error");
      return;
    }

    // Compose start and end date using the selected cell date and times
    const start = new Date(selectedCell.date);
    start.setHours(
      startHourAndDate.getHours(),
      startHourAndDate.getMinutes(),
      0,
      0
    );

    const end = new Date(selectedCell.date);
    end.setHours(endHourAndDate.getHours(), endHourAndDate.getMinutes(), 0, 0);

    const newLesson: NewLesson = new NewLesson(
      lessonType,
      selectedInstructor.instructorId,
      specialties,
      new StartAndEndTime(start, end),
      studentsArr
    );

    try {
      const serverResLesson: Lesson = await LessonService.createLesson(
        newLesson,
        newLesson.startAndEndTime.endTime.getDay()
      );
      setLessons([...lessons, serverResLesson]);
      clearFields();
      setModalVisible(false);
      setAvailableInstructors([]);
      fetchLessons();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // Display Axios error message or response details
        const message = error.response?.data?.error || error.message;
        showAlert(message, "Error");
      } else {
        // Handle non-Axios errors
        showAlert("An unexpected error occurred.", "Error");
        console.error("Error details:", error);
      }
    }
  };

  /**
   * Updates an existing lesson and updates the state.
   *
   * @function handleUpdateLesson
   */
  const handleUpdateLesson = async () => {
    if (selectedLesson) {
      if (startHourAndDate && endHourAndDate) {
        const startTime = new Date(selectedLesson.startAndEndTime.startTime);
        startTime.setHours(startHourAndDate.getHours());
        startTime.setMinutes(startHourAndDate.getMinutes());
        startTime.setSeconds(startHourAndDate.getSeconds());
        startTime.setMilliseconds(0); // Clear milliseconds for accuracy

        const endTime = new Date(selectedLesson.startAndEndTime.startTime); // Use the same date as startTime
        endTime.setHours(endHourAndDate.getHours());
        endTime.setMinutes(endHourAndDate.getMinutes());
        endTime.setSeconds(endHourAndDate.getSeconds());
        endTime.setMilliseconds(0); // Clear milliseconds for accuracy

        if (!selectedInstructor) {
          showAlert("A lesson must have certified instructor to teach it.");
          return;
        }

        const updatedLesson = new Lesson(
          selectedLesson.lessonId,
          lessonType,
          specialties,
          selectedInstructor.instructorId!,
          new StartAndEndTime(startTime, endTime),
          studentsArr
        );

        try {
          if (selectedLesson.lessonId) {
            const serverReslesson: Lesson = await LessonService.updateLesson(
              selectedLesson.lessonId,
              updatedLesson
            );

            // Update the lessons directly in the state
            setLessons((prevLessons) =>
              prevLessons.map((lesson) =>
                lesson.lessonId === serverReslesson.lessonId
                  ? serverReslesson
                  : lesson
              )
            );
            handleRemoveSelectedLesson();
            toggleEditLessonSection();
            fetchLessons();
            setAvailableInstructors([]);
            setModalVisible(false);
            return;
          }
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            // Display Axios error message or response details
            const message = error.response?.data?.error || error.message;
            showAlert(message, "Error");
          } else {
            // Handle non-Axios errors
            showAlert("An unexpected error occurred.", "Error");
          }
          return;
        }
        console.log("the lesson ID for update is not defined");
      }
      showAlert("Start hour and end hour are not valid", "Error");
    }
  };

  /**
   * Deletes a selected lesson.
   *
   * @function handleDeleteLesson
   */
  const handleDeleteLesson = () => {
    if (selectedLesson) {
      if (selectedLesson.lessonId) {
        try {
          if (new Date() > selectedLesson.startAndEndTime.endTime) {
            showAlert("You cannot delete lessons that already done.", "Error");
            return;
          }
          LessonService.deleteLessonById(selectedLesson.lessonId!);
          handleRemoveSelectedLesson();
          toggleEditLessonSection();
          fetchLessons();
          setAvailableInstructors([]);
          setModalVisible(false);
          return;
        } catch (error: any) {
          if (axios.isAxiosError(error)) {
            // Display Axios error message or response details
            const message = error.response?.data?.error || error.message;
            showAlert(message, "Error");
          } else {
            // Handle non-Axios errors
            showAlert("An unexpected error occurred.", "Error");
          }
        }
      }
      console.log("the lesson ID is invalid");
    }
  };

  /**
   * Handles cell press events, fetching available instructors and updating state.
   *
   * @function handleCellPress
   * @param {string} day - The day of the week.
   * @param {string} hour - The hour of the day.
   * @param {Date} date - The selected date.
   */
  const handleCellPress = async (day: string, hour: string, date: Date) => {
    const cellLessons = lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.startAndEndTime.startTime);
      return (
        lessonDate.toDateString() === date.toDateString() &&
        lessonDate.getHours() === parseInt(hour.split(":")[0], 10)
      );
    });
    const startTime = new Date(date);
    startTime.setHours(parseInt(hour.split(":")[0], 10), 0, 0); // Making the start hour to start from 0 minutes and 0 seconds

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    await fetchAvailableInstructors(date.getDay(), startTime, endTime);
    setSelectedCell({ day, hour, lessons: cellLessons, date });
    setModalVisible(true);
  };

  /**
   * Navigates to the previous week in the calendar.
   *
   * @function goToPreviousWeek
   */
  const goToPreviousWeek = () => setCurrentWeekOffset((prev) => prev - 7);

  /**
   * Navigates to the next week in the calendar.
   *
   * @function goToNextWeek
   */
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
                    isHighlighted={isToday && hour + 6 === today.getHours()}
                    cellLessons={cellLessons} // Pass the lessons
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
        onClose={() => {
          clearFields();
          setAddNewLessonSection(false);
          setEditLessonSection(false);
          setModalVisible(false);
          setAvailableInstructors([]);
          setSelectedLesson(null);
        }}
      >
        <ScrollView>
          {!availableInstructors.length && !modalAnchor && !selectedLesson ? (
            <Text>{errorMessage}</Text>
          ) : (
            <ScrollView>
              <View>
                {/* Edit Existing Lessons */}
                {selectedCell!.lessons!.length > 0 && (
                  <View>
                    <Text>Select a lesson to edit:</Text>
                    {selectedCell!.lessons!.map((lesson, index) => (
                      <React.Fragment key={lesson!.lessonId}>
                        <Button
                          mode="contained"
                          onPress={() => {
                            if (
                              editLessonSection &&
                              selectedLesson &&
                              lesson.lessonId === selectedLesson.lessonId
                            ) {
                              handleRemoveSelectedLesson();
                              toggleEditLessonSection();
                              return;
                            }
                            setAddNewLessonSection(false); // the add section should be active

                            // Return the currently selected instructor to the available list
                            if (selectedInstructor) {
                              // Use the previous state directly in the callback
                              setAvailableInstructors((prevInstructors) => {
                                const updatedInstructors = [
                                  ...prevInstructors,
                                  selectedInstructor,
                                ];
                                return updatedInstructors;
                              });

                              setSelectedInstructor(null); // Clear the selected instructor
                            }

                            // Delay fetching the selected instructor from updated availableInstructors
                            setAvailableInstructors((prev) => {
                              const selected = prev.find(
                                (inst) =>
                                  inst.instructorId === lesson.instructorId
                              );

                              if (selected) {
                                setSelectedInstructor(selected);

                                // Remove the selected instructor from the available list
                                const filteredInstructors = prev.filter(
                                  (inst) =>
                                    inst.instructorId !== lesson.instructorId
                                );

                                return filteredInstructors;
                              }

                              return prev;
                            });

                            // Find the new instructor associated with the lesson
                            const newInstructor = availableInstructors.find(
                              (inst) =>
                                inst.instructorId === lesson.instructorId
                            );

                            if (newInstructor) {
                              setSelectedInstructor(newInstructor);

                              // Update availableInstructors to remove the selected instructor
                              setAvailableInstructors((prevInstructors) =>
                                prevInstructors.filter(
                                  (inst) =>
                                    inst.instructorId !==
                                    newInstructor.instructorId
                                )
                              );

                              // Update specialties and availableSpecialties based on the new instructor
                              setSpecialties([...lesson.specialties]);
                              setAvailableSpecialties(
                                newInstructor.specialties.filter(
                                  (specialty) =>
                                    !lesson.specialties.includes(specialty)
                                )
                              );
                            } else {
                              console.log(
                                "Instructor not found for the selected lesson."
                              );
                            }

                            setLessonType(lesson.typeLesson);
                            setStartHourAndDate(
                              new Date(lesson.startAndEndTime.startTime)
                            );
                            setEndHourAndDate(
                              new Date(lesson.startAndEndTime.endTime)
                            );
                            setStudentsArr([...lesson.students]);
                            setEditLessonSection(true); // Open the editor as editing mode
                            setSelectedLesson(
                              new Lesson(
                                lesson.lessonId,
                                lesson.typeLesson,
                                [...lesson.specialties],
                                lesson.instructorId,
                                { ...lesson.startAndEndTime },
                                [...lesson.students]
                              )
                            );
                            setEditLessonSection(true);
                          }}
                          style={styles.specialtyBubble}
                        >
                          {lesson.typeLesson} Lesson:
                          {lesson.specialties.join(",")} (
                          {lesson.startAndEndTime.startTime.toLocaleTimeString()}
                          -{lesson.startAndEndTime.endTime.toLocaleTimeString()}
                          )
                        </Button>
                        <HorizontalDivider
                          color="#888"
                          thickness={2}
                          marginVertical={15}
                        />
                      </React.Fragment>
                    ))}
                  </View>
                )}
              </View>

              <View>
                <Button
                  key={"OpenLessonSection"}
                  mode="contained"
                  onPress={toggleAddLessonSection}
                  style={styles.specialtyBubble}
                >
                  + Add New Lesson
                </Button>
              </View>
              {(addNewLessonSection || editLessonSection) && (
                <View>
                  <View>
                    <Text>Choose instructor:</Text>
                    <View style={styles.specialtiesContainer}>
                      {availableInstructors.map((instructor) => (
                        <Button
                          key={instructor.instructorId!}
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
                          onPress={() => handleRemoveInstructor()}
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
                      {availableSpecialties.map((specialty) => (
                        <Button
                          key={specialty}
                          onPress={() => handleAddSpecialtyToLesson(specialty)}
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
                          onPress={() =>
                            handleRemoveSpecialtyFromLesson(specialty)
                          }
                          style={styles.specialtyBubble}
                        >
                          <Text style={styles.centeredText}>
                            {specialty} <Text style={styles.xButton}>X</Text>
                          </Text>
                        </Button>
                      ))}
                    </View>
                  </View>
                  <Text>Select Lesson Type:</Text>

                  <View style={styles.specialtiesContainer}>
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
                  </View>
                  <Text>Selected Lesson Type: {lessonType}</Text>

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
                    {startHourAndDate && endHourAndDate && (
                      <Button
                        onPress={handleRemoveStartAndEndTime}
                        style={styles.specialtyBubble}
                      >
                        <Text style={styles.centeredText}>
                          {new Date(startHourAndDate).toLocaleTimeString()} -{" "}
                          {new Date(endHourAndDate).toLocaleTimeString()}{" "}
                          <Text style={styles.xButton}>X</Text>
                        </Text>
                      </Button>
                    )}
                  </View>
                  <View>
                    <TextInput
                      value={studentName}
                      onChangeText={setStudentName}
                      placeholder="Enter Student's Name"
                      placeholderTextColor="#555"
                      style={styles.input}
                    />
                    <TextInput
                      value={studentPhoneNumber}
                      onChangeText={setstudentPhoneNumber}
                      placeholder="Enter Student's Phone Number"
                      placeholderTextColor="#555"
                      style={styles.input}
                    />
                    <Text>Select Specialties for Student:</Text>
                    <View style={styles.specialtiesContainer}>
                      {specialties.map((specialty, index) => (
                        <Button
                          key={index}
                          mode={
                            studnetSpecialties.includes(specialty)
                              ? "contained"
                              : "outlined"
                          }
                          onPress={() => toggleSpecialtySelection(specialty)}
                          style={[
                            styles.specialtyButton,
                            studnetSpecialties.includes(specialty) &&
                              styles.selectedSpecialty,
                          ]}
                        >
                          {specialty}
                        </Button>
                      ))}
                    </View>
                    <Button
                      onPress={handleAddStudent}
                      style={styles.addStudentButton}
                    >
                      Add Student
                    </Button>
                  </View>

                  <ScrollView style={styles.studentList}>
                    {studentsArr.map((student, index) => (
                      <View key={index} style={styles.studentItem}>
                        <Text style={styles.studentText}>
                          {student.name + " | " + student.phoneNumber}:{" "}
                          {student.preferences.join(", ")}
                        </Text>
                        <Button
                          onPress={() => handleRemoveStudent(index)}
                          mode="contained"
                          style={styles.removeStudentButton}
                        >
                          X
                        </Button>
                      </View>
                    ))}
                  </ScrollView>
                  {/* Update/Delete Buttons */}
                  {editLessonSection && (
                    <View>
                      <Button
                        mode="contained"
                        style={[styles.updateButton, { width: "100%" }]}
                        onPress={handleUpdateLesson}
                      >
                        Update Lesson
                      </Button>
                      <Button
                        mode="contained"
                        style={[styles.deleteButton, { width: "100%" }]}
                        onPress={handleDeleteLesson}
                      >
                        Delete Lesson
                      </Button>
                    </View>
                  )}

                  {addNewLessonSection && (
                    <Button
                      onPress={handleCreateLesson}
                      style={[styles.addButton, { width: "100%" }]}
                    >
                      Add Lesson
                    </Button>
                  )}
                  <HorizontalDivider
                    color="#888"
                    thickness={2}
                    marginVertical={15}
                  />
                </View>
              )}
            </ScrollView>
          )}
        </ScrollView>
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
  studentList: {
    maxHeight: 150,
    marginVertical: 10,
  },
  addStudentButton: {
    alignSelf: "flex-start",
    marginVertical: 10,
    backgroundColor: "#4caf50",
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 5,
  },
  studentText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  removeStudentButton: {
    backgroundColor: "#f44336",
    marginLeft: 10,
  },
  specialtyButton: {
    margin: 5,
    borderRadius: 20,
  },
  selectedSpecialty: {
    backgroundColor: "#4caf50",
  },
});

export default CalendarScreen;
