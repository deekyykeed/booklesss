import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { CourseFormData } from '@/types/course';

interface CourseInfoStepProps {
  name: string;
  description: string;
  onUpdate: (data: Partial<CourseFormData>) => void;
}

export default function CourseInfoStep({ name, description, onUpdate }: CourseInfoStepProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Let's start with the basics</Text>
      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
        Give your course a name and description
      </Text>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          Course Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="e.g., Biology 101, Intro to Psychology"
          placeholderTextColor={colors.tabIconDefault}
          value={name}
          onChangeText={(text) => onUpdate({ name: text })}
          autoFocus
          returnKeyType="next"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Description (optional)</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Brief description of what this course covers"
          placeholderTextColor={colors.tabIconDefault}
          value={description}
          onChangeText={(text) => onUpdate({ description: text })}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          returnKeyType="done"
        />
      </View>

      <View style={styles.tipContainer}>
        <Text style={[styles.tipText, { color: colors.tabIconDefault }]}>
          💡 Tip: Choose a clear, descriptive name to easily identify your course later
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: '#ff4444',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  tipContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(47, 149, 220, 0.1)',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
