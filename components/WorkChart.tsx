import { Text } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { StyleSheet, View } from 'react-native';

interface WorkChartProps {
  data?: { day: string; hours: number }[];
}

const DEFAULT_DATA = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.0 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 2.0 },
  { day: 'Sat', hours: 3.5 },
  { day: 'Sun', hours: 1.0 },
];

const MAX_HOURS = 5;

export default function WorkChart({ data = DEFAULT_DATA }: WorkChartProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const maxHours = Math.max(...data.map(d => d.hours), MAX_HOURS);
  const totalHours = data.reduce((sum, d) => sum + d.hours, 0);

  return (
    <View style={styles.container}>
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
          const height = (item.hours / maxHours) * 100;
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: height,
                      backgroundColor: colors.tint,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.dayLabel, { color: 'rgba(0, 0, 0, 0.6)' }]}>
                {item.day}
              </Text>
              <Text style={[styles.hoursLabel, { color: 'rgba(0, 0, 0, 0.4)' }]}>
                {item.hours.toFixed(1)}h
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  totalHours: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'GoogleSans-Medium',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '80%',
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  dayLabel: {
    fontSize: 11,
    fontFamily: 'FamiljenGrotesk-Regular',
    marginTop: 4,
  },
  hoursLabel: {
    fontSize: 9,
    fontFamily: 'FamiljenGrotesk-Regular',
    marginTop: 2,
  },
});

