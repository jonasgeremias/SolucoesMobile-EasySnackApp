import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, Modal, Text, Image, TouchableHighlight } from "react-native";
import { Icon } from "react-native-elements";
import QRCode from 'react-native-qrcode-svg';
import { NavigationActions, StackActions } from '@react-navigation/native';

function MyModal({ item }) {
  return (
    <View style={styles.centeredView}>
        <View style={styles.QRHeader}>
          <Text style={styles.QRText}>Código do Pedido:</Text>
          <Text style={{textAlign:"center"}}>{item.codPedido}</Text>
        </View>
        <View style={styles.QRContainer}>
          <Text style={styles.QRText}>Utilize o QRCode para retirar seu pedido.</Text>
          <QRCode
            value={item.codPedido ? item.codPedido : "ADD CODIGO PEDIDO"}
            size={300}
            bgColor='black'
            fgColor='white' />
        </View>
    </View>);
}

function Pedido({ item, QRclick }) {
  return (
    <TouchableHighlight underlayColor="#D0D0D0" /*onLongPress={() => alert('click')}*/>
      <View style={styles.item}>
        <View style={styles.itemContainer}>
          <Text style={{ color: "black", fontSize: 18, paddingVertical: 2 }}>Código do Pedido: {item.codPedido}</Text>
          <Text style={{ color: !item.descStatusPedido ? "red" : "green", fontWeight: "bold", fontSize: 18 }}>Status: {item.descStatusPedido}</Text>
          <Text style={{ color: "blue", fontSize: 18, paddingVertical: 2 }}>Total: R$ {item.total}</Text>
        </View>
        <TouchableHighlight style={styles.itemQRCodeContainer} underlayColor="#D0D0D0" onPress={QRclick }>
          <Icon
            name='qrcode'
            type='font-awesome'
            color='black'
            size={80}
          />
        </TouchableHighlight>
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

export default function PedidosScreen({ navigation }) {
  // Componentes Visuais
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemModal, setModal] = useState();

  // Variaveis da aplicação
  const [company, setCompany] = useState([]);
  const [pedidos, setPedidos] = useState({});

  // Carrega os itens na inicialização da tela
  const carregaItemsApi = () => {
    // Inicia a lista de itens vazia
    const getPedidos = require("../assets/pedidos.json");
    const getCompany = require("../assets/company-1.json");
    setCompany(getCompany);
    setPedidos(getPedidos);
    setLoading(false);
  };

  useEffect(() => {
    carregaItemsApi();
  }, []);

  // Função que gera a chave de código unica
  // para o mesmo produto nao repetir duas vezes no carrinho
  function getCodeKey(itemCod) {
    return `p${itemCod}`;
  }

  // Para envio do pedido via fetch para o servidor e redirecionar para tela de pedidos
  return (
    <View>
      <View>
        {!!loading ? (
          <ActivityIndicator size="large" />
        ) : (
            <View style={{ height: "100%" }}>
              <ScrollView style={styles.container}>
                {pedidos.pedidos.map(item => {
                  
                  // Se tem na lista mas a quantidade está zerada
                  return (
                    <Pedido
                      key={item.codPedido}
                      item={item}
                      QRclick = {()=> {
                        setModal({item});
                        setModalVisible(true);
                    }}
                    // codPedido={item.codPedido}
                    // total={item.total}
                    // companyCod={item.companyCod}
                    // descStatusPedido={item.descStatusPedido}
                    // dataPedido={item.dataPedido}
                    />
                  );

                })}
              </ScrollView>


              {/* Meu modal para mostrar o status da operação */}
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false)
                }}
              >
                <MyModal item={itemModal}></MyModal>
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
    flex: 0.7,
    marginHorizontal: 5
  },
  itemQRCodeContainer: {
    flex: 0.3,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
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
    height:"100%",
    justifyContent: "center",
    backgroundColor: "white"
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
    flex: 0.85,
    alignItems: "center",
    justifyContent: "center",
  },
  QRHeader: {
    paddingVertical: 15,
    flex: 0.15,
    flexDirection:"column"
  },
  QRText: {
    fontSize: 28,
    color: "#555",
    marginBottom: 32,
    marginHorizontal: 15,
    textAlign: "center",
    fontWeight: "bold",
  }
});