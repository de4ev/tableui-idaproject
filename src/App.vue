<template>
  <div id="app">
    <h1>TableUI</h1>
    <div class="hr"></div>
    <div v-if="loading" class="flex-grow">
      <v-loader class="center"></v-loader>
    </div>
    <div v-else-if="fetchError" class="flex-grow">
        <p class="error-header">OOPS!</p>
        <p class="error-text">Something went wrong...</p>
        <v-button 
          :btnStyle="{style: 'wide'}"
          @click="tryFetch"
        >Try again</v-button>
    </div>
    <v-table v-else></v-table>
  </div>
</template>

<script>
import { getProducts } from "../api/request";

import Table from "./components/Table.vue";
import Loader from "./components/Loader.vue";
import Button from "./components/Button.vue";


export default {
  name: "App",
  components: {
    "v-table": Table,
    "v-loader": Loader,
    "v-button": Button
  },
  data() {
    return {
      loading: false,
      fetchError: false
    }
  },
  mounted() {
    this.tryFetch()
  },
  methods: {
    tryFetch() {
      this.loading = true;
      this.fetchError = false
      getProducts()
          .then(products => {
            this.$store.dispatch('setProducts', products)
            this.loading = false
          })
          .catch(err => {
            this.fetchError = true
            this.loading = false
            console.log(err)
          })
    }
  },
};
</script>

<style lang="scss">
$mainTextColor: #282136;
$backgroundColor: #f2f2f2;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: $backgroundColor;
}
body.modal-open {
  overflow: hidden;
}
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Source Sans Pro", sans-serif;
  max-width: 1140px;
  margin: 0 auto;
  padding: 32px 0;
}
h1 {
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  color: $mainTextColor;
}
.hr {
  width: 100%;
  height: 1px;
  margin: 16px 0;
  background-color: #ededed;
}
.flex-grow {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.error-header {
  font-family: 'Montserrat', sans-serif;
  font-weight: 100;
  font-size: 80px;
}
.error-text {
  margin-bottom: 20px;
  margin-top: -30px;
  padding:  0 10px ;
  background:  $backgroundColor;
  font-size: 16px;
  color: #000;
}
</style>
