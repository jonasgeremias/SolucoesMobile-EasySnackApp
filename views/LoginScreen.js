import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Platform, Alert, ImageBackground } from 'react-native';
import { AsyncStorage } from 'react-native';

 
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

const EMPTY_PESSOA = {
  usuario: "",
  email: "",
  senha: "",
};

export default function LoginScreen({ navigation }) {

  const [pessoa, setPessoa] = useState({ ...EMPTY_PESSOA });

  function testLogin() {
    getPessoa().then(pessoaRecup => {
      console.log(pessoaRecup);

      if ((pessoaRecup.email == pessoa.email) && (pessoaRecup.senha == pessoa.senha)) {
        navigation.navigate("Companies");
        alert("Seja bem vindo" + String(pessoa.usuario));
      }
      else {
        alert("Usuário inválido.");
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.title}>
          <Text style={styles.txttitle}>Entrar</Text>
        </View>
        <View style={styles.entrar}>
          <TouchableHighlight underlayColor="#D0D0D0" onPress={()=>navigation.navigate('CadastrarUsuario')}>
            <Text style={styles.txtentrar}>Cadastre-se</Text>
          </TouchableHighlight>
          
        </View>

      </View>
      <View style={styles.principal}>
        <TextInput value={pessoa.email} onChangeText={email => setPessoa({ ...pessoa, email })} style={styles.form} placeholder='Email' textContentType='emailAddress' />
        <TextInput value={pessoa.senha} onChangeText={senha => setPessoa({ ...pessoa, senha })} style={styles.form} placeholder='senha' textContentType='password' />
        <TouchableHighlight underlayColor="#7C192F" onPress={() => {testLogin()}} style={styles.bt}>
          <Text style={styles.txbt}>Entrar</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"column",
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: "row",
    marginHorizontal: 15,
    
  },

  title: {
    flex: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal:10,
  },
  entrar: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txttitle: {
    fontSize: 30,
    color: '#4D4B50',
    fontWeight: '700',
    textAlign: 'center',
  },

  txtentrar: {
    fontSize: 25,
    color: '#9F9EA4',
    fontWeight: '700',
    textAlign: 'center',
  },

  principal: {
    width: 380,
    height: 380,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
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
    textAlign: 'center',
  },
});

