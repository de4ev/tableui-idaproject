<template>
    <div 
      class="btn unselectable" 
      :class="{
          'round': btnStyle.shape === 'round',
          'active': btnStyle.style === 'active',
          'outline': btnStyle.style === 'outline',
          'wide': btnStyle.style === 'wide',
          'disabled': disabled === true || loading === true
        }" 
      @click="handleClick"
    >
        <div v-if="this.$slots['icon-before-text']" class="icon-container icon-before">
            <slot name="icon-before-text"></slot>
        </div>
        <div class="btn-text" :style="`visibility: ${loading ? 'hidden' : 'visible'}`">
          <slot></slot>
        </div>
        <Loader v-if="loading" :size="20" color="white" class="loader"/>

        <div v-if="this.$slots['icon-after-text']" class="icon-container icon-after">
            <slot name="icon-after-text"></slot>
        </div>

    </div>
</template>

<script>
import Loader from './Loader';
export default {
  props: {
    btnStyle: {
      type: Object,
      default: () => {
        return {
          style: "flat",
          shape: "square"
        };
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loader
  },
  methods: {
    handleClick() {
      if (!this.disabled && !this.loading) {
        this.$emit('click')
      }
    }
  },
};
</script>

<style  lang=scss scoped>
/* button types: flat, outline, active, wide */
$fillColor: #00a11e;
$fillColorHover: #00af20;
$borderColor: #D5DAE0;
$borderColorHover: #b9bfc4;
$flatTextColor: #3d374a;
$activeTextColor: #ffffff;
$outlineTextColor: #5b5e77;
$disabledTextColor: #5B5E77;
$disabledBorderColor: #c6cbd4;


.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  min-width: 32px;
  min-height: 32px;
  padding: 3px 8px;
  text-align: center;
  color: $flatTextColor;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
}
.loader {
  position: absolute;
}
.disabled {
  cursor: default;
  opacity: .3;
  color: $disabledTextColor;
  border: 1px solid $disabledBorderColor;
  border-radius: 2px;
  transition: all 0.1s;
}
.unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.btn.round {
  border-radius: 4px;
  padding: 3px 16px;
}
.active,
.wide {
  padding: 3px 8px;
  background: $fillColor;
  color: $activeTextColor;
  transition: all 0.2s;
}
.wide {
  padding: 4px 28px;
}
.active:hover,
.wide:hover {
  background: $fillColorHover;
}
.active:active,
.wide:active {
  background: $fillColor;
}
.outline {
  color: $outlineTextColor;
  border: 1px solid $borderColor;
  border-radius: 2px;
  transition: all 0.1s;
}
.outline:hover {
  border-color: $borderColorHover;
}
.icon-container {
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
}
.icon-before {
    margin-right: 5px;
}
.icon-after {
    margin-left: 5px;
}
.icon-container img {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>