import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Escolha o estabelecimento</Text>
      <View style={{ margin: 9 }}>
        <Button title="Cardápio" onPress={() => navigation.navigate("Cardapio", { companyCod: 1, companyName: "Restalrante" })} />
      
      
      
      
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});
