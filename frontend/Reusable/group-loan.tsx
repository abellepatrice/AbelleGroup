import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';

export default function GroupLoans() {
  const [groupName, setGroupName] = useState('');
  const [amount, setAmount] = useState('');

  const handleGroupLoan = () => {
    console.log('Group loan applied:', groupName, amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Group Loan Application</Text>
      <TextInput placeholder="Group Name" value={groupName} onChangeText={setGroupName} style={styles.input} />
      <TextInput placeholder="Amount" keyboardType="numeric" value={amount} onChangeText={setAmount} style={styles.input} />
      <Button title="Submit" onPress={handleGroupLoan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});
