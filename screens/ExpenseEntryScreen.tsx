import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  TextInput,
  Provider as PaperProvider,
  Modal,
  Portal,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useExpenseStore from "../store/expenseStore";
import DateTimePicker from "@react-native-community/datetimepicker";

const theme = {};

const ExpenseEntryScreen = () => {
  const { addExpense, loadExpenses } = useExpenseStore();

  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [categories, setCategories] = useState([
    "Food",
    "Transportation",
    "Housing",
    "Entertainment",
  ]);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const loadExpenseData = async () => {
      try {
        const data = await AsyncStorage.getItem("expenses");
        if (data) {
          const loadedExpenses = JSON.parse(data);
          loadExpenses(loadedExpenses);
        }
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    };

    loadExpenseData();
  }, []);

  const handleExpenseSubmit = async () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setErrorText("Amount is invalid.");
      setErrorModalVisible(true);
      return;
    }

    const selectedDate = date.toISOString().split("T")[0];

    if (!selectedDate || !isValidDate(selectedDate)) {
      setErrorText("Date is invalid. Select a valid date.");
      setErrorModalVisible(true);
      return;
    }

    const expense = {
      amount: parseFloat(amount),
      category: selectedCategory,
      date: selectedDate,
    };
    addExpense(expense);
    try {
      const existingData = await AsyncStorage.getItem("expenses");
      const parsedData = existingData ? JSON.parse(existingData) : [];
      parsedData.push(expense);
      await AsyncStorage.setItem("expenses", JSON.stringify(parsedData));
    } catch (error) {
      console.error("Error saving expense:", error);
    }
    setAmount("");
    setSelectedCategory("Food");
    setDate(new Date());
    setErrorModalVisible(false);
  };

  const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(dateString);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (event.type === "set") {
      setShowDatePicker(false);
      setDate(selectedDate || date);
    } else {
      setShowDatePicker(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text>Enter Expense Amount:</Text>
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={(text) => setAmount(text)}
            keyboardType="numeric"
            style={styles.amountInput}
          />
          <Button
            onPress={showDatePickerModal}
            title="Select Date"
            style={styles.submitBtn}
          />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.input}
          >
            {categories.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>

          <View style={styles.submitBtn}>
            <Button onPress={handleExpenseSubmit} title="Submit" />
          </View>

          <Portal>
            <Modal
              visible={errorModalVisible}
              onDismiss={() => setErrorModalVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <Text style={styles.errorText}>{errorText}</Text>
              <Button onPress={() => setErrorModalVisible(false)} title="Ok" />
            </Modal>
          </Portal>
        </View>
      </TouchableWithoutFeedback>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  input: {
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  errorText: {
    fontSize: 20,
    color: "white",
  },
  amountInput: {
    marginBottom: 15,
  },
  submitBtn: {},
});

export default ExpenseEntryScreen;
