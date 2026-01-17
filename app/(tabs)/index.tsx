import { useState, useEffect, useCallback } from 'react';
import CourseCard from '@/components/CourseCard';
import CreateCourseModal from '@/components/CreateCourseModal';
import { Text, View as ThemedView } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { FolderAddIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator, RefreshControl, ScrollView, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getCourses, type Course } from '@/services/courseService';
import { createCourseWithPDFs, type CourseCreationProgress } from '@/services/courseWorkflowService';
import { CourseFormData } from '@/types/course';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      Alert.alert('Error', 'Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCourses();
  }, []);

  const handleCoursePress = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleCourseCreate = async (formData: CourseFormData) => {
    try {
      setCreating(true);
      setModalVisible(false);

      // Show progress (you can enhance this with a progress modal later)
      const onProgress = (progress: CourseCreationProgress) => {
        console.log('[Home] Progress:', progress);
        // TODO: Show progress modal or toast
      };

      const newCourse = await createCourseWithPDFs(formData, onProgress);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Refresh courses list
      await loadCourses();

      // Navigate to the new course
      router.push(`/course/${newCourse.id}`);
    } catch (error: any) {
      console.error('Error creating course:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create course. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setCreating(false);
    }
  };

  const formatLastOpened = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const colors = Colors[colorScheme ?? 'light'];
  const TAB_BAR_HEIGHT = 48;
  const buttonBottom = TAB_BAR_HEIGHT + insets.bottom + 16;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Home</Text>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.tabIconDefault }]}>
            Loading courses...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
      <Text style={[styles.pageTitle, { color: colors.text }]}>Home</Text>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {courses.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              No courses yet
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.tabIconDefault }]}>
              Tap the + button below to create your first course
            </Text>
          </ThemedView>
        ) : (
          <View style={styles.coursesContainer}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                name={course.name}
                lastOpened={formatLastOpened(course.updated_at)}
                liveUsers={Math.floor(Math.random() * 15) + 1} // Mock for now
                onPress={() => handleCoursePress(course.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[styles.addButton, { bottom: buttonBottom }]}
        onPress={handleAddPress}
        activeOpacity={0.7}
        disabled={creating}
      >
        <View style={styles.iconShadow}>
          {creating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <HugeiconsIcon icon={FolderAddIcon} size={24} color="#fff" strokeWidth={2} />
          )}
        </View>
      </TouchableOpacity>

      <CreateCourseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onComplete={handleCourseCreate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 14,
    paddingHorizontal: 14,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'GoogleSans-Bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  coursesContainer: {
    gap: 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    right: 14,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#D97655',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
});
