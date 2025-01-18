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
      onPress={() => navigation.navigate("InstructorScreen")}
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
    justifyContent: "center", // Center the cards horizontally
    alignItems: "center", // Center the cards vertically
    padding: 20,
  },
  card: {
    width: width * 0.45, // Adjust width for closer appearance
    height: height * 0.2, // Keep height consistent
    marginHorizontal: 5, // Reduce horizontal space between cards
  },
});

export default MainScreen;
