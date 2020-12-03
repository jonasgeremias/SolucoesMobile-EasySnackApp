import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, Modal, Text, Image, TouchableHighlight } from "react-native";
import { Icon } from "react-native-elements";
import QRCode from 'react-native-qrcode-svg';
import { NavigationActions, StackActions  } from '@react-navigation/native';

function MyModal({ status }) {
  if (status == 0) {
    return (
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ActivityIndicator size={50} color="#4caf50" />
          <Text style={styles.modalText}>O pedido ja é quase seu!</Text>
        </View>
      </View>);
  }
  else if (status == 1) {
    return (
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Icon name="check-circle" size={50} type='font-awesome' color="#4caf50" />
          <Text style={styles.modalText}>Pedido finalizado com sucesso!</Text>
        </View>
      </View>);
  }
}

function Produto({ cod, name, price, photo, qtd }) {
  return (
    <TouchableHighlight underlayColor="#D0D0D0" /*onLongPress={() => alert('click')}*/>
      <View style={styles.item}>
        {!!photo && <Image source={photo} style={styles.itemPhoto} />}
        <View style={styles.itemContainer}>
          <Text style={styles.itemTitulo}>{name}</Text>
        </View>
        <View style={styles.itemContainer}>
          <Text>Código: {cod}</Text>
          <Text>Quantidade: {qtd}</Text>
          <Text style={{ color: "red", fontSize: 18, paddingVertical: 2 }}>R$ {String(price.toFixed(2)).replace('.', ',')}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

function Footer({ totalPrice, btnOnPress }) {
  return (
    <View style={styles.footer}>
      <View style={{ flex: 0.40 }}>
        <Text style={{ fontSize: 15, color: "#bbb" }}>Total:</Text>
        <Text style={{ fontSize: 24, color: "#555", fontWeight: "bold" }}>R$ {totalPrice}</Text>
      </View>
      <View style={{ flex: 0.60 }}>
        <TouchableHighlight
          underlayColor="#7C192F"
          style={styles.btnFinalizar}
          onPress={btnOnPress}
          key="btnEnd"
        >
          <View style={styles.btnContainer}>
            <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "bold", marginLeft: 15 }}>COFIRMAR PEDIDO</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  )
}

