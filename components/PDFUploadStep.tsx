import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useColorScheme } from './useColorScheme';
import Colors from '@/constants/Colors';
import { PDFFile } from '@/types/course';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';

interface PDFUploadStepProps {
  pdfs: PDFFile[];
  onUpdate: (pdfs: PDFFile[]) => void;
}

export default function PDFUploadStep({ pdfs, onUpdate }: PDFUploadStepProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const newPdfs: PDFFile[] = result.assets.map((asset) => ({
          id: `${Date.now()}-${Math.random()}`,
          name: asset.name,
          size: asset.size || 0,
          uri: asset.uri,
          type: asset.mimeType || 'application/pdf',
        }));

        const combinedPdfs = [...pdfs, ...newPdfs];

        // Limit to 20 PDFs
        if (combinedPdfs.length > 20) {
          Alert.alert(
            'Too Many Files',
            'You can only upload up to 20 PDFs per course. Please remove some files first.',
            [{ text: 'OK' }]
          );
          return;
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onUpdate(combinedPdfs);
      }
    } catch (error) {
      console.error('Error picking documents:', error);
      Alert.alert('Error', 'Failed to pick documents. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleRemovePdf = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedPdfs = pdfs.filter((pdf) => pdf.id !== id);
    onUpdate(updatedPdfs);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderPdfItem = ({ item }: { item: PDFFile }) => (
    <View
      style={[
        styles.pdfItem,
        {
          backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.pdfIcon}>
        <Text style={styles.pdfIconText}>📄</Text>
      </View>
      <View style={styles.pdfInfo}>
        <Text style={[styles.pdfName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.pdfSize, { color: colors.tabIconDefault }]}>
          {formatFileSize(item.size)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemovePdf(item.id)}
        style={styles.removeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={[styles.removeButtonText, { color: '#ff4444' }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Add Course Materials</Text>
      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
        Upload up to 20 PDFs for this course
      </Text>

      <TouchableOpacity
        style={[
          styles.uploadButton,
          {
            backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5',
            borderColor: colors.tint,
          },
        ]}
        onPress={handlePickDocuments}
        activeOpacity={0.7}
      >
        <Text style={styles.uploadIcon}>📁</Text>
        <Text style={[styles.uploadButtonText, { color: colors.tint }]}>
          {pdfs.length === 0 ? 'Select PDFs' : 'Add More PDFs'}
        </Text>
        <Text style={[styles.uploadButtonSubtext, { color: colors.tabIconDefault }]}>
          Tap to browse files
        </Text>
      </TouchableOpacity>

      {pdfs.length > 0 && (
        <View style={styles.pdfListContainer}>
          <View style={styles.pdfListHeader}>
            <Text style={[styles.pdfListTitle, { color: colors.text }]}>
              Selected Files ({pdfs.length}/20)
            </Text>
          </View>

          <FlatList
            data={pdfs}
            renderItem={renderPdfItem}
            keyExtractor={(item) => item.id}
            style={styles.pdfList}
            contentContainerStyle={styles.pdfListContent}
            scrollEnabled={false}
          />
        </View>
      )}

      {pdfs.length === 0 && (
        <View style={styles.tipContainer}>
          <Text style={[styles.tipText, { color: colors.tabIconDefault }]}>
            💡 Tip: Make sure all your course materials are in PDF format before uploading
          </Text>
        </View>
      )}

      {pdfs.length > 0 && pdfs.length < 20 && (
        <View style={styles.tipContainer}>
          <Text style={[styles.tipText, { color: colors.tabIconDefault }]}>
            ✅ Looking good! You can add {20 - pdfs.length} more PDF{pdfs.length === 19 ? '' : 's'}{' '}
            if needed
          </Text>
        </View>
      )}

      {pdfs.length === 20 && (
        <View style={[styles.tipContainer, { backgroundColor: 'rgba(255, 193, 7, 0.1)' }]}>
          <Text style={[styles.tipText, { color: colors.tabIconDefault }]}>
            ⚠️ You've reached the maximum of 20 PDFs per course
          </Text>
        </View>
      )}
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
    marginBottom: 24,
  },
  uploadButton: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    fontSize: 14,
  },
  pdfListContainer: {
    marginTop: 24,
  },
  pdfListHeader: {
    marginBottom: 12,
  },
  pdfListTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  pdfList: {
    maxHeight: 300,
  },
  pdfListContent: {
    gap: 8,
  },
  pdfItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  pdfIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pdfIconText: {
    fontSize: 24,
  },
  pdfInfo: {
    flex: 1,
  },
  pdfName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  pdfSize: {
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: '300',
  },
  tipContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(47, 149, 220, 0.1)',
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
