import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useExpenseStore, { Expense } from "../store/expenseStore";
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

  const handleDeleteExpense = (expense: Expense) => {
    removeExpense(expense);
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
    removeAllExpenses();
    try {
      await AsyncStorage.removeItem("expenses");
    } catch (error) {
      console.error("Error removing expenses from AsyncStorage:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ paddingHorizontal: 1 }}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardAmount}>Amount: {item.amount}$</Text>
              <View style={styles.cardInfo}>
                <Icon
                  name={categoryIcons[item.category]}
                  size={30}
                  style={styles.categoryIcon}
                />
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Text style={styles.date}>Date: {item.date}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteExpense(item)}
              style={styles.deleteButton}
            >
              <IconButton icon="delete" iconColor="red" size={30} />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleRemoveAllExpenses}
        style={styles.deleteAllButton}
      >
        <Text>Delete All</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Expense List:</Text>
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
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  card: {
    marginBottom: 16,
  },
  deleteAllButton: {
    paddingVertical: 20,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginBottom: 20,
    borderRadius: 10,
  },
  date: {},
  deleteButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cardAmount: {
    fontSize: 18,
    marginBottom: 5,
  },
  categoryIcon: {},
  category: {
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default ExpenseListScreen;
