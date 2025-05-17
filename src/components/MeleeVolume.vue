<template>
  <label class="slider">
    <button @click="toggleMute">
      <svg
        v-if="modelValue < 2"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        @click="toggleMute"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      </svg>
      <svg
        v-else-if="modelValue < 50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        @click="toggleMute"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
      <svg
        v-else
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        @click="toggleMute"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    </button>
    <input
      max="100"
      min="0"
      type="range"
      :value="modelValue"
      @input="emit($event.target.value)"
    >
  </label>
</template>

<script>
export default {
  name: 'MeleeVolume',
  props: {
    modelValue: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data: function () {
    return {
      previousVolume: 25
    };
  },
  methods: {
    emit: function (value) {
      this.$emit('update:modelValue', parseInt(value));
    },
    toggleMute: function () {
      if (
        this.modelValue === 0 &&
        this.previousVolume === 0
      ) {
        this.emit(25);
        this.previousVolume = 25;
      } else if (this.modelValue === 0) {
        this.emit(this.previousVolume);
      } else {
        this.previousVolume = this.modelValue;
        this.emit(0);
      }
    }
  }
};
</script>
