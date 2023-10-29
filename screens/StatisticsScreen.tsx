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
      // Calculate category statistics and total amount spent when the screen becomes focused
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

  // Customize the appearance of the bar chart
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
          <Text>Total Amount Spent: ${totalAmountSpent.toFixed(2)}</Text>
          <Text>Spending by Categories (Bar Chart):</Text>
          <BarChart
            data={chartData}
            width={Dimensions.get("screen").width - 50}
            height={450}
            chartConfig={chartConfig}
            verticalLabelRotation={30} // Rotate X-axis labels for better visibility
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
});

export default StatisticsScreen;
