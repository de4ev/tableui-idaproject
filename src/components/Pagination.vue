<template>
    <div class="pagination">
        <v-button 
            @click="changePage(prev)" 
            :btnStyle="{style: 'outline'}" 
            :disabled="currentPage === 1"
        >
            <img 
              src="../assets/chevron-left.svg"
              alt="chevron-icon"
            >
        </v-button>
        <p :class="{'disabled': disabled}">
            <span v-if="totalItems > 0">
                <span class="bold">{{showingFrom}}</span>
                <span v-if="showingTo - showingFrom >= 1" class="bold">-{{showingTo}}</span>
            </span>
            <span v-else class="bold">0</span>
            of
            <span class="bold">{{totalItems}}</span>
        </p>
        <v-button 
            @click="changePage(next)" 
            :btnStyle="{style: 'outline'}"
            :disabled="currentPage === totalPages || totalPages < 1"
        >
            <img 
              src="../assets/chevron-right.svg"
              alt="chevron-icon"
            >
        </v-button>
    </div>
</template>

<script>
import Button from './Button'

export default {
    props: {
        currentPage: {
            type: Number,
            default: 1
        },
        totalItems: {
            type: Number,
            required: true
        },
        perPage: {
            type: Number,
            required: true
        }
    },
    components: {
        'v-button': Button
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalItems/this.perPage)
        },
        prev() {
            return this.currentPage <= 1 ? 1 : this.currentPage - 1
         },
        next() {
            return this.currentPage >= this.totalPages ? this.totalPages : this.currentPage + 1
        },
        showingFrom() {
            return (this.currentPage - 1) * this.perPage + 1
        },
        showingTo() {
            if (this.currentPage < this.totalPages) {
                return this.currentPage * this.perPage
            } else {
                return this.totalItems
            }
        },
        disabled() {
            return this.totalItems < 1
        }
    },
     methods: {
         changePage(page) {
             this.$emit('changePage', page)
         }
     },
}
</script>

<style lang=scss scoped>
$disabledTextColor: #5B5E77;

.pagination {
    display: flex;
    align-items: center;
}
p {
    margin: 0 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
}
p.disabled {
    color: $disabledTextColor;
    opacity: .3;
    user-select: none;
}
.bold {
    font-weight: 600;
}
</style>