<template>
  <video
    v-if="background === 'animated'"
    autoplay
    class="bg-vid"
    loop
    poster="https://TheJaredWilcurt.com/melee-all-trophies-tracker/images/main.jpg"
  >
    <source
      src="https://TheJaredWilcurt.com/melee-all-trophies-tracker/images/main.mp4"
      type="video/mp4"
    >
  </video>
  <img
    v-else-if="background === 'still'"
    alt="background image"
    class="bg-vid"
    src="https://TheJaredWilcurt.com/melee-all-trophies-tracker/images/main.jpg"
  >
  <div
    class="bg-blue"
    :class="{ hide: background !== 'blue' }"
  ></div>
  <div
    class="bg-green"
    :class="{ hide: background !== 'green' }"
  ></div>
  <div
    class="bg-purple"
    :class="{ hide: background !== 'purple' }"
  ></div>
  <div
    class="bg-black"
    :class="{ hide: background !== 'black' }"
  ></div>
</template>

<script>
export default {
  name: 'BackgroundStage',
  props: {
    background: {
      type: String,
      required: true
    }
  }
};
</script>
