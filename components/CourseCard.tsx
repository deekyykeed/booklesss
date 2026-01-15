import Colors from '@/constants/Colors';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import * as Haptics from 'expo-haptics';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from './Themed';
import { useColorScheme } from './useColorScheme';

interface CourseCardProps {
  name: string;
  lastOpened: string;
  completionPercentage?: number;
  liveUsers?: number;
  onPress?: () => void;
}

export default function CourseCard({ name, lastOpened, completionPercentage, liveUsers, onPress }: CourseCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const activityText = liveUsers && liveUsers > 0 
    ? `${liveUsers} ${liveUsers === 1 ? 'person' : 'people'} live`
    : null;

  return (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.courseContent}>
        <Text style={[styles.courseTitle, { color: colors.text }]}>
          {name}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={[styles.metaText, { color: 'rgba(0, 0, 0, 0.6)' }]}>
            {lastOpened}
          </Text>
          {activityText && (
            <>
              <Text style={[styles.metaSeparator, { color: 'rgba(0, 0, 0, 0.6)' }]}> • </Text>
              <Text style={[styles.metaText, { color: colors.tint }]}>
                {activityText}
              </Text>
            </>
          )}
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={[styles.percentage, { color: colors.text }]}>
          {completionPercentage !== undefined ? Math.round(completionPercentage) : 0}%
        </Text>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={24}
          color={colors.text}
          strokeWidth={2}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.12)',
  },
  courseContent: {
    flex: 1,
    marginRight: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'GoogleSans-Medium',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 0,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'FamiljenGrotesk-Regular',
  },
  metaSeparator: {
    fontSize: 14,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  percentage: {
    fontSize: 16,
    fontFamily: 'Fortnite',
  },
});

