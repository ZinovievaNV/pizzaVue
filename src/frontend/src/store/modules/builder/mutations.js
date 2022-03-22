import {
  GET_TOTAL_PRICE,
  SET_PIZZA_NAME,
  GET_SIZE_ID,
  GET_DOUGH_ID,
  GET_SAUCES_ID,
  ON_REDUCE,
  ON_INCREASE,
  RESET_STATE,
  SET_INGREDIENTS,
} from "@/store/mutation-types";

export default {
  [SET_PIZZA_NAME](state, value) {
    state.pizzaName = value;
  },
  [GET_TOTAL_PRICE](state, pizzaPrice) {
    state.pizzaPrice = pizzaPrice;
  },
  [GET_SIZE_ID](state, id) {
    state.sizeID = id;
  },
  [GET_DOUGH_ID](state, id) {
    state.doughID = id;
  },
  [GET_SAUCES_ID](state, id) {
    state.saucesID = id;
  },
  [ON_REDUCE](state, id) {
    const findIngredient = state.ingredients.find(
      (ingredient) => ingredient.id === id
    );
    if (findIngredient) {
      --findIngredient.amount;
    }
  },
  [ON_INCREASE](state, id) {
    const findIngredient = state.ingredients.find(
      (ingredient) => ingredient.id === id
    );
    if (findIngredient) {
      ++findIngredient.amount;
    }
  },
  [RESET_STATE](state) {
    const ingredients = state.pizzaData.ingredients.map((item) => ({
      ...item,
      amount: 0,
    }));

    state.doughList = state.pizzaData.dough;
    state.ingredients = ingredients;
    state.sauces = state.pizzaData.sauces;
    state.sizes = state.pizzaData.sizes;
    state.pizzaName = "";
    state.sizeID = state.pizzaData.sizes[0].id;
    state.doughID = state.pizzaData.dough[0].id;
    state.saucesID = state.pizzaData.sauces[0].id;
    state.pizzaPrice = 0;
  },
  [SET_INGREDIENTS](state, ingredients) {
    state.ingredients = ingredients;
  },
};