/**
 * App Component
 *
 * The root component of the application, defining the navigation structure using React Navigation.
 *
 * @component
 * @returns {React.ReactElement} - The main application component with navigation setup.
 *
 * ### Navigation
 * - Uses a `Stack.Navigator` to define the navigation structure.
 * - Contains the following screens:
 *   - `MainScreen`: The main landing page of the app.
 *   - `InstructorScreen`: The screen for managing instructors.
 *   - `CalendarScreen`: The screen for viewing and managing the lesson calendar.
 *
 * ### Features
 * - The `NavigationContainer` wraps the navigator, providing navigation capabilities.
 * - The `headerShown` option is set to `false` to hide headers across all screens.
 */
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./src/screens/MainScreen";
import InstructorScreen from "./src/screens/InstructorScreen";
import CalendarScreen from "./src/screens/CalenderScreen";

// Create a Stack Navigator
const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainScreen"
        screenOptions={{ headerShown: false }}
      >
        {/* Define application screens */}
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="InstructorScreen" component={InstructorScreen} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
