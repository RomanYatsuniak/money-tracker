import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useExpenseStore from "../store/expenseStore";
import { Card, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

const categoryIcons = {
  Food: "cutlery",
  Transportation: "car",
  Housing: "home",
  Entertainment: "film",
};

const ExpenseListScreen = () => {
  const { expenses, removeExpense, removeAllExpenses } = useExpenseStore();

  const handleDeleteExpense = (expense) => {
    // Remove the expense from the store and AsyncStorage
    removeExpense(expense);

    // You can also remove it from AsyncStorage to keep data in sync
    // Note: Error handling and confirmation prompts should be added in a production app
    AsyncStorage.getItem("expenses")
      .then((data) => {
        if (data) {
          const parsedData = JSON.parse(data);
          const updatedData = parsedData.filter(
            (item) => item.id !== expense.id
          );
          AsyncStorage.setItem("expenses", JSON.stringify(updatedData));
        }
      })
      .catch((error) => {
        console.error("Error removing expense from AsyncStorage:", error);
      });
  };

  const handleRemoveAllExpenses = async () => {
    // Remove all expenses from the store
    removeAllExpenses();

    // Also remove all expenses from AsyncStorage
    try {
      await AsyncStorage.removeItem("expenses");
    } catch (error) {
      console.error("Error removing expenses from AsyncStorage:", error);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text>Amount: {item.amount}</Text>
        <Icon
          name={categoryIcons[item.category]}
          size={20} // Adjust the size as needed
          style={styles.categoryIcon}
        />
        <Text>Category: {item.category}</Text>
        <Text>Date: {item.date}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteExpense(item)}
          style={styles.deleteButton}
        >
          <IconButton icon="delete" color="red" size={20} />
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleRemoveAllExpenses}
        style={styles.deleteAllButton}
      >
        <Text>Delete All</Text>
      </TouchableOpacity>
      <Text>Expense List:</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  expenseItem: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
  },
});

export default ExpenseListScreen;
