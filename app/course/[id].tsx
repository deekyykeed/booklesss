import { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { getCourse, type Course } from '@/services/courseService';
import { getLessonsWithSteps, type LessonWithSteps } from '@/services/lessonService';
import LessonCard from '@/components/LessonCard';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<LessonWithSteps[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      setLoading(true);

      // Load course
      const fetchedCourse = await getCourse(id);
      if (!fetchedCourse) {
        Alert.alert('Error', 'Course not found');
        router.back();
        return;
      }
      setCourse(fetchedCourse);

      // Load lessons and steps
      const fetchedLessons = await getLessonsWithSteps(id);
      setLessons(fetchedLessons);

      // Expand first lesson by default
      if (fetchedLessons.length > 0) {
        setExpandedLessons(new Set([fetchedLessons[0].id]));
      }
    } catch (error: any) {
      console.error('Error loading course:', error);
      Alert.alert('Error', 'Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  const handleStepPress = (stepId: string) => {
    router.push(`/step/${stepId}`);
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

  if (!course) {
    return (
      <>
        <Stack.Screen options={{ title: 'Error' }} />
        <View style={[styles.container, styles.centerContent]}>
          <Text style={{ color: colors.text }}>Course not found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: course.name }} />
      <ScrollView style={styles.container}>
        {/* Course Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>{course.name}</Text>
          {course.description && (
            <Text style={[styles.description, { color: colors.tabIconDefault }]}>
              {course.description}
            </Text>
          )}

          {/* Status Badge */}
          <View style={styles.statusContainer}>
            {course.status === 'processing' && (
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
                <ActivityIndicator size="small" color="#FFC107" />
                <Text style={[styles.statusText, { color: '#FFC107' }]}>Processing...</Text>
              </View>
            )}
            {course.status === 'ready' && (
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(76, 175, 80, 0.1)' }]}>
                <Text style={[styles.statusText, { color: '#4CAF50' }]}>✓ Ready to Study</Text>
              </View>
            )}
            {course.status === 'failed' && (
              <View style={[styles.statusBadge, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
                <Text style={[styles.statusText, { color: '#F44336' }]}>⚠ Processing Failed</Text>
              </View>
            )}
          </View>
        </View>

        {/* Lessons */}
        {lessons.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
              {course.status === 'processing'
                ? 'Your course outline is being generated. This may take a few minutes...'
                : course.status === 'failed'
                ? 'There was an error generating your course outline. Please try again.'
                : 'No lessons found for this course.'}
            </Text>
            {course.status === 'failed' && (
              <TouchableOpacity
                style={[styles.retryButton, { backgroundColor: colors.tint }]}
                onPress={loadCourseData}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.lessonsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Course Outline ({lessons.length} Lessons)
            </Text>

            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                expanded={expandedLessons.has(lesson.id)}
                onToggle={() => toggleLesson(lesson.id)}
                onStepPress={handleStepPress}
              />
            ))}
          </View>
        )}
      </ScrollView>
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
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lessonsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
