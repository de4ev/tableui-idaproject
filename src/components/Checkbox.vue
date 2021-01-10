<template>
    <label class="container">
        <input 
            type="checkbox" 
            :checked="value"
            @change="e => $emit('change', e.target.checked)"
        >
        <span class="checkmark"></span>
    </label>
</template>

<script>
export default {
  props: ['value'],
}
</script>

<style lang="scss" scoped>
$accentColor: #00a11e;

.container {
    display: block;
    height: 14px;
    width: 14px;
    position: relative;
    user-select: none;
    cursor: pointer;
}
.container input {
    position: absolute;
    height: 0;
    width: 0;
    opacity: 0;
}
.checkmark {
  position: absolute;
  height: 14px;
  width: 14px;
  box-shadow: inset 0 0 0px 1px #C6CBD4;
  border-radius: 1px;
}
.container:hover input ~ .checkmark {
  background-color: rgba(0, 161, 29, 0.07);
}
.container input:checked ~ .checkmark {
  background-color: $accentColor;
  box-shadow: inset 0 0 0px 1px $accentColor;
}
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}
.container input:checked ~ .checkmark:after {
  display: block;
}
.container .checkmark:after {
  left: 5px;
  top: 2px;
  width: 3px;
  height: 6px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

</style>