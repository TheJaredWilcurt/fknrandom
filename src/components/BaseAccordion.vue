<template>
  <div :style="accordionContainer">
    <div :style="accordionInner">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseAccordion',
  props: {
    show: {
      type: Boolean,
      default: true
    },
    speedMs: {
      type: Number,
      default: 750
    }
  },
  computed: {
    accordionContainer: function () {
      let frames = '1';
      if (!this.show) {
        frames = '0';
      }
      return [
        'display: grid',
        'grid-template-rows: ' + frames + 'fr',
        'margin-bottom: ' + (-10 * frames) + 'px',
        'transition: ' + this.speedMs + 'ms ease all'
      ].join(';');
    },
    accordionInner: function () {
      return [
        'grid-row: 1 / span 2',
        'padding-bottom: 10px',
        'overflow: hidden'
      ].join(';');
    }
  }
}
</script>