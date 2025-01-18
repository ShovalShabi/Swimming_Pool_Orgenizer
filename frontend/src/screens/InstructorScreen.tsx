import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomCard from "../components/Card";
import CustomModal from "../components/Modal";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "react-native-paper";
import InstructorService from "../services/instructor.service";
import Instructor from "../dto/instructor/instructor.dto";
import { Swimming } from "../utils/swimming-enum.utils";
import { DaysOfWeek } from "../utils/days-week-enum.utils";
import StartAndEndTime, {
  Availability,
} from "../dto/instructor/start-and-end-time.dto";
import NewInstructor from "../dto/instructor/new-instructor.dto";

const { width, height } = Dimensions.get("window");

const InstructorScreen: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const [name, setName] = useState("");
  const [specialties, setSpecialties] = useState<Swimming[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState(
    Object.values(Swimming)
  );
  const [availabilities, setAvailabilities] = useState<Availability[]>(
    Array(7).fill(-1)
  );
  const [availableDays, setAvailableDays] = useState(Object.values(DaysOfWeek));
  const [selectedDay, setSelectedDay] = useState<DaysOfWeek | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchInstructors = async () => {
      const data = await InstructorService.getAllInstructors();
      setInstructors(data);
    };
    fetchInstructors();
  }, []);

  const clearFields = () => {
    setName("");
    setSelectedInstructor(null);
    setAvailableDays(Object.values(DaysOfWeek));
    setAvailabilities(Array(7).fill(-1));
    setAvailableSpecialties(Object.values(Swimming));
    setSpecialties([]);
    setSelectedDay(null);
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleAddSpecialty = (specialty: Swimming) => {
    setSpecialties([...specialties, specialty]);
    setAvailableSpecialties(
      availableSpecialties.filter((s) => s !== specialty)
    );
  };

  const handleRemoveSpecialty = (specialty: Swimming) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
    setAvailableSpecialties([...availableSpecialties, specialty]);
  };

  const handleAddAvailability = () => {
    if (selectedDay && startTime && endTime) {
      const dayIndex = Object.values(DaysOfWeek).indexOf(selectedDay);
      const newAvailability = new StartAndEndTime(startTime, endTime);
      const updatedAvailabilities = [...availabilities];
      updatedAvailabilities[dayIndex] = newAvailability;

      setAvailabilities(updatedAvailabilities);
      setAvailableDays(availableDays.filter((d) => d !== selectedDay));
      setSelectedDay(null);
      setShowStartPicker(false);
      setStartTime(null);
      setShowEndPicker(false);
      setEndTime(null);
    }
  };

  const handleRemoveAvailability = (dayIndex: number) => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[dayIndex] = -1;

    const removedDay = Object.values(DaysOfWeek)[dayIndex];
    const updatedAvailableDays = [...availableDays, removedDay].sort(
      (a, b) =>
        Object.values(DaysOfWeek).indexOf(a) -
        Object.values(DaysOfWeek).indexOf(b)
    );

    setAvailabilities(updatedAvailabilities);
    setAvailableDays(updatedAvailableDays);
  };

  const handleSaveInstructor = async () => {
    if (selectedInstructor) {
      await InstructorService.updateInstructor(
        selectedInstructor.instructorId!,
        {
          instructorId: selectedInstructor.instructorId,
          name,
          specialties,
          availabilities,
        }
      );
    } else {
      const newInstructor: NewInstructor = new NewInstructor(
        name,
        specialties,
        availabilities
      );
      await InstructorService.createInstructor(newInstructor);
    }
    const instructors = await InstructorService.getAllInstructors();
    setInstructors(instructors);
    clearFields();
    setModalVisible(false);
  };

  const handleDeleteInstructor = async () => {
    if (selectedInstructor?.instructorId) {
      await InstructorService.deleteInstructorById(
        selectedInstructor.instructorId
      );
      clearFields();
      const instructors = await InstructorService.getAllInstructors();
      setInstructors(instructors);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <CustomCard
          title="+ Add Instructor"
          onPress={() => setModalVisible(true)}
          style={styles.card}
        />
        {instructors.map((instructor) => (
          <CustomCard
            key={instructor.instructorId}
            title={instructor.name}
            style={styles.card}
            onPress={() => {
              setSelectedInstructor(instructor);
              setModalVisible(true);
              setName(instructor.name);
              setSpecialties(instructor.specialties);
              setAvailabilities(instructor.availabilities);

              // Remove instructor's specialties from availableSpecialties
              const updatedAvailableSpecialties = Object.values(
                Swimming
              ).filter(
                (specialty) => !instructor.specialties.includes(specialty)
              );
              setAvailableSpecialties(updatedAvailableSpecialties);

              // Update availableDays to exclude already set availabilities
              const updatedAvailableDays = Object.values(DaysOfWeek).filter(
                (_, index) => instructor.availabilities[index] === -1
              );
              setAvailableDays(updatedAvailableDays);
            }}
          >
            <Text style={styles.systemId}>
              System ID: {instructor.instructorId}
            </Text>
            <Text>Specialties: {instructor.specialties.join(", ")}</Text>
          </CustomCard>
        ))}
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        title={selectedInstructor ? "Edit Instructor" : "Add New Instructor"}
        onClose={() => {
          clearFields();
          setModalVisible(false);
        }}
      >
        <ScrollView style={styles.modalScrollable}>
          <View>
            {selectedInstructor?.instructorId && (
              <Text style={styles.systemId}>
                System ID: {selectedInstructor.instructorId}
              </Text>
            )}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter Instructor Name"
              placeholderTextColor="#555"
              style={styles.input}
            />
            <View>
              <Text>Specialties:</Text>
              <View style={styles.specialtiesContainer}>
                {availableSpecialties.map((specialty) => (
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

            <View>
              <Text>Availability:</Text>
              <View style={styles.daysContainer}>
                {availableDays.map((day) => (
                  <Button
                    key={day}
                    onPress={() => {
                      setSelectedDay(day);
                      setAvailableDays(availableDays.filter((d) => d !== day));
                    }}
                    style={styles.dayButton}
                  >
                    {day}
                  </Button>
                ))}
              </View>
              {selectedDay && (
                <View style={styles.selectedDayContainer}>
                  <Text style={styles.selectedDayText}>Selected Day:</Text>
                  <Button
                    onPress={() => {
                      if (selectedDay) {
                        setAvailableDays(
                          [...availableDays, selectedDay].sort(
                            (a, b) =>
                              Object.values(DaysOfWeek).indexOf(a) -
                              Object.values(DaysOfWeek).indexOf(b)
                          )
                        );
                        setSelectedDay(null);
                        setStartTime(null);
                        setEndTime(null);
                      }
                    }}
                    style={styles.specialtyBubble}
                  >
                    <Text style={styles.centeredText}>
                      {selectedDay}
                      <Text style={styles.xButton}> X</Text>
                    </Text>
                  </Button>
                </View>
              )}
              {selectedDay && (
                <>
                  <Button
                    onPress={() => setShowStartPicker(!showStartPicker)}
                    style={styles.toggleButton}
                  >
                    Select Start Time
                  </Button>
                  {showStartPicker && (
                    <DateTimePicker
                      value={startTime || new Date()}
                      mode="time"
                      is24Hour
                      onChange={(event, date) => {
                        if (date) setStartTime(date);
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
                      value={endTime || new Date()}
                      mode="time"
                      is24Hour
                      onChange={(event, date) => {
                        if (date) setEndTime(date);
                      }}
                    />
                  )}
                  <Button
                    onPress={handleAddAvailability}
                    style={styles.addButton}
                    disabled={!startTime || !endTime}
                  >
                    Add Availability
                  </Button>
                </>
              )}
            </View>
            {availabilities.map((availability, index) =>
              availability !== -1 ? (
                <Button
                  key={index}
                  onPress={() => handleRemoveAvailability(index)}
                  style={styles.specialtyBubble}
                >
                  <Text style={styles.centeredText}>
                    {Object.values(DaysOfWeek)[index]}{" "}
                    {new Date(availability.startTime).toLocaleTimeString()} -{" "}
                    {new Date(availability.endTime).toLocaleTimeString()}{" "}
                    <Text style={styles.xButton}>X</Text>
                  </Text>
                </Button>
              ) : null
            )}
            <Button
              mode="contained"
              onPress={handleSaveInstructor}
              style={
                selectedInstructor ? styles.updateButton : styles.addButton
              }
            >
              {selectedInstructor ? "Update Instructor" : "Add Instructor"}
            </Button>
            {selectedInstructor && (
              <Button
                mode="text"
                onPress={handleDeleteInstructor}
                style={styles.deleteButton}
              >
                Delete Instructor
              </Button>
            )}
          </View>
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
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
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
});

export default InstructorScreen;
