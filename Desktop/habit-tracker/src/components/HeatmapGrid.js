import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../theme";

const WEEKS = 52;
const DAYS_PER_WEEK = 7;
const SQUARE_SIZE = 12;
const SQUARE_GAP = 4;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const getColor = (count) => {
  if (!count || count === 0) return colors.heatmap0;
  if (count === 1) return colors.heatmap1;
  if (count === 2) return colors.heatmap2;
  if (count === 3) return colors.heatmap3;
  if (count === 4) return colors.heatmap4;
  return colors.heatmap5;
};

const buildDateGrid = () => {
  const today = new Date();
  const grid = [];

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - WEEKS * 7);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  for (let week = 0; week < WEEKS; week++) {
    const weekDates = [];
    for (let day = 0; day < DAYS_PER_WEEK; day++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + week * 7 + day);
      weekDates.push(date.toISOString().split("T")[0]);
    }
    grid.push(weekDates);
  }
  return grid;
};

const getMonthPositions = (grid) => {
  const positions = [];
  let lastMonth = -1;

  grid.forEach((week, weekIndex) => {
    const month = new Date(week[0]).getMonth();
    if (month !== lastMonth) {
      positions.push({ month, weekIndex });
      lastMonth = month;
    }
  });
  return positions;
};

export default function HeatmapGrid({ countByDate }) {
  const grid = buildDateGrid();
  const monthPositions = getMonthPositions(grid);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View>
          {/* Month labels */}
          <View style={styles.monthRow}>
            <View style={styles.dayLabelSpacer} />
            {grid.map((week, weekIndex) => {
              const monthPos = monthPositions.find(
                (p) => p.weekIndex === weekIndex,
              );
              return (
                <View
                  key={weekIndex}
                  style={[
                    styles.weekColumn,
                    { width: SQUARE_SIZE + SQUARE_GAP + 4 },
                  ]}
                >
                  {monthPos && (
                    <Text style={styles.monthLabel}>
                      {MONTH_LABELS[monthPos.month]}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>

          {/* Grid with day labels */}
          <View style={styles.gridRow}>
            <View style={styles.dayLabels}>
              {DAY_LABELS.map((label, i) => (
                <Text key={i} style={styles.dayLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {grid.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekColumn}>
                {week.map((date, dayIndex) => {
                  const count = countByDate[date] || 0;
                  const isToday =
                    date === new Date().toISOString().split("T")[0];
                  return (
                    <View
                      key={dayIndex}
                      style={[
                        styles.square,
                        { backgroundColor: getColor(count) },
                        isToday && styles.squareToday,
                      ]}
                    />
                  );
                })}
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendLabel}>Less</Text>
            {[0, 1, 2, 3, 4, 5].map((count) => (
              <View
                key={count}
                style={[
                  styles.legendSquare,
                  { backgroundColor: getColor(count) },
                ]}
              />
            ))}
            <Text style={styles.legendLabel}>More</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  monthRow: {
    flexDirection: "row",
    marginBottom: 10,
    height: 16,
  },
  dayLabelSpacer: {
    width: 20,
  },
  monthLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    width: 30,
  },
  gridRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  dayLabels: {
    width: 20,
    marginRight: 4,
  },
  dayLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    height: SQUARE_SIZE + SQUARE_GAP,
    lineHeight: SQUARE_SIZE + SQUARE_GAP,
  },
  weekColumn: {
    flexDirection: "column",
    marginRight: SQUARE_GAP,
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 2,
    marginBottom: SQUARE_GAP,
  },
  squareToday: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  legendLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginHorizontal: 2,
  },
  legendSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
