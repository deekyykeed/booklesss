import { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import CreateCourseModal from '@/components/CreateCourseModal';
import { CourseFormData } from '@/types/course';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [courses, setCourses] = useState<CourseFormData[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleCreateCourse = (courseData: CourseFormData) => {
    console.log('Course created:', courseData);
    // TODO: Save to Supabase later
    setCourses([...courses, courseData]);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Courses</Text>
            <Text style={styles.subtitle}>Organize and study your course materials</Text>
          </View>
        </View>

        {courses.length === 0 ? (
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
            >
              <Text style={styles.createButtonText}>+ Create Your First Course</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Courses list
          <View style={styles.coursesContainer}>
            {courses.map((course, index) => (
              <View
                key={index}
                style={[
                  styles.courseCard,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.courseName, { color: colors.text }]}>{course.name}</Text>
                {course.description && (
                  <Text style={[styles.courseDescription, { color: colors.tabIconDefault }]}>
                    {course.description}
                  </Text>
                )}
                <View style={styles.courseFooter}>
                  <Text style={[styles.courseInfo, { color: colors.tabIconDefault }]}>
                    📄 {course.pdfs.length} PDF{course.pdfs.length !== 1 ? 's' : ''}
                  </Text>
                  {course.writingStyle && (
                    <Text style={[styles.courseInfo, { color: colors.tabIconDefault }]}>
                      ✨ {course.writingStyle}
                    </Text>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={[styles.addButton, { borderColor: colors.tint }]}
              onPress={() => setIsModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.addButtonText, { color: colors.tint }]}>
                + Add Another Course
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <CreateCourseModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onComplete={handleCreateCourse}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  courseName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
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
});
