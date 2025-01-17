import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import CustomCard from "../components/Card";

// Get the screen dimensions
const { width, height } = Dimensions.get("window");

const MainScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View style={styles.container}>
    <CustomCard
      title="Instructor Editor"
      description="Manage instructors"
      onPress={() => {
        console.log("Navigating to Instructors screen");
        navigation.navigate("InstructorScreen");
      }}
      style={styles.card}
    />
    <CustomCard
      title="Calendar"
      description="View and manage lessons"
      onPress={() => navigation.navigate("CalendarScreen")}
      style={styles.card}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // Horizontal layout
    justifyContent: "space-between", // Add space between cards
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width * 0.4, // 40% of the screen's width
    height: height * 0.2, // 20% of the screen's height
    marginHorizontal: 10, // Add space between cards
  },
});

export default MainScreen;
