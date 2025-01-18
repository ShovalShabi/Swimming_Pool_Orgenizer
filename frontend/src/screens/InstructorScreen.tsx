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
      setSelectedDay(null); // Reset selection
      setStartTime(null);
      setEndTime(null);
    }
  };

  const handleRemoveAvailability = (dayIndex: number) => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[dayIndex] = -1;

    // Get the removed day and place it back in the correct position
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
    setModalVisible(false);
  };

  const handleDeleteInstructor = async () => {
    if (selectedInstructor?.instructorId) {
      await InstructorService.deleteInstructorById(
        selectedInstructor.instructorId
      );
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <CustomCard
          title="Add Instructor"
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
            }}
          >
            <Text>System ID: {instructor.instructorId}</Text>
            <Text>Specialties: {instructor.specialties.join(", ")}</Text>
          </CustomCard>
        ))}
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        title={selectedInstructor ? "Edit Instructor" : "Add New Instructor"}
        onClose={() => setModalVisible(false)}
      >
        <View>
          {selectedInstructor?.instructorId && (
            <Text>System ID: {selectedInstructor.instructorId}</Text>
          )}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter Instructor Name"
            placeholderTextColor="#555" // Darker placeholder text
            style={styles.input}
          />
          <View>
            <Text>Specialties:</Text>
            {availableSpecialties.map((specialty) => (
              <Button
                key={specialty}
                onPress={() => handleAddSpecialty(specialty)}
              >
                {specialty}
              </Button>
            ))}
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
          <View>
            <Text>Availability:</Text>
            <ScrollView>
              <Text>Select Day:</Text>
              {availableDays.map((day) => (
                <Button key={day} onPress={() => setSelectedDay(day)}>
                  {day}
                </Button>
              ))}
              {selectedDay && (
                <>
                  <Text>Day Selected: {selectedDay}</Text>
                  <Button onPress={() => setShowStartPicker(true)}>
                    Select Start Time
                  </Button>
                  {showStartPicker && (
                    <DateTimePicker
                      value={startTime || new Date()}
                      mode="time"
                      is24Hour={true}
                      onChange={(event, date) => {
                        setShowStartPicker(false);
                        if (date) setStartTime(date);
                      }}
                    />
                  )}
                  <Button onPress={() => setShowEndPicker(true)}>
                    Select End Time
                  </Button>
                  {showEndPicker && (
                    <DateTimePicker
                      value={endTime || new Date()}
                      mode="time"
                      is24Hour={true}
                      onChange={(event, date) => {
                        setShowEndPicker(false);
                        if (date) setEndTime(date);
                      }}
                    />
                  )}
                  <Button onPress={handleAddAvailability}>
                    Add Availability
                  </Button>
                </>
              )}
            </ScrollView>
            {availabilities.map((availability, index) =>
              availability !== -1 ? (
                <Button
                  key={index}
                  onPress={() => handleRemoveAvailability(index)}
                  style={styles.availabilityBubble}
                >
                  {Object.values(DaysOfWeek)[index]}{" "}
                  {new Date(availability.startTime).toLocaleTimeString()} -{" "}
                  {new Date(availability.endTime).toLocaleTimeString()}{" "}
                  <Text style={styles.xButton}>X</Text>
                </Button>
              ) : null
            )}
          </View>
          <Button mode="contained" onPress={handleSaveInstructor}>
            {selectedInstructor ? "Update Instructor" : "Add Instructor"}
          </Button>
          {selectedInstructor && (
            <Button mode="text" onPress={handleDeleteInstructor} color="red">
              Delete Instructor
            </Button>
          )}
        </View>
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
    color: "#333", // Darker input text
  },
  specialtyBubble: {
    backgroundColor: "#7e57c2",
    marginVertical: 5,
    alignItems: "center", // Center specialty text
    justifyContent: "center",
  },
  centeredText: {
    textAlign: "center",
    color: "white",
  },
  availabilityBubble: {
    backgroundColor: "#7e57c2",
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  xButton: {
    marginLeft: 10,
    color: "white",
    fontWeight: "bold",
  },
});

export default InstructorScreen;
