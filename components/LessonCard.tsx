import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { type LessonWithSteps } from '@/services/lessonService';
import * as Haptics from 'expo-haptics';

interface LessonCardProps {
  lesson: LessonWithSteps;
  expanded: boolean;
  onToggle: () => void;
  onStepPress: (stepId: string) => void;
}

export default function LessonCard({ lesson, expanded, onToggle, onStepPress }: LessonCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const completedSteps = lesson.steps.filter((step) => step.completed).length;
  const totalSteps = lesson.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onToggle();
  };

  const handleStepPress = (stepId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onStepPress(stepId);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
          borderColor: colors.border,
        },
      ]}
    >
      {/* Lesson Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.lessonNumber, { color: colors.tint }]}>
            Lesson {lesson.order_index}
          </Text>
          <Text style={[styles.lessonTitle, { color: colors.text }]}>
            {lesson.title}
          </Text>
          {lesson.description && (
            <Text style={[styles.lessonDescription, { color: colors.tabIconDefault }]}>
              {lesson.description}
            </Text>
          )}
        </View>

        <View style={styles.headerRight}>
          <Text style={[styles.expandIcon, { color: colors.text }]}>
            {expanded ? '▼' : '▶'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { backgroundColor: colorScheme === 'dark' ? '#333' : '#e0e0e0' },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.tint,
                width: `${progress}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.tabIconDefault }]}>
          {completedSteps} / {totalSteps} completed
        </Text>
      </View>

      {/* Steps List */}
      {expanded && (
        <View style={styles.stepsContainer}>
          {lesson.steps.map((step) => (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepItem,
                {
                  backgroundColor: colorScheme === 'dark' ? '#222' : '#fff',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleStepPress(step.id)}
              activeOpacity={0.7}
            >
              <View style={styles.stepLeft}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: step.completed ? colors.tint : colors.tabIconDefault,
                      backgroundColor: step.completed ? colors.tint : 'transparent',
                    },
                  ]}
                >
                  {step.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={styles.stepTextContainer}>
                  <Text
                    style={[
                      styles.stepTitle,
                      {
                        color: colors.text,
                        opacity: step.completed ? 0.6 : 1,
                        textDecorationLine: step.completed ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {step.title}
                  </Text>
                </View>
              </View>
              <Text style={[styles.arrow, { color: colors.tabIconDefault }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 12,
    paddingTop: 4,
  },
  lessonNumber: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  expandIcon: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
  },
  stepsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  stepLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
  },
  arrow: {
    fontSize: 20,
    marginLeft: 8,
  },
});
