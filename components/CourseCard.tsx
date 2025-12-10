import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';

interface CourseCardProps {
  title?: string;
  description?: string;
  onPress?: () => void;
}

export default function CourseCard({ title, description, onPress }: CourseCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.textWrapper}>
          <Text style={styles.cardText}>Course Title</Text>
          <Text style={styles.subtitle}>Dec 2023 - Q3</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.cardText}>Course Title</Text>
        <Text style={styles.subtitle}>Dec 2023 - Q3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 14,
    backgroundColor: '#efeee5',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(33, 33, 33, 0.1)',
    overflow: 'hidden',
    flexWrap: 'nowrap',
    // Subtle shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  textWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    padding: 0,
    gap: 4,
  },
  cardText: {
    width: '100%',
    fontWeight: '700',
    color: '#000000',
    fontSize: 16,
    lineHeight: 20.8, // 16 * 1.3
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    width: '100%',
    fontWeight: '500',
    color: 'rgba(31, 31, 31, 0.6)',
    fontSize: 14,
    lineHeight: 16.8, // 14 * 1.2
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
