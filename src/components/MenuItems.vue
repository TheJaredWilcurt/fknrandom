<template>
  <div
    class="menu-item menu-items"
    :class="{
      active: hover,
      first: modelValue === options[0],
      last: modelValue === options[options.length - 1]
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
    <div class="menu-item-switch-curtains menu-items-switch-curtains">
      <span
        v-for="(option, index) in options"
        :class="'menu-item-' + index"
        :style="'left: ' + (options.indexOf(modelValue) * -100) + 'px'"
      >
        {{ option.toUpperCase() }}
      </span>
    </div>
    <div class="menu-item-previous"></div>
    <div class="menu-item-next"></div>
  </div>
</template>

<script>
export default {
  name: 'MenuItems',
  props: {
    options: Array,
    modelValue: String,
    volume: Number
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
      const currentValueIndex = this.options.indexOf(this.modelValue);
      let nextValue = this.options[currentValueIndex + 1];
      if (!nextValue) {
        nextValue = this.options[0];
      }
      this.$emit('update:modelValue', nextValue);
    }
  }
};
</script>
