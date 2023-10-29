import React, { useEffect } from "react";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./navigation/TabNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useExpenseStore from "./store/expenseStore";
import DismissKeyboard from "react-native-dismiss-keyboard";
// import {
//   FontAwesome5,
//   MaterialCommunityIcons,
// } from "react-native-vector-icons";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "red",
  },
  flex: 1,
};

// FontAwesome5.loadFont();
// MaterialCommunityIcons.loadFont();

const App = () => {
  const { loadExpenses } = useExpenseStore();
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
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <TabNavigator />
        {/* </DismissKeyboard> */}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
