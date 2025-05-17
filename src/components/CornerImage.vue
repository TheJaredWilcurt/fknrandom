<template>
  <img
    :alt="corner.alt"
    :class="{
      'fade-out': fadeOut,
      'fade-in': !fadeOut,
      ['image-' + name]: true
    }"
    role="button"
    :src="'/fknrandom/_images/' + corner.src"
    :style="'width: ' + corner.width + 'px;cursor: pointer'"
    tabindex="0"
    @click="roll"
    @keyup.enter="roll"
    @keydown.space.prevent="roll"
  >
</template>
<script>
export default {
  name: 'CornerImage',
  props: {
    fadeOut: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    corner: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  methods: {
    roll: function () {
      this.$emit('click');
    }
  }
}
</script>
