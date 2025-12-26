import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';

interface WorkChartProps {
  data?: { day: string; hours: number; isToday?: boolean }[];
}

const DEFAULT_DATA = [
  { day: 'M', hours: 2.5, isToday: false },
  { day: 'T', hours: 3.0, isToday: false },
  { day: 'W', hours: 1.5, isToday: false },
  { day: 'T', hours: 4.0, isToday: false },
  { day: 'F', hours: 2.0, isToday: false },
  { day: 'S', hours: 3.5, isToday: false },
  { day: 'S', hours: 1.8, isToday: true },
];

const MAX_HOURS = 5;

export default function WorkChart({ data = DEFAULT_DATA }: WorkChartProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const maxHours = Math.max(...data.map(d => d.hours), MAX_HOURS);
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <View style={[styles.container, {
      backgroundColor: isDark ? colors.background : '#ffffff',
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          This Week
        </Text>
        <Text style={[styles.totalHours, { color: colors.tint }]}>
          {totalHours.toFixed(1)}h
        </Text>
      </View>

      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const heightPercentage = (item.hours / maxHours) * 100;
          const barColor = item.isToday
            ? colors.tint
            : isDark
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.1)';

          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${heightPercentage}%`,
                      backgroundColor: barColor,
                    },
                  ]}
                />
              </View>
              <Text style={[
                styles.dayLabel,
                {
                  color: item.isToday
                    ? colors.tint
                    : isDark
                      ? 'rgba(255, 255, 255, 0.5)'
                      : 'rgba(0, 0, 0, 0.4)',
                  fontWeight: item.isToday ? '600' : '400',
                }
              ]}>
                {item.day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.4,
  },
  totalHours: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    gap: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  barWrapper: {
    width: '100%',
    height: 90,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 3,
  },
  dayLabel: {
    fontSize: 13,
    letterSpacing: -0.2,
  },
});

