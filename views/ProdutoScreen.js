import React from "react";
import { StyleSheet, TouchableHighlight, Image, View, Text, Button } from "react-native";

function Produto({ title, codigo, poster, onPress }) {
  return (
    <TouchableHighlight underlayColor="#D0D0D0" onPress={onPress}>
      <View style={styles.filme}>
        {!!poster && <Image source={poster} style={styles.filmePoster} />}
        <View>
          <Text style={styles.filmeTitulo}>{title}</Text>
          <Text>{codigo}</Text>
        </View>
        <View>
        <Button
          icon={{
            name: "arrow-right",
            size: 15,
            color: "black"
          }}
          title="Button with icon object"
          />
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default function ProdutoScreen({ route, navigation }) {
  const { codigo, name } = route.params;

  return (
    <View style={styles.container}>
      <Text>
        Estamos visualizando o produto {codigo} - {name}
      </Text>
      <Produto title={name} codigo={codigo} poster={require("./img/mouse.jpg")} onPress={() => {}} />
      <View style={{ margin: 9 }}>
        <Button title="Quero Comprar" onPress={() => navigation.navigate("Contato")} />
      </View>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1},
  filme: {
    flexDirection: "row",
    padding: 9,
    borderBottomWidth: 1,
    borderBottomColor: "orange",
  },
  filmePoster: {
    width: 160,
    height: 180,
    marginRight: 12,
  },
  filmeTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});
