import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#00D5FA",
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    textAlign: "center",
  },
});

export default CustomModal;
