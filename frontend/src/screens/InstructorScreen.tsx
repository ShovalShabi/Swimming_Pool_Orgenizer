import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native";
import CustomCard from "../components/Card";
import CustomModal from "../components/Modal";
import { useNavigation } from "@react-navigation/native"; // For navigation
import { Button } from "react-native-paper"; // A customizable back button

const { width, height } = Dimensions.get("window");

const InstructorScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const navigation = useNavigation();

  const handleCardPress = (instructor: any) => {
    setSelectedInstructor(instructor);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
        <CustomCard
          title="+"
          description="Add Instructor"
          onPress={() => handleCardPress(null)}
          style={styles.card}
        />
        {[1, 2, 3].map((instructor) => (
          <CustomCard
            key={instructor}
            title={`Instructor ${instructor}`}
            description={`Details about Instructor ${instructor}`}
            onPress={() => handleCardPress({ id: instructor })}
            style={styles.card}
          />
        ))}
      </ScrollView>
      <CustomModal
        visible={modalVisible}
        title="Instructor Details"
        onClose={() => setModalVisible(false)}
      >
        {selectedInstructor ? (
          <View>
            <Text>Editing Instructor {selectedInstructor.id}</Text>
          </View>
        ) : (
          <View>
            <Text>Add New Instructor</Text>
          </View>
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
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    width: width * 0.4, // 40% of the screen width
    height: height * 0.2, // 20% of the screen height
    marginHorizontal: 10, // Space between cards
  },
});

export default InstructorScreen;
