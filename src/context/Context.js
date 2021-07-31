import { createContext, useReducer, useContext, useEffect } from "react";
import faker from 'faker'
import { cartReducer, productReducer } from "./Reducers";

const products = [...Array(20)].map(() => ({
  id: faker.datatype.uuid(),
  name: faker.commerce.productName(),
  price: faker.commerce.price(),
  image: faker.random.image(),
  inStock: faker.random.arrayElement([0, 3, 5, 6, 7]),
  fastDelivery: faker.datatype.boolean(),
  ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
}))

// initial state
const initialState = {
  cart: localStorage.getItem("cart") ? JSON.parse(localStorage.getItem('cart')) : [],
  products: localStorage.getItem("products") ? JSON.parse(localStorage.getItem('products')) : products,
}

const initialFilterState = {
  byStock: localStorage.getItem("stock") ? JSON.parse(localStorage.getItem('stock')) : false,
  byFastDelivery: localStorage.getItem("delivery") ? JSON.parse(localStorage.getItem('delivery')) : false,
  byRating: localStorage.getItem("rating") ? JSON.parse(localStorage.getItem('rating')) : 0,
  searchQuery: localStorage.getItem("userQuery") ? JSON.parse(localStorage.getItem('userQuery')) : '',
}

const Cart = createContext(initialState)
faker.seed(99)

const Context = ({ children }) => {

  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [productState, productDispatch] = useReducer(productReducer, initialFilterState)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart))
    localStorage.setItem('products', JSON.stringify(state.products))
    localStorage.setItem('stock', JSON.stringify(productState.byStock))
    localStorage.setItem('delivery', JSON.stringify(productState.byFastDelivery))
    localStorage.setItem('rating', JSON.stringify(productState.byRating))
    localStorage.setItem('userQuery', JSON.stringify(productState.searchQuery))
  }, [state, productState]);

  return (
    <Cart.Provider value={{ state, dispatch, productState, productDispatch }}>
      { children }
    </Cart.Provider>
  )
}

export default Context

export const CartState = () => useContext(Cart)
