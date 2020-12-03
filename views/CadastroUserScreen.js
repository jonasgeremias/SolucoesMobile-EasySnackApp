import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableHighlight } from 'react-native';
import { AsyncStorage } from 'react-native';

const salvarPessoa = async (pessoa) => {
  try {
    const jsonValue = JSON.stringify(pessoa)
    await AsyncStorage.setItem('@pessoa', jsonValue)

    return true;
  } catch (e) {
    // saving error
    console.log(e);
    return false;
  }
}

const getPessoa = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@pessoa')
    if (jsonValue !== null) {
      // se o jsonValue for diferente de null, quer dizer que já havia sido salvo anteriormente.
      return JSON.parse(jsonValue);
    }
  } catch (e) {
    // error reading value
  }
}

const removePessoa = async () => {
  try {
    await AsyncStorage.removeItem('@pessoa')
  } catch (e) {
    // remove error
  }
  console.log('Removido com Sucesso')
}

const EMPTY_PESSOA = {
  usuario: "",
  email: "",
  senha: "",
};

export default function cadastroScreen({ navigation }) {
  const [pessoa, setPessoa] = useState({ ...EMPTY_PESSOA });

  function salvarPessoaForm() {
    console.log(pessoa);
    const ret = salvarPessoa(pessoa);
    if (ret) {
      alert("Usuário cadastrado com sucesso.");
      navigation.navigate("Login");
    }
    else alert("Erro ao cadastrar, tente novamente");
  }

  return (
    //<ImageBackground source={require("./assets/fundo1.png")} style={styles.fundo}>
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text style={styles.txttitle}>Cadastre-se</Text>
        </View>
        <View style={styles.entrar}>
          <TouchableHighlight underlayColor="#D0D0D0" onPress={() => navigation.navigate('Login')}>
            <Text style={styles.txtentrar}>Entrar</Text>
          </TouchableHighlight>
        </View>

      </View>
      <View style={styles.principal}>
        <TextInput value={pessoa.email} onChangeText={email => setPessoa({ ...pessoa, email })} style={styles.form} placeholder='Email' textContentType='emailAddress' />
        <TextInput value={pessoa.usuario} onChangeText={usuario => setPessoa({ ...pessoa, usuario })} style={styles.form} placeholder='Usuário' textContentType='name' />
        <TextInput value={pessoa.senha} onChangeText={senha => setPessoa({ ...pessoa, senha })} style={styles.form} placeholder='senha' textContentType='password' />
        <TouchableHighlight underlayColor="#7C192F" onPress={() => salvarPessoaForm()} style={styles.bt}>
          <Text style={styles.txbt}>Criar Cadastro</Text>
        </TouchableHighlight>
      </View>
      <View>
        <Text style={styles.txtrodape}>Ao criar sua conta, você concorda com os Termos de serviço e Política de privacidade.</Text>
      </View>
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: "row",
  },

  title: {
    //flex: 0.7,
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 0,
  },
  entrar: {
    //flex: 0.3,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  txttitle: {
    fontSize: 30,
    color: '#4D4B50',
    fontWeight: '700',
    paddingTop: 5,
    textAlign: 'center',
    paddingLeft: 0,
  },

  txtentrar: {
    fontSize: 25,
    color: '#9F9EA4',
    fontWeight: '700',
    paddingTop: 5,
    textAlign: 'center',
    paddingLeft: 0,
  },

  principal: {
    width: 380,
    height: 380,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginBottom: 5,

  },

  form: {
    height: 40,
    width: 320,
    padding: 10,
    fontSize: 15,
    color: '#94535F',
    backgroundColor: 'rgb(250, 250, 250)',
    borderColor: '#eee',
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    shadowColor: '#333',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: {    //sombra da borda
      width: 2,
      height: 2,
    }
  },

  bt: {
    width: 320,
    padding: 15,
    backgroundColor: '#CF2B4E',
    marginTop: 35,
    borderRadius: 30,
    alignItems: 'center',
  },
  txbt: {
    fontSize: 20,
    color: '#fff',


  },

  txtrodape: {
    width: 250,
    fontSize: 15,
    color: '#9F9EA4',
    fontWeight: '700',
    alignItems: 'center',
    paddingTop: 5,
    paddingLeft: 10,
    textAlign: 'center',

  },


});

