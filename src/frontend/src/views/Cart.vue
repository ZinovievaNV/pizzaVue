<template>
  <div>
    <form
      action="test.html"
      method="post"
      class="layout-form"
      @submit.prevent="submitOrder"
    >
      <main class="content cart">
        <div class="container">
          <div class="cart__title">
            <h1 class="title title--big">Корзина</h1>
          </div>
          <div v-if="isCartEmpty">
            <div class="sheet cart__empty">
              <p>В корзине нет ни одного товара</p>
            </div>
          </div>
          <div v-else>
            <CartPizzaList />
            <CartAdditionalItems />
            <CartAddressForm />
          </div>
        </div>
        <transition name="fade" @leave="$router.push(`/`)">
          <CartPopup v-if="showPopup" @close="resetState" />
        </transition>
      </main>
      <section class="footer">
        <div class="footer__more">
          <a
            href="#"
            class="button button--border button--arrow"
            @click="$router.push(`/`)"
            >Хочу еще одну</a
          >
        </div>
        <p class="footer__text">
          Перейти к конструктору<br />чтобы собрать ещё одну пиццу
        </p>
        <div class="footer__price">
          <b>Итого: {{ totalPrice }} ₽</b>
        </div>

        <div class="footer__submit">
          <button type="submit" class="button" :disabled="isCartEmpty">
            Оформить заказ
          </button>
        </div>
      </section>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CartPizzaList from "@/modules/cart/CartPizzaList";
import CartAdditionalItems from "@/modules/cart/CartAdditionalItems";
import CartAddressForm from "@/modules/cart/CartAddressForm";
import CartPopup from "@/modules/cart/CartPopup";

export default {
  name: "Cart",
  components: {
    CartPizzaList,
    CartAdditionalItems,
    CartAddressForm,
    CartPopup,
  },
  data() {
    return {
      showPopup: false,
    };
  },
  computed: {
    ...mapGetters("Cart", ["totalPrice", "addresses"]),
    ...mapState("Cart", ["cart", "misc", "deliveryMethod", "newAddress"]),
    ...mapState("Auth", ["isAuthenticated", "user"]),
    isCartEmpty() {
      return this.cart.length === 0;
    },
    phone() {
      return this.$store.state.Cart.phone;
    },
    street() {
      return this.newAddress.street;
    },
    building() {
      return this.newAddress.building;
    },
    flat() {
      return this.newAddress.flat;
    },
  },
  methods: {
    async submitOrder() {
      let payload = {
        userId: this.isAuthenticated ? this.user.id : null,
        phone: this.phone,
        address: this.getDeliveryAddress(),
        pizzas: this.cart.map((p) => this.getPizzaPayload(p)),
        misc: this.misc
          .filter((i) => i.count > 0)
          .map((i) => ({ miscId: i.id, quantity: i.count })),
      };
      await this.$store.dispatch("Orders/submitOrder", payload);
      this.showPopup = true;
    },
    resetState() {
      this.showPopup = false;
      this.$store.dispatch("Builder/resetState");
      this.$store.dispatch("Cart/resetState");
    },
    getPizzaPayload(pizza) {
      return {
        name: pizza.name,
        sauceId: pizza.sauce.id,
        doughId: pizza.dough.id,
        sizeId: pizza.size.id,
        quantity: pizza.amount,
        ingredients: pizza.ingredients.map((i) => ({
          ingredientId: i.id,
          quantity: i.amount,
        })),
      };
    },
    getDeliveryAddress() {
      let address = null;
      if (this.deliveryMethod === "self-delivery") {
        address = null;
      } else if (this.deliveryMethod === "new-address") {
        address = this.newAddress;
      } else {
        address = { id: this.deliveryMethod };
      }
      if (address) {
        address.flat = address.flat ? address.flat : "-";
      }
      return address;
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-form {
  height: calc(100vh - 60px);
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.5s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
