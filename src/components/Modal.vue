<template>
  <div class="wrapper">
    <div class="modal-overlay" @click="closeModal"></div>
    <div 
        class="modal"
    >
        <div class="modal-body">
            <slot name="body"></slot>
        </div>
        <div class="modal-footer">
            <v-button 
                class="modal-btn" 
                :btnStyle="{style: 'outline', shape: 'round'}" 
                @click="closeModal"
            >Cancel</v-button>
            <v-button 
                class="modal-btn" 
                :loading="loading"
                :btnStyle="{style: 'active', shape: 'round'}" 
                :disabled="loading" 
                @click="$emit('confirm-modal')"
            >Confirm</v-button>
        </div>
        <div v-if="errorMessage" class="error-block">
          {{errorMessage}}
        </div>
    </div>
  </div>
</template>

<script>
import Button from "./Button";

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  components: {
    "v-button": Button
  },
  methods: {
    closeModal() {
        this.$emit('close-modal')
    }
  }
};
</script>


<style  lang=scss scoped>
$mainTextColor: #282136;
$errorTextColor: #ec2a2a;
$overlayColor: rgba(0, 0, 0, 0.2);

.wrapper {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background-color: $overlayColor;
}
.modal {
  padding: 16px;
  background: #ffffff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  z-index: 3;
  color: $mainTextColor;
  font-size: 14px;
  line-height: 24px;
  transition: .3s;
}
.modal-body {
  margin-bottom: 8px;
}
.modal-footer {
  display: flex;
  justify-content: center;
}
.modal-btn {
  margin: 0 8px;
}
.bold {
  font-weight: 600;
}
.error-block {
  color: $errorTextColor;
  text-align: center;
}
</style>