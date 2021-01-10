<template>
    <div class="table__filters">
      <div>
        <span v-if="selectedColumns.length > 0">Sorting by:</span>
        <v-button 
          v-for="column in selectedColumns" 
          :key="column.id" 
          :btnStyle="{style: firstColumnId === column.id ? 'active' : ''}"
          @click="setFirstColumn(column.id)">{{column.name}}
        </v-button>
      </div>

      <div>
        <v-button 
          @click="$emit('deleteSelected')"
          :btnStyle="{style: selectedProductsCount > 0 && 'active'}" 
          style="margin-right: 12px"
          :disabled="selectedProductsCount < 1"
        >{{deleteBtnText}}
        </v-button>

        <v-dropdown 
          :placeholder="itemsPerPage + ' Per Page'"
          @change="changePerPage"
          :options="perPageOptions"
          :disabled="productsCount === 0"
        ></v-dropdown>

        <v-pagination  
          :currentPage="currentPage"
          :totalItems="productsCount"
          :perPage="itemsPerPage"
          @changePage="goToPage"
          class="pagination"
        ></v-pagination>

        <v-dropdown 
          :multiselect="true"
          @change="changeSelectedColumns"
          :options="columns"
          :selectAllOnInit="true"
          :disabled="productsCount === 0"
        ></v-dropdown>
      </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Button from "./Button";
import Pagination from "./Pagination";
import Dropdown from "./Dropdown";


export default {
    components: {
        'v-button': Button,
        'v-pagination': Pagination,
        'v-dropdown': Dropdown,
  },
  computed: {
    ...mapState([
        'columns', 
        'itemsPerPage', 
        'itemsPerPageOptions', 
        'currentPage', 
        'firstColumnId',
      ]),
    ...mapGetters([
      'selectedProductsCount',
      'selectedColumns',
      'productsCount',
    ]),
    deleteBtnText() {
      let text = this.selectedProductsCount > 0 ? `Delete (${this.selectedProductsCount})` : 'Delete'
      return text
    },
    perPageOptions() {
      let options = []
      this.itemsPerPageOptions.forEach((element, index) => {
        options.push({id: index, value: element, name: element + ' Per Page'})
      });     
      return options 
    }
  },
  methods: {
    ...mapActions(['setFirstColumn', 'changeItemsPerPage', 'goToPage', 'setSelectedColumnsIds']),
    changePerPage(option) {
      this.changeItemsPerPage(option.value)
    },
    changeSelectedColumns(columns) {
      this.setSelectedColumnsIds(columns.map(col => col.id))
    }
  }
}
</script>

<style lang=scss scoped>
$headerTextColor: #3d374a;

span {
  font-size: 14px;
  font-weight: 600;
  margin-right: 8px;
}
.table__filters {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  color: $headerTextColor;
}
.table__filters div {
  display: flex;
  align-items: center;
}
.pagination {
  margin: 0 16px;
}
</style>