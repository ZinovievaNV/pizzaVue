import pizza from "@/static/pizza.json";
import * as actions from "@/store/modules/builder/actions";
import mutations from "@/store/modules/builder/mutations";
import getters from "@/store/modules/builder/getters";

const ingredients = pizza.ingredients.map((item) => ({
  ...item,
  amount: 0,
}));

export default {
  namespaced: true,
  state: {
    pizzaData: pizza,
    doughList: pizza.dough,
    ingredients: ingredients,
    sauces: pizza.sauces,
    sizes: pizza.sizes,
    pizzaName: "",
    sizeID: pizza.sizes[0].id,
    doughID: pizza.dough[0].id,
    saucesID: pizza.sauces[0].id,
    pizzaPrice: 0,
  },
  actions,
  mutations,
  getters,
};