/**
 * CustomModal Component
 *
 * A reusable modal component with customizable content, title, and a close button.
 *
 * @param {boolean} visible - Controls the visibility of the modal. If `true`, the modal is displayed.
 * @param {string} title - The title of the modal, displayed at the top.
 * @param {() => void} onClose - Callback function to handle the close action when the close button is pressed.
 * @param {React.ReactNode} children - The content to display inside the modal.
 */

import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// Props interface for CustomModal
interface Props {
  /**
   * Determines if the modal is visible.
   */
  visible: boolean;

  /**
   * Title of the modal, displayed at the top.
   */
  title: string;

  /**
   * Callback function executed when the modal is closed.
   */
  onClose: () => void;

  /**
   * Content to be displayed inside the modal.
   */
  children: React.ReactNode;
}

// CustomModal functional component
const CustomModal: React.FC<Props> = ({
  visible,
  title,
  onClose,
  children,
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView>
          <Text style={styles.title}>{title}</Text>
          {children}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

// Styles for the CustomModal component
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%", // Modal content width
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10, // Space below the title
  },
  closeButton: {
    marginTop: 10, // Space above the close button
    padding: 10,
    backgroundColor: "#00D5FA", // Button color
    borderRadius: 5, // Rounded corners
  },
  closeText: {
    color: "white", // Text color for the button
    textAlign: "center", // Center align the text
  },
});

export default CustomModal;
