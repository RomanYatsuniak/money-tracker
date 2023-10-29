import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExpenseEntryScreen from "./../screens/ExpenseEntryScreen";
import ExpenseListScreen from "./../screens/ExpenseListScreen";
import { FontAwesome5 } from "react-native-vector-icons";
import StatisticsScreen from "../screens/StatisticsScreen";

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Expense Entry"
        component={ExpenseEntryScreen}
        options={{
          tabBarLabel: "Entry",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Expense List"
        component={ExpenseListScreen}
        options={{
          tabBarLabel: "List",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          tabBarLabel: "Statistics",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="chart-pie" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
