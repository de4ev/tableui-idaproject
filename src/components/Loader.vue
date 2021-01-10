<template>
    <div class="lds-ring" :style="spinnerStyles">
        <div :style="borderStyles"></div>
        <div :style="borderStyles"></div>
        <div :style="borderStyles"></div>
        <div :style="borderStyles"></div>
    </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 50
    },
    color: {
      type: String,
      default: '#00a11e'
    }
  },
  data() {
    return {
      spinnerStyles: {
        width: this.size + 'px',
        height: this.size + 'px'
      },
      borderStyles: {
        width: this.size + 'px',
        height: this.size + 'px',
        border: `${this.size / 10}px solid`,
        borderColor: `${this.color} transparent transparent transparent`,
      }
    }
  },
};
</script>

<style lang="scss" scoped>

.lds-ring {
  display: inline-block;
  position: relative;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>