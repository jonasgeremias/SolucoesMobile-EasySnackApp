import React, {Component} from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Icon } from "react-native-elements"

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Telas do aplicativo
import CardapioScreen from "./views/CardapioScreen";
import ConfirmarPedidoScreen from "./views/ConfirmarPedidoScreen";
import CompaniesScreen from "./views/CompaniesScreen";
import PedidosScreen from "./views/PedidosScreen";
import CadastroUserScreen from "./views/CadastroUserScreen";
import LoginScreen from "./views/LoginScreen";

const Stack = createStackNavigator();

class MeuHeader extends Component {
  render() {
    var { nav, companies, pedidos } = this.props;
    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableHighlight  /*activeOpacity={0.1}*/ underlayColor='transparent' style={styles.btnContainer} onPress={() => { nav.navigate("Companies") }}>
          <View>
            <Icon
              name='home'
              type='font-awesome'
              color={companies ? "#ccc" : "#fff"}
              size={30}
            />
            <Text style={{ fontSize: 12, color: companies ? "#ccc" : "#fff", fontWeight: "bold" }}>Home</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight activeOpacity={pedidos ? 1 : 0.4} underlayColor='transparent' style={styles.btnContainer} onPress={() => { nav.navigate("Pedidos") }}>
          <View>
            <Icon
              name='list-alt'
              type='font-awesome'
              color={pedidos ? "#ccc" : "#fff"}
              size={30}
            />
            <Text style={{ fontSize: 12, color: pedidos ? "#ccc" : "#fff", fontWeight: "bold" }}>Meus Pedidos</Text>
          </View>
        </TouchableHighlight>
      </View>
    )}
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#CF2B4E",
          },
          headerTintColor: "#fff"
        }}>

        <Stack.Screen name="Login"
          component={LoginScreen}
          options={({ navigation }) => ({
            title: "Entrar",
            headerRight: () => (<MeuHeader nav={navigation} />)
          })} />

        <Stack.Screen name="CadastrarUsuario"
          component={CadastroUserScreen}
          options={({ navigation }) => ({
            title: "Cadastrar",
            headerRight: () => (<MeuHeader nav={navigation} />)
          })} />

        <Stack.Screen name="Cardapio"
          component={CardapioScreen}
          options={({ navigation }) => ({
            title: "Cardápio",
            headerRight: () => (<MeuHeader nav={navigation} />)
          })} />

        <Stack.Screen name="ConfirmarPedido"
          component={ConfirmarPedidoScreen}
          options={({ navigation }) => ({
            title: "Confimar",
            headerRight: () => (<MeuHeader nav={navigation} />)
          })} />

        <Stack.Screen name="Companies"
          component={CompaniesScreen}
          options={({ navigation }) => ({
            title: "Cantinas",
            headerRight: () => (<MeuHeader nav={navigation} companies />)
          })} />

        <Stack.Screen name="Pedidos"
          component={PedidosScreen}
          options={({ navigation }) => ({
            title: "Pedidos",
            headerRight: () => (<MeuHeader nav={navigation} pedidos />)
          })} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  btnContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: 'space-between',
    margin: 10
  }
});