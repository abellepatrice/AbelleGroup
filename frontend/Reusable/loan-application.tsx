import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import ProtectedRoute from '../src/components/ProtectedRoute';


export default function LoanApplication() {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const router = useRouter();

  const handleApply = async () => {
    if (!amount || !purpose) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:3000/api/loans/apply', {
        amount,
        purpose,
        // You can include user ID if needed, e.g. userId: 1
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Loan application submitted');
        router.push('/dashboard');
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    } catch (error) {
      console.error('Loan Application Error:', error);
      Alert.alert('Error', 'Failed to apply for loan');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Loan Application</Text>
      <TextInput
        placeholder="Loan Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <TextInput
        placeholder="Purpose of Loan"
        value={purpose}
        onChangeText={setPurpose}
        style={styles.input}
      />
      <Button title="Apply" onPress={handleApply} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
});
