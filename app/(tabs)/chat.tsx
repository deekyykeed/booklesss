import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      {/* Content will go here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f8f7f6',
    overflow: 'visible',
    padding: 0,
    alignContent: 'center',
    flexWrap: 'nowrap',
    gap: 0,
  },
});
