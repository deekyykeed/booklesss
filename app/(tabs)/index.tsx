import { useState, useCallback } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '@/components/Themed';
import { useRouter, useFocusEffect } from 'expo-router';
import CreateCourseModal from '@/components/CreateCourseModal';
import CourseCard from '@/components/CourseCard';
import { CourseFormData } from '@/types/course';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { createCourse, getCourses, type Course } from '@/services/courseService';
import { uploadPDF, createPDFRecord, getCoursePDFs } from '@/services/pdfService';
import { processPendingPDFs } from '@/services/pdfExtraction';
import { generateCourseOutline } from '@/services/outlineService';

interface CourseWithStats extends Course {
  pdfCount: number;
}

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  // Load courses when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadCourses();
    }, [])
  );

  const loadCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await getCourses();

      // Get PDF counts for each course
      const coursesWithStats = await Promise.all(
        fetchedCourses.map(async (course) => {
          const pdfs = await getCoursePDFs(course.id);
          return {
            ...course,
            pdfCount: pdfs.length,
          };
        })
      );

      setCourses(coursesWithStats);
    } catch (error: any) {
      console.error('Error loading courses:', error);
      // Silently handle errors - just show empty state
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  }, []);

  const handleCreateCourse = async (courseData: CourseFormData) => {
    try {
      setCreating(true);
      console.log('[Home] Creating course:', courseData.name);

      // 1. Create course in database
      const course = await createCourse({
        name: courseData.name,
        description: courseData.description,
        writing_style: courseData.writingStyle!,
      });

      console.log('[Home] Course created with ID:', course.id);

      // 2. Upload PDFs
      console.log(`[Home] Uploading ${courseData.pdfs.length} PDFs...`);

      for (const pdf of courseData.pdfs) {
        // Upload file to storage
        const fileUrl = await uploadPDF(course.id, pdf.uri, pdf.name);

        // Create PDF record
        await createPDFRecord(course.id, pdf.name, fileUrl, pdf.size);
      }

      console.log('[Home] All PDFs uploaded');

      // 3. Process PDFs in background
      const pdfs = await getCoursePDFs(course.id);
      processPendingPDFs(pdfs).catch((error) => {
        console.error('[Home] PDF processing error:', error);
      });

      // 4. Generate outline in background
      generateCourseOutline(course.id, course.writing_style).catch((error) => {
        console.error('[Home] Outline generation error:', error);
      });

      // 5. Refresh courses list
      await loadCourses();

      // Close modal
      setIsModalVisible(false);

      // Show success message
      Alert.alert(
        'Course Created!',
        `${course.name} has been created. We're processing your PDFs and generating the course outline. This may take a few minutes.`,
        [
          {
            text: 'View Course',
            onPress: () => router.push(`/course/${course.id}`),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error: any) {
      console.error('[Home] Error creating course:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create course. Please try again.'
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Courses</Text>
            <Text style={styles.subtitle}>Organize and study your course materials</Text>
          </View>
        </View>

        {/* Demo Course Cards */}
        <View style={styles.demoCardsContainer}>
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </View>

        {loading && courses.length === 0 ? (
          // Loading state
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading courses...</Text>
          </View>
        ) : courses.length === 0 ? (
          // Empty state
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No courses yet</Text>
            <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
              Create your first course to get started with studying
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.tint }]}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
              disabled={creating}
            >
              <Text style={styles.createButtonText}>+ Create Your First Course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Courses list
          <View style={styles.coursesContainer}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseCard,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => router.push(`/course/${course.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.courseHeader}>
                  <Text style={[styles.courseName, { color: colors.text }]}>{course.name}</Text>
                  {course.status === 'processing' && (
                    <ActivityIndicator size="small" color={colors.tint} />
                  )}
                  {course.status === 'ready' && (
                    <Text style={styles.statusBadge}>✓</Text>
                  )}
                </View>
                {course.description && (
                  <Text style={[styles.courseDescription, { color: colors.tabIconDefault }]}>
                    {course.description}
                  </Text>
                )}
                <View style={styles.courseFooter}>
                  <Text style={[styles.courseInfo, { color: colors.tabIconDefault }]}>
                    📄 {course.pdfCount} PDF{course.pdfCount !== 1 ? 's' : ''}
                  </Text>
                  <Text style={[styles.courseInfo, { color: colors.tabIconDefault }]}>
                    ✨ {course.writing_style}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.addButton, { borderColor: colors.tint }]}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
              disabled={creating}
            >
              <Text style={[styles.addButtonText, { color: colors.tint }]}>
                + Add Another Course
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <CreateCourseModal
        visible={isModalVisible && !creating}
        onClose={() => setIsModalVisible(false)}
        onComplete={handleCreateCourse}
      />

      {creating && (
        <View style={styles.creatingOverlay}>
          <View style={[styles.creatingCard, { backgroundColor: colors.background }]}>
            <ActivityIndicator size="large" color={colors.tint} />
            <Text style={[styles.creatingText, { color: colors.text }]}>
              Creating course...
            </Text>
            <Text style={[styles.creatingSubtext, { color: colors.tabIconDefault }]}>
              Uploading PDFs and setting up your course
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    opacity: 0.7,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  coursesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  courseCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  courseName: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    fontSize: 20,
    color: '#4CAF50',
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  courseInfo: {
    fontSize: 14,
  },
  addButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  creatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatingCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 250,
  },
  creatingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  creatingSubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  demoCardsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
});
