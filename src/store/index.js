
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function equalArrays(arr1, arr2) {
    const arr1Sorted = arr1.slice().sort();
    const arr2Sorted = arr2.slice().sort();
    return arr1Sorted.length === arr2Sorted.length && arr1Sorted.every(function(value, index) {
        return value === arr2Sorted[index];
    });
}

export const store = new Vuex.Store({
    state: {
        columns: [
            { id: 0, value: "product", name: "Product (100g serving)" },
            { id: 1, value: "calories", name: "Calories" },
            { id: 2, value: "fat", name: "Fat (g)" },
            { id: 3, value: "carbs", name: "Carbs (g)" },
            { id: 4, value: "protein", name: "Protein (g)" },
            { id: 5, value: "iron", name: "Iron (%)" }
        ],
        selectedColumnsIds: [0, 1, 2, 3, 4, 5],
        firstColumnId: 0,
        products: [],
        sorting: 0, // 0: no sorting, 1: ascending, -1: descending;
        productsIds: [],
        selectedProductsIds: [],
        itemsPerPage: 10,
        itemsPerPageOptions: [10, 15, 20],
        currentPage: 1,
        loading: false
    },
    getters: {
        getProducts(state) {
            let products = state.products.slice()
            if (state.sorting) {
                let compareBy = state.columns.find( column => column.id === state.firstColumnId).value
                let compare = (a, b) => {
                    if (a[compareBy] > b[compareBy]) {
                        return state.sorting
                    }
                    if (a[compareBy] < b[compareBy]) {
                        return -1 * state.sorting //changes sorting order
                    }
                    return 0
                }
                products.sort(compare)
            }
            //subarray for current page
            const start = (state.currentPage - 1) * state.itemsPerPage
            const end = start + state.itemsPerPage
            const subArray = products.slice(start, end)
            return subArray
        },
        firstColumnName(state) {
            return state.columns.find(col => col.id === state.firstColumnId).name
        },
        selectedColumns(state) {
            return state.selectedColumnsIds.map(colId => state.columns.find(col => col.id === colId))
        },
        productsCount(state) {
            return state.products.length
        },
        selectedProductsCount(state) {
            return state.selectedProductsIds.length
        },
        allProductsSelected(state, getters) {
            return getters.selectedProductsCount > 0 && equalArrays(state.selectedProductsIds, state.productsIds)
        },
    },
    mutations: {
        setProducts(state, products) {
            state.products = products.slice()
        },
        setProductsIds(state) {
            state.productsIds = state.products.map(product => product.id)
        },
        setFirstColumnId(state, columnId) {
            state.firstColumnId = columnId
        },
        setSorting(state, sorting) {
            state.sorting = sorting
        },
        setSelectedColumnsIds(state, selectedColumnsIds) {
            state.selectedColumnsIds = selectedColumnsIds
        },
        setItemsPerPage(state, itemsPerPage) {
            state.itemsPerPage = itemsPerPage
        },
        goToPage(state, page) {
            state.currentPage = page
        },
        selectProduct(state, id) {
            state.selectedProductsIds.push(id)
        },
        deselectProduct(state, id) {
            state.selectedProductsIds.splice(state.selectedProductsIds.indexOf(id), 1)
        },
        selectAll(state) {      
            state.selectedProductsIds = state.productsIds.slice()
        },
        deselectAll(state) {
            state.selectedProductsIds = []  
        },
        deleteProduct(state, id) {
            state.products.splice(state.products.findIndex( product => product.id === id), 1)
        },
        deleteProductId(state, id) {
            state.productsIds.splice(state.productsIds.findIndex( productId => productId === id), 1)
        },
        startLoading(state) {
            state.loading = true
        },
        stopLoading(state) {
            state.loading = false
        }
    },
    actions: {
        startLoading({commit}) {
            commit('startLoading')
        },
        stopLoading({commit}) {
            commit('stopLoading')
        },
        changeItemsPerPage: ({commit, state}, payload) => {
            if (payload !== state.itemsPerPage) {
                //saving current position
                let page = state.currentPage
                if (state.currentPage > 1) {
                    const firstListItemIndex = (state.currentPage - 1) * state.itemsPerPage + 1
                    page = Math.ceil(firstListItemIndex / payload)
                }
                commit('setItemsPerPage', payload)
                if (page != state.currentPage) {
                    commit('goToPage', page)
                }
            }
        },
        goToPage({ commit}, page) {
            commit('goToPage', page)
        },
        setFirstColumn({commit}, columnId) {
            commit('setFirstColumnId', columnId)
            commit('setSorting', 0)
        },
        setSelectedColumnsIds({commit, state}, selectedColumnsIds) {
            commit('setSelectedColumnsIds', selectedColumnsIds.sort())
            if (!selectedColumnsIds.includes(state.firstColumnId)) {
                commit('setFirstColumnId', selectedColumnsIds[0])
            }
        },
        toggleSorting({ commit, state}) {
            state.sorting ? commit('setSorting', state.sorting * -1) : commit('setSorting', 1)
        },
        toggleProductSelection({commit, state}, id) {
            state.selectedProductsIds.includes(id) ? commit('deselectProduct', id) : commit('selectProduct', id)
        },
        toggleAllProductsSelection({commit, getters}) {
            getters.allProductsSelected ? commit('deselectAll') : commit('selectAll')
        },
        deleteProduct({ commit, state , getters}, id) {
            if (state.selectedProductsIds.includes(id)) {
                commit('deselectProduct', id)
            }
            commit('deleteProductId', id)
            commit('deleteProduct', id)
            const lastPage = Math.ceil(getters.productsCount / state.itemsPerPage)
            if (state.currentPage > lastPage && lastPage > 0) {
                commit('goToPage', lastPage)
            }
        },
        deleteSelectedProducts({ dispatch, state }) {
            const copy = state.selectedProductsIds.slice()
            copy.forEach(id => {
                dispatch('deleteProduct', id)
            })
        },
        setProducts ({commit}, products) {
            commit('setProducts', products)
            commit('setProductsIds')
        }
    }
  })
