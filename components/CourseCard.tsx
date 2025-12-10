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
        {title && (
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        )}
        {description && (
          <Text style={[styles.description, { color: colors.tabIconDefault }]}>
            {description}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      {description && (
        <Text style={[styles.description, { color: colors.tabIconDefault }]}>
          {description}
        </Text>
      )}
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
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
  },
});
