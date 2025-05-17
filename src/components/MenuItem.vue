<template>
  <div
    class="menu-item"
    :class="{
      active: hover,
      on: modelValue
    }"
    role="button"
    tabindex="0"
    @click="toggle"
    @keyup.enter="toggle"
    @keydown.space.prevent="toggle"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @focus="hover = true"
    @blur="hover = false"
  >
    <div class="menu-item-bg"></div>
    <div class="menu-item-border"></div>
    <div class="menu-item-settings-bg"></div>
    <div class="menu-item-half-circle"></div>
    <div class="menu-item-full-circle"></div>
    <div class="menu-item-label"><slot></slot></div>
    <div class="menu-item-switch-curtains">
      <span class="on">ON</span>
      <span class="off">OFF</span>
    </div>
    <div class="menu-item-previous"></div>
    <div class="menu-item-next"></div>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    volume: {
      type: Number,
      default: 50
    }
  },
  emits: ['update:modelValue'],
  data: function () {
    return {
      hover: false
    };
  },
  methods: {
    toggle: function () {
      const sound = new Audio('/fknrandom/_sound/click.wav');
      sound.volume = this.volume / 100;
      sound.play();
      this.$emit('update:modelValue', !this.modelValue);
    }
  }
};
</script>
