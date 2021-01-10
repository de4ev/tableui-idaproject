<template>
  <div class="table">
    <v-filter-panel 
      @deleteSelected="setProductsToDelete"
    />
    <table v-if="productsCount > 0 && selectedColumnsIds.length > 0">
      <tr>
        <!-- TABLE HEADER -->
        <th>
          <v-checkbox 
              class="checkbox"
              :value="allProductsSelected"
              @change="toggleAllProductsSelection"
          ></v-checkbox>
        </th>
        <th 
          @click="toggleSorting"
          class="first__column-header" 
          :class="{'sorting': sorting}"
        >{{firstColumnName}}
            <img 
              v-if='sorting' 
              src="../assets/arrow-down.svg" 
              :class="{'descending': sorting === -1}"
            >
        </th>
        <th v-for="column in orderedColumns.slice(1)" :key="column.id">{{column.name}}</th>
        <th></th>
      </tr>
      <!-- TABLE HEADER END-->

      <!-- TABLE ROWS -->
      <tr 
          v-for="product in getProducts" 
          :key="product.id" 
          class="table__row"
      >
        <td @click="toggleProductSelection(product.id)">
          <v-checkbox
            class="checkbox"
            :value="isProductSelected(product.id)"
            @change="toggleProductSelection(product.id)"
          ></v-checkbox>
        </td>

        <td 
            v-for="column in orderedColumns" 
            :key="column.id"
            :class="{bold: isProductSelected(product.id) && column.id === 0, grow: column.id === 0 || orderedColumns.length === 1}"
            @click="toggleProductSelection(product.id)"
        > {{ product[column.value]}}
        </td>
    
        <td><v-button 
            @click="setProductsToDelete(product.id)" 
            class="btn-delete"
          >
            <img 
              slot='icon-before-text' 
              src="../assets/trash.svg"
              alt="delete-icon"
            >
          delete
        </v-button></td>
      </tr>
      <!-- TABLE ROWS -->
    </table>

    <h3 v-if="productsCount <= 0" style="text-align: center; margin-top: 30px">No products to show</h3>
    <h3 v-if="selectedColumnsIds.length == 0" style="text-align: center; margin-top: 30px">Select at least one column</h3>
  

    <transition name="fade">
      <v-modal 
        v-if="modalVisiblity"
        :loading="loading"
        :errorMessage="modalError"
        @close-modal="closeModal"
        @confirm-modal="confirmModal"
      >
        <div slot="body">Are you sure you want to<span class='bold'>{{modalText}}</span>?</div>
      </v-modal>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { deleteProducts } from "../../api/request";

import TableFilterPanel from './TableFilterPanel'
import Modal from './Modal'
import Button from './Button'
import Checkbox from "./Checkbox"

export default {
  components: {
    'v-filter-panel': TableFilterPanel,
    'v-modal': Modal,
    'v-button': Button,
    'v-checkbox': Checkbox
  },
  name: "Table",
  data() {
    return {
      modalVisiblity: false,
      productsToDelete: null,
      modalError: '',
    }
  },
  computed: {
    ...mapState([
      'selectedProductsIds', 
      'sorting', 
      'firstColumnId', 
      'selectedColumnsIds',
      'loading'
    ]),
    ...mapGetters([
      'selectedColumns', 
      'firstColumnName',
      'allProductsSelected', 
      'getProducts', 
      'productsCount', 
      'selectedProductsCount'
    ]),
    modalText() {
      let text = ' delete '
      if (this.productsToDelete === 'all' || this.productsToDelete === 'any') {
        text = `${text} ${this.selectedProductsCount} item${this.selectedProductsCount > 1 ? 's' : ''}`
      } else {
        text += 'item'
      }
      return text
    },
    orderedColumns() {
      let copy = this.selectedColumnsIds.slice()
      copy.splice(copy.indexOf(this.firstColumnId), 1)
      copy.unshift(this.firstColumnId)
      return copy.map(id => this.selectedColumns.find(col => col.id === id))
    }
  },
  methods: {
    ...mapActions([
      'toggleProductSelection',
      'toggleAllProductsSelection', 
      'toggleSorting',
      'deleteSelectedProducts', 
      'deleteProduct',
      'startLoading',
      'stopLoading'
      ]),
    isProductSelected(id) {
      return this.selectedProductsIds.indexOf(id) != -1
    },
    closeModal() {
      this.modalVisiblity = false
      document.body.classList.remove('modal-open')
    },
    openModal() {
      this.modalError = ''
      this.modalVisiblity = true
      document.body.classList.add('modal-open')
    },
    confirmModal() {
      this.startLoading()
      deleteProducts()
        .then(message => {
          console.log(message);
          if (this.productsToDelete === 'any') {
            this.deleteSelectedProducts()
          } else {
            this.deleteProduct(this.productsToDelete)
          }
          this.stopLoading()
          this.closeModal()
        })
        .catch(error => {
          this.modalError = error.error + '. Try again.'
          console.log(error);
          this.stopLoading()
        })
    },
    setProductsToDelete(id = 'any') {
      this.productsToDelete = id
      this.openModal()
    }
  },
};
</script>

<style lang="scss" scoped>
$mainTextColor: #282136;
$lightTextColor: #5b5e77;
$accentColor: #00a11e;
$accentColorHover: rgb(0, 175, 32);

table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  color: $mainTextColor;
  margin-bottom: 25px;
}
.table__row {
  cursor: pointer;
  transition: all .2s;
}
.table__row:hover {
  background-color: rgba(0, 161, 30, 0.07);
}
th {
  text-align: left;
  line-height: 24px;
  padding: 17px 12px;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #ededed;
}
th:nth-child(1),
td:nth-child(1) {
  padding-right: 17px;
  padding-left: 37px;
}
th:nth-child(2) {
  cursor: pointer;
}
.first__column-header.sorting {
  color: $accentColor
}
.first__column-header img {
  position: absolute;
  padding: 5px 8px;
  transition: transform .3s
}
.first__column-header img.descending{
  transform: rotateZ(180deg)
}
td {
  line-height: 24px;
  padding: 8px 12px;
  font-weight: 400;
  font-size: 14px;
  transition: all .2s;
}
td:not(:last-child),
td:not(:first-child), {
  min-width: 140px;
  max-width: 140px;
}
td.grow {
  width: 100%;
}
td:nth-child(1) {
  max-width: 68px;
  min-width: 68px;
}
td:last-child {
  max-width: 120px;
  min-width: 120px;
}
tr:nth-child(odd) {
  background-color: #f8f9fa;
}
tr:first-child {
  background-color: #ffffff;
}
.btn-delete {
  opacity: 0;
  transition: opacity .2s;
}
.table__row:hover .btn-delete {
  opacity: 1;
}
h3 {
  font-weight: 400;
}
.bold {
  font-weight: 600;
}
//transitions
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>