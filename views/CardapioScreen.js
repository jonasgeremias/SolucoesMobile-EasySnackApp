import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, Text, Image, TouchableHighlight } from "react-native";
import { Icon } from "react-native-elements";

//import {AsyncStorage} from "@react-native-async-storage/async-storage";


// Banco de dados AsyncStorage
const getPedidos = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("@pedidos");
    if (jsonValue !== null) {
      // se o jsonValue for diferente de null, quer dizer que já havia sido salvo anteriormente.
      return JSON.parse(jsonValue);
    }
  } catch (e) {
    // error reading value
    return []
  }
};

const savePedidos = async pedidos => {
  try {
    //await AsyncStorage.setItem("@pedidos", JSON.stringify(pedidos));
    return true;
  } catch (e) {
    // tratar erros
    return false;
  }
}

const addPedido = async pedido => {
  // Leitura dos pedidos salvos
  var pedidos = getPedidos()
  console.log(pedido)
  alert(pedido)
  try {
    const atualizadoPedidos = { ...pedidos, pedido };
    const jsonValue = JSON.stringify(atualizadoPedidos);
    // await AsyncStorage.setItem("@pedidos", jsonValue);
  } catch (e) {
    // saving error
  }
};


function Header({ fantasyName }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 0.35 }}>
        <Text style={styles.headerTitle}>Cardápio</Text>
      </View>
      <View style={{ flex: 0.65 }}>
        <Text style={styles.headerName}>{fantasyName}</Text>
      </View>
    </View>
  )
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
            <Text style={{ fontSize: 18, color: "#FFF", fontWeight: "bold", marginLeft: 15 }}>FINALIZAR</Text>
            <Icon
              name='chevron-circle-right'
              type='font-awesome'
              color='#fff'
              size={30}
            />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  )
}

