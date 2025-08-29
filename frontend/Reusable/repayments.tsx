import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function Repayments() {
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState('');

  const handleRepayment = () => {
    console.log('Repayment submitted:', loanId, amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Repay Loan</Text>
      <TextInput placeholder="Loan ID" value={loanId} onChangeText={setLoanId} style={styles.input} />
      <TextInput placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} style={styles.input} />
      <Button title="Repay" onPress={handleRepayment} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});
