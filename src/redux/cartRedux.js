import Axios from 'axios';
import { API_URL } from '../config';
/* selectors */
export const getCart = ({ cart }) => cart;

/* action name creator */
const reducerName = 'cart';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const ADD_TO_CART = createActionName('ADD_TO_CART');
const REMOVE_FROM_CART = createActionName('REMOVE_FROM_CART');
const SEND_ORDER = createActionName('SEND_ORDER');

/* action creators */
export const fetchStarted = payload => ({ payload, type: FETCH_START });
export const fetchSuccess = payload => ({ payload, type: FETCH_SUCCESS });
export const fetchError = payload => ({ payload, type: FETCH_ERROR });
export const addProductToCart = payload => ({ payload, type: ADD_TO_CART });
export const removeProductFromCart = payload => ({ payload, type: REMOVE_FROM_CART });
export const sendOrder = payload => ({ payload, type: SEND_ORDER });

/* thunk creators */
export const saveCartRequest = data => {
  return dispatch => {
    const cartProducts = JSON.parse(localStorage.getItem('cart'));
    if (cartProducts) {
      /* Adding special request to particular car in localstorage */
      if (data[1] === 'request') {
        for (const key in cartProducts) {

          if (Object.prototype.hasOwnProperty.call(cartProducts, key)) {
            const element = cartProducts[key];

            if (element.id === data[2]) {
              element.request = data[0];
              localStorage.setItem('cart', JSON.stringify([...cartProducts]));
              dispatch(addProductToCart([...cartProducts]));
            }
          }
        }
        return;
      }
      /* handling AmountWidget value change*/
      for (const product of cartProducts) {
        if (product.id === data.id) {
          if (data.minus) {
            if (product.amount > 1) {
              product.amount = parseInt(product.amount) - parseInt(data.amount);
              localStorage.setItem('cart', JSON.stringify([...cartProducts]));
              dispatch(addProductToCart([...cartProducts]));
            }
            return;
          }
          if (product.amount < 100) {
            product.amount = parseInt(product.amount) + parseInt(data.amount);

            localStorage.setItem('cart', JSON.stringify([...cartProducts]));
            dispatch(addProductToCart([...cartProducts]));
          }
          return;
        }
      }
      localStorage.setItem('cart', JSON.stringify([...cartProducts, data]));
      dispatch(addProductToCart([...cartProducts, data]));
      /* handling adding first car to local storage */
    } else {

      localStorage.setItem('cart', JSON.stringify([data]));
      dispatch(addProductToCart([data]));
    }
  };
};

export const removeCart = () => {
  return dispatch => {
    localStorage.removeItem('cart');
  };
};

export const removeCartItem = (id) => {

  return dispatch => {
    const cartProducts = JSON.parse(localStorage.getItem('cart'));

    const newCart = [];
    for (const product of cartProducts) {
      if (product.id !== id) {
        newCart.push(product);
      } else {
        dispatch(removeProductFromCart(product));
      }
    }
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(newCart));
    dispatch(addProductToCart(newCart));
    return;
  };
};

export const loadCartRequest = () => {
  return dispatch => {
    let getSavedCart;
    localStorage.getItem('cart') ?
      getSavedCart = JSON.parse(localStorage.getItem('cart')) : getSavedCart = [];
    dispatch(addProductToCart(getSavedCart));
  };
};

export const newOrder = data => {
  return async dispatch => {
    console.log(data);
    dispatch(fetchStarted());
    try {
      let res = await Axios.post(
        `${API_URL}/order`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      dispatch(sendOrder(res.data));
    } catch (e) {
      dispatch(fetchError(e.message));
    }
  };
};

/* reducer */
export const reducer = (statePart = [], action = {}) => {
  switch (action.type) {
    case FETCH_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...statePart,
        products: action.payload ? action.payload : [],
      };
    }
    case FETCH_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    }
    case ADD_TO_CART: {
      return {
        ...statePart,
        products: action.payload,
      };
    }
    case SEND_ORDER: {
      return {
        ...statePart,
        products: [],
      };
    }
    default:
      return statePart;
  }
};