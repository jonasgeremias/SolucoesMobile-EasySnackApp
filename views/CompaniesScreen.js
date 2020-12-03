import React, { useState, useEffect } from "react";
import { StyleSheet, Alert,View, ScrollView, ActivityIndicator, Text, Image, TouchableHighlight } from "react-native";


function Company({ photo, Press, LongPress }) {
  return (
    <TouchableHighlight
      underlayColor="#D0D0D0"
      onLongPress={LongPress}
      onPress={Press}
      style={{ flex: 1 }}
    >
    <View>
    {!!photo && <Image source={photo} style={styles.itemIcon} />}
    </View>
    </TouchableHighlight>
  );
}


export default function CompaniesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);

  const carregaItemsApi = () => {
    const getCompanies = require("../assets/companies.json");
    setCompanies(getCompanies.companies);
    setLoading(false);
  };

  useEffect(() => {
    carregaItemsApi();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        {!!loading ? (
          <ActivityIndicator size="large" />
        ) : (
            <View>
              <View style={styles.header}>
                <View style={{ flex: 1, marginVertical: 10 }}>
                  <Text style={styles.headerTitle}>Selecione a Cantina</Text>
                </View>
              </View>
              <View>
                {companies.map(item => {
                  return (
                    <Company
                      cod={item.cod}
                      key={item.cod}
                      photo={{uri: item.icon}}

                      LongPress={() => {
                        Alert.alert(
                          "Detalhes da cantina",
                          `Código: ${item.cod}\r\nNome: ${item.companyName}`,
                          [
                            {
                              text: "Sair",
                              style: "Ok"
                            },
                            //{ text: "OK", onPress: () => onRemoveUsuario(usuario.id) },
                          ],
                          { cancelable: false }
                        );
                      }}

                      Press={() => navigation.navigate("Cardapio", { companyCod: item.cod, fantasyName: item.fantasyName})}
                    />
                  );
                })}
              </View>

            </View>
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    margin: 10
  },
  header: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 30,
    color: "#555",
    fontWeight: "bold",
  },
  itemCompany: {
    flexDirection: "row",
    margin: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
    height: 120,
    flex:1,
    backgroundColor: '#fff',
  },
  itemIcon: {
    width: "auto",
    height: 120,
    margin: 12,
    borderRadius: 25,
    borderColor: "#555",
    borderWidth:1
  }
});
