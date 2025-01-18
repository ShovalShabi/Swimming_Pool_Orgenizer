import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import CustomCard from "../components/Card";
import CustomModal from "../components/Modal";
import { useNavigation } from "@react-navigation/native";
import { Button, Text } from "react-native-paper";
import InstructorService from "../services/instructor.service";
import Instructor from "../dto/instructor/instructor.dto";
import { Swimming } from "../utils/swimming-enum.utils";
import { DaysOfWeek } from "../utils/days-week-enum.utils";

const { width, height } = Dimensions.get("window");

const InstructorScreen: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [specialties, setSpecialties] = useState<Swimming[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState(
    Object.values(Swimming)
  );
  const [availabilities, setAvailabilities] = useState<
    { day: DaysOfWeek; time: string }[]
  >([]);
  const [availableDays, setAvailableDays] = useState(Object.values(DaysOfWeek));

  // Fetch instructors from the backend
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

  const handleAddAvailability = (day: DaysOfWeek, time: string) => {
    setAvailabilities([...availabilities, { day, time }]);
    setAvailableDays(availableDays.filter((d) => d !== day));
  };

  const handleRemoveAvailability = (day: DaysOfWeek) => {
    setAvailabilities(availabilities.filter((a) => a.day !== day));
    setAvailableDays([...availableDays, day]);
  };

  const handleCardPress = (instructor: Instructor | null) => {
    setSelectedInstructor(instructor);
    setModalVisible(true);
    if (instructor) {
      setName(instructor.name);
      setSpecialties(instructor.specialties);
      setAvailabilities(
        instructor.availabilities
          .filter((a) => a !== -1)
          .map((a) => ({
            day: availableDays.find(
              (_, i) => instructor.availabilities[i] !== -1
            )!,
            time: `${new Date(a.startTime).getHours()}:00 - ${new Date(
              a.endTime
            ).getHours()}:00`,
          }))
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <CustomCard
          title="+"
          onPress={() => handleCardPress(null)}
          style={styles.card}
        >
          <Text>Add Instructor</Text>
        </CustomCard>
        {instructors.map((instructor) => (
          <CustomCard
            key={instructor.instructorId}
            title={instructor.name}
            style={styles.card}
            onPress={() => handleCardPress(instructor)}
          >
            <Text>Specialties: {instructor.specialties.join(", ")}</Text>
            <Text>ID: {instructor.instructorId}</Text>
          </CustomCard>
        ))}
      </ScrollView>

      <CustomModal
        visible={modalVisible}
        title="Instructor Details"
        onClose={() => setModalVisible(false)}
      >
        <View>
          {selectedInstructor?.instructorId && (
            <Text>ID: {selectedInstructor.instructorId}</Text>
          )}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter Instructor Name"
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
                {specialty} X
              </Button>
            ))}
          </View>
          <View>
            <Text>Availabilities:</Text>
            {availableDays.map((day) => (
              <Button
                key={day}
                onPress={() => handleAddAvailability(day, "08:00 - 10:00")}
              >
                {day}
              </Button>
            ))}
            {availabilities.map((availability) => (
              <Button
                key={availability.day}
                mode="contained"
                onPress={() => handleRemoveAvailability(availability.day)}
                style={styles.availabilityBubble}
              >
                {availability.day} {availability.time} X
              </Button>
            ))}
          </View>
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
  },
  specialtyBubble: {
    backgroundColor: "#00D5FA",
    marginVertical: 5,
  },
  availabilityBubble: {
    backgroundColor: "#7e57c2",
    marginVertical: 5,
  },
});

export default InstructorScreen;
