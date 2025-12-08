import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseFormData } from '@/types/course';
import { WritingStyleId } from '@/constants/WritingStyles';
import CourseInfoStep from './CourseInfoStep';
import WritingStyleStep from './WritingStyleStep';
import PDFUploadStep from './PDFUploadStep';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';

interface CreateCourseModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (courseData: CourseFormData) => void;
}

export default function CreateCourseModal({
  visible,
  onClose,
  onComplete,
}: CreateCourseModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CourseFormData>({
    name: '',
    description: '',
    writingStyle: null,
    pdfs: [],
  });

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
    // Reset form
    setCurrentStep(1);
    setFormData({
      name: '',
      description: '',
      writingStyle: null,
      pdfs: [],
    });
  };

  const updateFormData = (updates: Partial<CourseFormData>) => {
    setFormData({ ...formData, ...updates });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        return formData.writingStyle !== null;
      case 3:
        return formData.pdfs.length > 0;
      default:
        return false;
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setCurrentStep(1);
    setFormData({
      name: '',
      description: '',
      writingStyle: null,
      pdfs: [],
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={handleClose}>
              <Text style={[styles.closeButton, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Create New Course</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((step) => (
              <View key={step} style={styles.progressStepContainer}>
                <View
                  style={[
                    styles.progressDot,
                    {
                      backgroundColor:
                        step <= currentStep ? colors.tint : colors.tabIconDefault,
                    },
                  ]}
                />
                {step < 3 && (
                  <View
                    style={[
                      styles.progressLine,
                      {
                        backgroundColor:
                          step < currentStep ? colors.tint : colors.tabIconDefault,
                      },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Step Labels */}
          <View style={styles.stepLabelsContainer}>
            <Text
              style={[
                styles.stepLabel,
                { color: currentStep === 1 ? colors.tint : colors.tabIconDefault },
              ]}
            >
              Info
            </Text>
            <Text
              style={[
                styles.stepLabel,
                { color: currentStep === 2 ? colors.tint : colors.tabIconDefault },
              ]}
            >
              Style
            </Text>
            <Text
              style={[
                styles.stepLabel,
                { color: currentStep === 3 ? colors.tint : colors.tabIconDefault },
              ]}
            >
              Materials
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            {currentStep === 1 && (
              <CourseInfoStep
                name={formData.name}
                description={formData.description}
                onUpdate={updateFormData}
              />
            )}

            {currentStep === 2 && (
              <WritingStyleStep
                selectedStyle={formData.writingStyle}
                onUpdate={(writingStyle) => updateFormData({ writingStyle })}
              />
            )}

            {currentStep === 3 && (
              <PDFUploadStep
                pdfs={formData.pdfs}
                onUpdate={(pdfs) => updateFormData({ pdfs })}
              />
            )}
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              onPress={handleBack}
              disabled={currentStep === 1}
              style={[
                styles.button,
                styles.backButton,
                currentStep === 1 && styles.buttonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: currentStep === 1 ? colors.tabIconDefault : colors.text },
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={currentStep === 3 ? handleComplete : handleNext}
              disabled={!canProceed()}
              style={[
                styles.button,
                styles.nextButton,
                { backgroundColor: canProceed() ? colors.tint : colors.tabIconDefault },
              ]}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 3 ? 'Create Course' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 10,
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
  },
  stepLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
  },
  nextButton: {
    flex: 2,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
