import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { getStep, toggleStepCompletion, updateStepContent, type Step } from '@/services/lessonService';
import { getCourse } from '@/services/courseService';
import { getAllExtractedText } from '@/services/pdfService';
import { generateStepContent } from '@/services/outlineService';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';

export default function StepDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState<Step | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  useEffect(() => {
    loadStep();
  }, [id]);

  const loadStep = async () => {
    try {
      setLoading(true);
      const fetchedStep = await getStep(id);

      if (!fetchedStep) {
        Alert.alert('Error', 'Step not found');
        router.back();
        return;
      }

      setStep(fetchedStep);

      // Check if content needs to be generated
      if (!fetchedStep.content) {
        console.log('[Step] Content is null, triggering generation');
        await generateContent(fetchedStep);
      }
    } catch (error: any) {
      console.error('Error loading step:', error);
      Alert.alert('Error', 'Failed to load step');
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async (currentStep: Step) => {
    try {
      setGeneratingContent(true);
      console.log('[Step] Starting content generation for:', currentStep.title);

      // Get lesson to retrieve course_id
      const { data: lesson } = await supabase
        .from('lessons')
        .select('course_id')
        .eq('id', currentStep.lesson_id)
        .single();

      if (!lesson) {
        throw new Error('Lesson not found');
      }

      // Get course to retrieve writing_style
      const course = await getCourse(lesson.course_id);
      if (!course) {
        throw new Error('Course not found');
      }

      console.log('[Step] Found course with writing style:', course.writing_style);

      // Get PDF content for context
      const pdfTexts = await getAllExtractedText(course.id);
      const combinedText = pdfTexts.join('\n\n---\n\n');

      console.log('[Step] Got PDF content, generating with Claude...');

      // Generate content using Claude
      const content = await generateStepContent(
        currentStep.title,
        combinedText.substring(0, 30000), // Limit context size to avoid token limits
        course.writing_style
      );

      console.log('[Step] Content generated, saving to database...');

      // Save to database
      await updateStepContent(currentStep.id, content);

      // Update local state
      setStep({ ...currentStep, content });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('[Step] Content generation complete!');
    } catch (error: any) {
      console.error('[Step] Error generating content:', error);
      Alert.alert(
        'Content Generation Failed',
        'Unable to generate content for this step. Please try again.',
        [
          { text: 'Retry', onPress: () => generateContent(currentStep) },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleToggleCompletion = async () => {
    if (!step || toggling) return;

    try {
      setToggling(true);
      Haptics.notificationAsync(
        step.completed
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );

      await toggleStepCompletion(step.id);

      // Update local state
      setStep({ ...step, completed: !step.completed });
    } catch (error: any) {
      console.error('Error toggling completion:', error);
      Alert.alert('Error', 'Failed to update step status');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      </>
    );
  }

  if (!step) {
    return (
      <>
        <Stack.Screen options={{ title: 'Error' }} />
        <View style={[styles.container, styles.centerContent]}>
          <Text style={{ color: colors.text }}>Step not found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: step.title }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{step.title}</Text>

            {/* Completion Badge */}
            {step.completed && (
              <View style={[styles.completedBadge, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Text style={[styles.completedText, { color: '#4CAF50' }]}>✓ Completed</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {generatingContent ? (
              <View style={styles.generatingContainer}>
                <ActivityIndicator size="large" color={colors.tint} />
                <Text style={[styles.generatingText, { color: colors.text }]}>
                  Generating content...
                </Text>
                <Text style={[styles.generatingSubtext, { color: colors.tabIconDefault }]}>
                  This will only take a moment
                </Text>
              </View>
            ) : step.content ? (
              <Text style={[styles.content, { color: colors.text }]}>{step.content}</Text>
            ) : (
              <View style={styles.noContent}>
                <Text style={[styles.noContentText, { color: colors.tabIconDefault }]}>
                  Content generation failed. Please try reloading the step.
                </Text>
              </View>
            )}

            {/* References */}
            {step.references && step.references.length > 0 && (
              <View style={styles.referencesContainer}>
                <Text style={[styles.referencesTitle, { color: colors.text }]}>
                  Sources
                </Text>

                {step.references.map((ref, index) => (
                  <View
                    key={index}
                    style={[
                      styles.referenceItem,
                      {
                        backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.referenceText, { color: colors.text }]}>
                      📄 Page {ref.page_number}
                    </Text>
                    {ref.excerpt && (
                      <Text style={[styles.excerptText, { color: colors.tabIconDefault }]}>
                        "{ref.excerpt}"
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer with Complete Button */}
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              {
                backgroundColor: step.completed ? colors.tabIconDefault : colors.tint,
              },
            ]}
            onPress={handleToggleCompletion}
            disabled={toggling}
            activeOpacity={0.8}
          >
            {toggling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.completeButtonText}>
                {step.completed ? '↺ Mark as Incomplete' : '✓ Mark as Complete'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  completedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  completedText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
  },
  noContent: {
    padding: 32,
    alignItems: 'center',
  },
  noContentText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  generatingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  generatingText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  generatingSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  referencesContainer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  referencesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  referenceItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  referenceText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  excerptText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  completeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
