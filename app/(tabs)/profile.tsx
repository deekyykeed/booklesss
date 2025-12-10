import { StyleSheet, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Themed';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft02Icon, UserIcon, Mail01Icon, CallIcon } from '@hugeicons/core-free-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <HugeiconsIcon icon={ArrowLeft02Icon} size={20} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 42 }} />
        </View>

        {/* Profile Picture */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage} />
            <View style={styles.profileOverlay} />
          </View>
          <Text style={styles.profileName}>Aimal Naseem</Text>
          <Text style={styles.profileRole}>Senior Designer</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.inputContainer}>
              <HugeiconsIcon icon={UserIcon} size={22} color="#A2A2A7" strokeWidth={1.3} />
              <TextInput
                style={styles.input}
                value="Aimal Naseem"
                placeholderTextColor="#A2A2A7"
              />
            </View>
            <View style={styles.separator} />
          </View>

          {/* Email Address */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <HugeiconsIcon icon={Mail01Icon} size={22} color="#A2A2A7" strokeWidth={1.3} />
              <TextInput
                style={[styles.input, styles.lowercaseInput]}
                value="Aimalnaseem@gmail.com"
                placeholderTextColor="#A2A2A7"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.separator} />
          </View>

          {/* Phone Number */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <HugeiconsIcon icon={CallIcon} size={22} color="#A2A2A7" strokeWidth={1.3} />
              <TextInput
                style={[styles.input, styles.lowercaseInput]}
                value="+000 00 00 000"
                placeholderTextColor="#A2A2A7"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.separator} />
          </View>

          {/* Birth Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.birthDateLabel}>Birth Date</Text>
            <View style={styles.birthDateContainer}>
              <View style={styles.birthDateField}>
                <TextInput
                  style={styles.birthDateInput}
                  value="28"
                  placeholderTextColor="#A2A2A7"
                  keyboardType="numeric"
                  maxLength={2}
                />
                <View style={styles.birthDateSeparator} />
              </View>
              <View style={styles.birthDateField}>
                <TextInput
                  style={styles.birthDateInput}
                  value="September"
                  placeholderTextColor="#A2A2A7"
                />
                <View style={styles.birthDateSeparator} />
              </View>
              <View style={styles.birthDateField}>
                <TextInput
                  style={styles.birthDateInput}
                  value="2000"
                  placeholderTextColor="#A2A2A7"
                  keyboardType="numeric"
                  maxLength={4}
                />
                <View style={styles.birthDateSeparator} />
              </View>
            </View>
          </View>
        </View>

        {/* Joined Date */}
        <Text style={styles.joinedText}>Joined 28 Jan 2021</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    backgroundColor: '#1E1E2D',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 18,
    lineHeight: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
  },
  profileImageContainer: {
    width: 90,
    height: 90,
    position: 'relative',
    marginBottom: 24,
  },
  profileImage: {
    width: 90,
    height: 90,
    backgroundColor: '#1E1E2D',
    borderRadius: 45,
  },
  profileOverlay: {
    position: 'absolute',
    width: 90,
    height: 90,
    backgroundColor: '#161622',
    opacity: 0.12,
    borderRadius: 45,
  },
  profileName: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 17,
    letterSpacing: -0.51,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  profileRole: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 12,
    color: '#7E848D',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 22,
  },
  fieldLabel: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 14,
    color: '#A2A2A7',
    marginBottom: 16,
  },
  birthDateLabel: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 14,
    color: '#7E848D',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 14,
    color: '#FFFFFF',
    padding: 0,
  },
  lowercaseInput: {
    textTransform: 'lowercase',
  },
  separator: {
    height: 1,
    backgroundColor: '#232533',
    marginTop: 16,
  },
  birthDateContainer: {
    flexDirection: 'row',
    gap: 21,
  },
  birthDateField: {
    flex: 1,
  },
  birthDateInput: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 14,
    color: '#FFFFFF',
    textTransform: 'capitalize',
    padding: 0,
  },
  birthDateSeparator: {
    height: 1,
    backgroundColor: '#232533',
    marginTop: 10,
  },
  joinedText: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 12,
    color: '#A2A2A7',
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 100,
  },
});