function Produto({ cod, name, description, price, photo, qtd, onPressAdd, onPressRemove }) {
  return (
    <TouchableHighlight underlayColor="#D0D0D0" /*onLongPress={() => alert('click')}*/>
      <View style={styles.item}>
        {!!photo && <Image source={photo} style={styles.itemPhoto} />}

        <View style={styles.itemContainer}>
          <Text style={styles.itemTitulo}>{name}</Text>
          <Text>Código: {cod}</Text>
          {!!description && <Text style={styles.description}>Descrição: {description}</Text>}
          <Text style={{ color: "red", fontSize: 18, paddingVertical: 4 }}>R$ {String(price.toFixed(2)).replace('.', ',')}</Text>

          <View style={{ flexDirection: "row" }}>
            <View style={styles.itemIcon}>
              <Icon name="minus-circle" type='font-awesome' size={30} color="#bbb" onPress={onPressRemove} />
            </View>
            <View style={styles.itemIcon}>
              <Text style={styles.textQtd}>{qtd}</Text>
            </View>
            <View style={styles.itemIcon}>
              <Icon name="plus-circle" size={30} type='font-awesome' color="#bbb" onPress={onPressAdd} />
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

export default function CardapioScreen({ route, navigation }) {
  const { companyCod, fantasyName, routeCart } = route.params; // recebe o codigo para requisitar o json correto do servidor
  const [loading, setLoading] = useState(true); // Enquanto nao recebe a resposta, @audit criar um erro de sem internet.
  const [company, setItems] = useState([]); // json recebido e armazenado nesta variável, nesta tem as informações da compania e dos itens.
  const [cart, setCart] = useState({}); // Ao adicionar a quantidade do item na tela, ele vem para o carrinho
  const [totalPriceCart, setTotalPriceCart] = useState(0); // Sempre que o carrinho é atualizado, o total é atualizado junto e colocado nesta variável

  // Função que gera a chave de código unica
  // para o mesmo produto nao repetir duas vezes no carrinho
  function getCodeKey(itemCod) {
    return `p${itemCod}`;
  }

  // Adiciona itens ao carrinho
  function addItemCart(itemCod, itemPrice) {
    const totalEstimado = parseFloat(totalPriceCart) + parseFloat(itemPrice);
    if (totalEstimado > 9999) return; // Só pra limitar o carrinho

    // Cria a chave em string para o código do produto
    const codKey = getCodeKey(itemCod);

    // Se existir, atualiza.
    if (codKey in cart) {
      const cartItem = cart[codKey];

      const atualizadoItem = { ...cartItem, qtd: Math.min(cartItem.qtd + 1, 99), price: itemPrice };

      // Sempre que usamos o spread (...xxxx) estamos
      // herdando o conteúdo prévio em um novo objeto
      setCart({ ...cart, [codKey]: atualizadoItem });
    } else {
      // Se não existir cria um novo sem precisar
      // Incrementar a qtd
      const novoItem = {
        cod: itemCod,
        qtd: 1,
        price: itemPrice,
      };

      setCart({ ...cart, [codKey]: novoItem });
    }
  }

  // Remove itens do carrinho
  function removeItemCart(itemCod, itemPrice) {
    const codKey = getCodeKey(itemCod);
    if (codKey in cart) {
      const cartItem = cart[codKey];
      const atualizadoItem = { ...cartItem, qtd: Math.max(cartItem.qtd - 1, 0), price: itemPrice, };
      setCart({ ...cart, [codKey]: atualizadoItem });
    }
  }


  // Função inicial para carregar os dados
  const carregaItemsApi = () => {
    // @remind Deve ser analisado as variaveis { companyCod, fantasyName } e realisar um featch pra buscar na API no servidor.
    // Neste caso o carrinho será sempre igual para as cantinas.
    const getCompany = require("../assets/company-1.json");
    setItems(getCompany); // Salva o json da cantina.
    
    if (routeCart != null) setCart(routeCart); // Se tem carrinho pra resgatar
    else setCart({}); // Inicia a lista de itens vazia
    
    setLoading(false);
  };


  // calcula o preço total
  function calcTotalPrice() {
    var price = 0;

    for (var param in cart) {
      price += cart[param].qtd * cart[param].price;
    }

    setTotalPriceCart(String(price.toFixed(2)))
  }


  // Envia as informações para a tela de confirmar pedido
  function sendPedido() {
    if (totalPriceCart == 0) alert("Selecione pelo menos um item.")
    else {
      navigation.navigate("ConfirmarPedido", {companyCod, fantasyName, routeCart:cart })
    }
  }

  // Use Effects para atualizar as variaveis 
  useEffect(() => {
    // console.log(cart)
    calcTotalPrice()
  }, [cart]);

  useEffect(() => {
    carregaItemsApi();
  }, []);

  return (
    <View>
      <View>
        {!!loading ? (
          <ActivityIndicator size="large" />
        ) : (
            <View style={{ height: "100%" }}>
              <Header fantasyName={fantasyName}></Header>
              <ScrollView style={styles.container}>
                {company.menu.map(item => {
                  // Para cado giro do map nós definimos a codKey do produto atual do giro
                  // para testar se o mesmo já tem uma qtd definida no carrinho
                  const codKey = getCodeKey(item.cod);
                  return (
                    <Produto
                      key={item.cod}
                      cod={item.cod}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      photo={{ uri: item.photo }}
                      qtd={codKey in cart ? cart[codKey].qtd : 0}
                      onPressAdd={() => addItemCart(item.cod, item.price)}
                      onPressRemove={() => removeItemCart(item.cod, item.price)}
                    />
                  );
                })}
              </ScrollView>
              <Footer totalPrice={totalPriceCart} btnOnPress={() => sendPedido()}></Footer>
            </View>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    height: "80%",
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
    flex: 0.35,
    height: 120,
    marginRight: 12,
    borderRadius: 25,
  },
  itemContainer: {
    flex: 0.65,
    marginLeft: 10,
  },
  itemDescription: {
    textAlign: "justify",
    flexWrap: "wrap",
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#777",
    marginBottom: 4,
  },
  itemIcon: {
    width: 60,
    height: 30,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  textQtd: {
    fontSize: 30,
    color: "#777",
  },
  header: {
    flex: 0.1,
    height: "20%",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 30,
    color: "#555",
    fontWeight: "bold",
  },
  headerName: {
    textAlign: "center",
    fontSize: 30,
    color: "#bbb",
    fontWeight: "bold",
  },
  footer: {
    flex: 0.1,
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
  }
});