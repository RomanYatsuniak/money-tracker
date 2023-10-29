import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import useExpenseStore from "./../store/expenseStore";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
const StatisticsScreen = () => {
  const { categoryStatistics, totalAmountSpent, calculateCategoryStatistics } =
    useExpenseStore();
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      calculateCategoryStatistics();
    }, [calculateCategoryStatistics])
  );
  const categories = Object.keys(categoryStatistics);
  const amounts = categories.map((category) => categoryStatistics[category]);

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.background,
    backgroundGradientTo: theme.colors.background,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      {amounts.length > 0 ? (
        <>
          <Text style={styles.header}>
            Total Amount Spent: ${totalAmountSpent.toFixed(2)}
          </Text>
          <Text style={styles.subHeader}>Spending by Categories Chart:</Text>
          <BarChart
            data={chartData}
            width={Dimensions.get("screen").width - 50}
            height={450}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
          />
        </>
      ) : (
        <Text>No data</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default StatisticsScreen;
