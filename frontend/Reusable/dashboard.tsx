import { View, Text, StyleSheet } from 'react-native';
import ProtectedRoute from '../src/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Dashboard!</Text>
    </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, fontWeight: 'bold' }
});
