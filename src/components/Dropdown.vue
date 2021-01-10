<template>
    <div class="dropdown" v-outside-click="onClose">
      <v-button 
        :btnStyle="{style: 'outline'}"
        :disabled="disabled"
        @click="showMenu = !showMenu"
        
      >
        <span>{{btnText}}</span>
        <img 
              slot='icon-after-text' 
              :class="{'rotate180': showMenu}"
              src="../assets/chevron-down.svg"
              alt="chevron-icon"
        >
      </v-button>

      <transition name="fade">
              <ul v-if="showMenu" class="options-list">
                  <li 
                      v-if="multiselect"
                      class="bold option"
                      @click="toggleAllOptions"
                  >
                      <v-checkbox 
                        :value="allSelected"
                        class="checkbox"
                        @change="toggleAllOptions"
                      ></v-checkbox>
                      Select All
                  </li>
                  <li 
                      v-for="(option, i) in options" 
                      :key="i" 
                      class="option"
                      @click="selecteOption(option)"
                  >
                      <v-checkbox 
                        v-if="multiselect" 
                        class="checkbox"
                        :value="selectedIds.indexOf(option.id) >= 0"
                        @change="selecteOption(option)"
                      ></v-checkbox>
                      {{option.name}}
                  </li>
              </ul>
      </transition>
    </div>
</template>

<script>
import OutsideClick from "../directives/OutsideClick";
import Button from "./Button"
import Checkbox from "./Checkbox"

export default {
  props: {
    placeholder: {
      type: String
    },
    options: {
      type: Array,
      required: true
    },
    multiselect: {
      type: Boolean,
      default: false
    },
    selectAllOnInit: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'v-button': Button,
    'v-checkbox': Checkbox,
  },
  directives: {
    "outside-click": OutsideClick
  },
  data() {
    return {
      showMenu: false,
      selectedIds: this.multiselect ? [] : null,
    };
  },
  mounted() {
    if (this.selectAllOnInit) {
      this.selectedIds = this.options.map(option => option.id)
    }
  },
  computed: {
    placeholderText() {
      if (this.multiselect) {
        return `${this.selectedIds.length} columns selected`
      } else {
        return this.placeholder ? this.placeholder : 'Select an option'
      }
    },
    btnText() {
      return !this.multiselect && this.selectedIds ? this.selectedOptions.name : this.placeholderText
    },
    allSelected() {
      function equalArrays(arr1, arr2) {
        const arr1Sorted = arr1.slice().sort();
        const arr2Sorted = arr2.slice().sort();
        return arr1Sorted.length === arr2Sorted.length && arr1Sorted.every(function(value, index) {
            return value === arr2Sorted[index];
        });
      }
      return equalArrays(this.selectedIds, this.options.map(option => option.id))
    },
    selectedOptions() {
      if (this.multiselect) {
        return this.selectedIds.map(id => this.options.find(option => option.id === id))
      } else {
        return this.options.find(option => option.id === this.selectedIds)
      }
    }
  },
  methods: {
    selecteOption(option) {
      if (this.multiselect) {
        if (this.selectedIds.indexOf(option.id) >= 0) {
          this.selectedIds.splice(this.selectedIds.indexOf(option.id), 1)
        } else {
          this.selectedIds.push(option.id)
        }
      } else {
        this.selectedIds = option.id
        this.onClose()
      }
      this.$emit('change', this.selectedOptions)
    },
    toggleAllOptions() {
      if (this.allSelected) {
        this.selectedIds = []
      } else {
        this.selectedIds = this.options.map(option => option.id)
      }
      this.$emit('change', this.selectedOptions)
    },
    onClose() {
    this.showMenu = false
    }
  }
}
</script>

<style scoped>
.dropdown {
  position: relative;
}
.dropdown img {
  transition: .3s;
}
.rotate180 {
  transform: rotate(180deg);
}
.options-list {
  z-index: 2;
  position: absolute;
  top: calc(100% + 14px);
  max-height: 243px;
  overflow: scroll;
  left: 0;
  padding: 10px 0;
  background-color: #fff;
  list-style: none;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
}
.option {
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  color: #282136;
  white-space: nowrap;
  line-height: 24px;
  font-size: 14px;
  padding: 6px 16px;
}
.option:hover {
  background: #f8f9fa;
}
.checkbox {
  margin-right: 13px;
}
.bold {
  font-weight: 600;
}


/* transisions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter, .fade-leave-to  {
  opacity: 0;
  transform: translateY(-10px)
}
</style>