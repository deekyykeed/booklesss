import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

interface WorkChartProps {
  data?: { day: string; dayShort: string; hours: number; allDayHours?: number }[];
  currentDayIndex?: number;
}

const getCurrentDate = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  return `${day}/${month}`;
};

const getDateForDay = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}/${month}`;
};

const DEFAULT_DATA = [
  { day: 'Friday', dayShort: 'F', hours: 2.5, allDayHours: 4.5 },
  { day: 'Saturday', dayShort: 'S', hours: 3.0, allDayHours: 5.0 },
  { day: 'Sunday', dayShort: 'S', hours: 1.5, allDayHours: 3.0 },
  { day: 'Monday', dayShort: 'M', hours: 4.0, allDayHours: 6.0 },
  { day: 'Tuesday', dayShort: 'T', hours: 2.0, allDayHours: 4.5 },
  { day: 'Wednesday', dayShort: 'W', hours: 3.5, allDayHours: 5.5 },
  { day: 'Thursday', dayShort: 'T', hours: 2.8, allDayHours: 4.8 },
];

const MAX_HOURS = 8;
const CHART_HEIGHT = 120;
const CHART_WIDTH = Dimensions.get('window').width - 64;
const BAR_WIDTH = (CHART_WIDTH - 56) / 7 - 4; // 7 bars with spacing
const BAR_SPACING = 4;

export default function WorkChart({ data = DEFAULT_DATA, currentDayIndex = 6 }: WorkChartProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const maxHours = Math.max(...data.map(d => d.allDayHours || d.hours), MAX_HOURS);
  const currentDay = data[currentDayIndex];
  const currentHours = currentDay?.hours || 0;
  const currentDate = getCurrentDate();
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const calculateBarHeight = (value: number) => {
    return (value / maxHours) * CHART_HEIGHT;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Daily Usage
        </Text>
      </View>
      
      <Text style={[styles.summaryText, { color: 'rgba(0, 0, 0, 0.6)' }]}>
        You're using a similar amount of time today as you usually do by {currentTime}.
      </Text>

      <View style={styles.percentageContainer}>
        <Text style={[styles.percentage, { color: colors.tint }]}>
          {currentHours.toFixed(0)}h
        </Text>
        <Text style={[styles.dateLabel, { color: 'rgba(0, 0, 0, 0.6)' }]}>
          {currentDate}
        </Text>
      </View>

      <View style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT + 30}>
            {data.map((item, index) => {
              const isCurrentDay = index === currentDayIndex;
              const x = 35 + index * (BAR_WIDTH + BAR_SPACING);
              const allDayHeight = calculateBarHeight(item.allDayHours || item.hours);
              const todayHeight = calculateBarHeight(item.hours);
              const barY = CHART_HEIGHT - allDayHeight;

              return (
                <React.Fragment key={index}>
                  {!isCurrentDay && (
                    <>
                      {/* All Day Bar (lighter) */}
                      <Rect
                        x={x}
                        y={barY}
                        width={BAR_WIDTH}
                        height={allDayHeight}
                        fill="rgba(0, 0, 0, 0.1)"
                        rx={2}
                      />
                      {/* Today Bar (darker, stacked on top) */}
                      <Rect
                        x={x}
                        y={CHART_HEIGHT - todayHeight}
                        width={BAR_WIDTH}
                        height={todayHeight}
                        fill="rgba(0, 0, 0, 0.25)"
                        rx={2}
                      />
                    </>
                  )}
                  {isCurrentDay && (
                    <Rect
                      x={x}
                      y={CHART_HEIGHT - todayHeight}
                      width={BAR_WIDTH}
                      height={todayHeight}
                      fill={colors.tint}
                      rx={3}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
          
          {/* Day Labels */}
          <View style={styles.dayLabelsContainer}>
            {data.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.dayLabel,
                  {
                    color: index === currentDayIndex ? colors.tint : 'rgba(0, 0, 0, 0.6)',
                    fontWeight: index === currentDayIndex ? '600' : '400',
                  },
                ]}
              >
                {index === 0 ? `${item.dayShort} ${getDateForDay(6)}` : item.dayShort}
              </Text>
            ))}
          </View>
        </View>

        {/* Y-Axis Labels */}
        <View style={styles.yAxis}>
          <Text style={[styles.axisLabel, { color: 'rgba(0, 0, 0, 0.4)' }]}>0h</Text>
          <Text style={[styles.axisLabel, { color: 'rgba(0, 0, 0, 0.4)' }]}>{(maxHours / 2).toFixed(0)}h</Text>
          <Text style={[styles.axisLabel, { color: 'rgba(0, 0, 0, 0.4)' }]}>{maxHours}h</Text>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.allDayDot]} />
          <Text style={[styles.legendText, { color: 'rgba(0, 0, 0, 0.6)' }]}>All Day</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.todayDot]} />
          <Text style={[styles.legendText, { color: 'rgba(0, 0, 0, 0.6)' }]}>Daily by {currentTime}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  summaryText: {
    fontSize: 15,
    fontFamily: 'FamiljenGrotesk-Regular',
    marginBottom: 16,
    lineHeight: 20,
  },
  percentageContainer: {
    marginBottom: 24,
  },
  percentage: {
    fontSize: 34,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  dateLabel: {
    fontSize: 15,
    fontFamily: 'FamiljenGrotesk-Regular',
    marginTop: 4,
  },
  chartWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  chartContainer: {
    flex: 1,
    height: CHART_HEIGHT + 30,
  },
  dayLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 35,
    marginTop: 8,
  },
  dayLabel: {
    fontSize: 11,
    fontFamily: 'FamiljenGrotesk-Regular',
    width: BAR_WIDTH,
    textAlign: 'center',
  },
  yAxis: {
    width: 35,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 8,
  },
  axisLabel: {
    fontSize: 10,
    fontFamily: 'FamiljenGrotesk-Regular',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  allDayDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  todayDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'FamiljenGrotesk-Regular',
  },
});