export default function ConfirmarPedidoScreen({ route, navigation }) {
  const { companyCod, fantasyName, routeCart } = route.params;
  // Componentes Visuais
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusPedido, setStatusPedido] = useState(0); // Usado para sinalizar o modal
  // Variaveis da aplicação
  const [company, setItems] = useState([]);
  const [cart, setCart] = useState({});
  const [totalPriceCart, setTotalPriceCart] = useState(0);
  const [numeroPedido, setNumeroPedido] = useState("");

  // Carrega os itens na inicialização da tela
  const carregaItemsApi = () => {
    // Inicia a lista de itens vazia
    const getCompany = require("../assets/company-1.json");
    setItems(getCompany);
    setCart(routeCart);
    setLoading(false);
  };

  // Calcula o preço total do carrinho
  function calcTotalPrice() {
    var price = 0;
    for (var param in cart) {
      price += cart[param].qtd * cart[param].price;
    }
    setTotalPriceCart(String(price.toFixed(2)))
  }

  useEffect(() => {
    calcTotalPrice()
  }, [cart]);

  useEffect(() => {
    carregaItemsApi();
  }, []);

  useEffect(() => {
    const checkBack = (e) => {
      if (+statusPedido === 1) {
        e.preventDefault();

        // isolei o interceptador em uma função nomeada
        // assim teremos que remove-lo antes de chamar o popToTop
        // se não fizermos assim o e.preventDefault() iria continuar
        // em loop bloqueando tudo para sempre...
        navigation.removeListener('beforeRemove', checkBack);
        //navigation.popToTop();
        navigation.navigate("Companies");
      }
    };

    return navigation.addListener('beforeRemove', checkBack);
  }, [navigation, statusPedido]);

  // Botão de voltar do celular
  /*useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      
      if (statusPedido == 1) {
        navigation.popToTop()
      }
    })
  }, [navigation]);*/


  // Função que gera a chave de código unica
  // para o mesmo produto nao repetir duas vezes no carrinho
  function getCodeKey(itemCod) {
    return `p${itemCod}`;
  }

  // Para envio do pedido via fetch para o servidor e redirecionar para tela de pedidos
  function sendPedido() {
    setModalVisible(true);

    // Seta tempo para dar ok e mais um tempo para fechar o modal.
    setTimeout(() => {
      setStatusPedido(1);
      setNumeroPedido("CODIGO DO PEDIDO QUE VEM DO SERVIDOR"); // @remind Pendente
      setTimeout(() => { setModalVisible(false); }, 2000);
    }, 2000);
  }

  return (
    <View>
      <View>
        {!!loading ? (
          <ActivityIndicator size="large" />
        ) : (
            <View style={{ height: "100%" }}>

              {statusPedido == 0 ? (
                <ScrollView style={styles.container}>
                  {company.menu.map(item => {
                    // Para cado giro do map nós definimos a codKey do produto atual do giro
                    // para testar se o mesmo já tem uma qtd definida no carrinho
                    const codKey = getCodeKey(item.cod);
                    // Se tem na lista mas a quantidade está zerada
                    if ((codKey in cart) && (cart[codKey].qtd != 0)) {
                      return (
                        <Produto
                          key={item.cod}
                          cod={item.cod}
                          price={item.price}
                          qtd={cart[codKey].qtd}
                          photo={{ uri: item.photo }}
                          name={item.name}
                        />
                      );
                    }
                  })}
                </ScrollView>
              ) : (
                  <View style={styles.container}>
                    <View style={styles.QRContainer}>
                      <Text style={styles.QRText}>Utilize o QRCode para retirar seu pedido.</Text>
                      <QRCode
                        value={numeroPedido ? numeroPedido : "ADD CODIGO PEDIDO"}
                        size={300}
                        bgColor='black'
                        fgColor='white' />
                    </View>
                  </View>
                )}
              {statusPedido == 0 && <Footer totalPrice={totalPriceCart} btnOnPress={() => sendPedido()}></Footer>}
              {statusPedido == 1 &&
                <View style={styles.footer}>
                  <View style={{ flex: 1 }}>
                    <TouchableHighlight
                      underlayColor="#7C192F"
                      style={styles.btnFinalizar}
                      onPress={() => navigation.popToTop()}
                      key="btnEnd"
                    >
                      <View style={styles.btnContainer}>
                        <Icon
                          name='chevron-circle-left'
                          type='font-awesome'
                          color='#fff'
                          size={30}
                        />
                        <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "bold", marginLeft: 15 }}>VOLTAR PARA CANTINAS</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>}

              {/* Meu modal para mostrar o status da operação */}
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  if (statusPedido == 1)
                    setModalVisible(false)
                }}
              >
                <MyModal status={statusPedido}></MyModal>
              </Modal>
            </View>
          )}
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    marginHorizontal: 10
  },
  item: {
    flexDirection: "row",
    paddingHorizontal: 4,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemPhoto: {
    flex: 0.20,
    height: 65,
    marginRight: 12,
    borderRadius: 10,
  },
  itemContainer: {
    flex: 0.40,
    marginHorizontal: 5
  },
  itemTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#777",
  },
  itemIcon: {
    width: 50,
    height: 50,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  textQtd: {
    fontSize: 22,
    color: "#777",
  },
  footer: {
    padding: 10,
    height: "10%",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  btnFinalizar: {
    backgroundColor: "#CF2B4E",
    borderRadius: 50,
    alignContent: 'center',
    alignItems: "center",
  },
  btnContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  modalView: {
    margin: 20,
    backgroundColor: "#CF2B4E",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.40,
    shadowRadius: 5,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  modalText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 22
  },
  QRContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  QRImage: {
    marginVertical: 50,
  },
  QRText: {
    fontSize: 28,
    color: "#555",
    marginVertical: 32,
    marginHorizontal: 15,
    textAlign: "center",
    fontWeight: "bold",
  }
});