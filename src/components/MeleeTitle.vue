<template>
  <div class="title">
    <svg
      class="melee-slant"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 728 115"
    >
      <path
        fill="rgba(255, 145, 127, 0.6)"
        d="M98.975 78.44H8.932C-1.5 86.957 4.484 94.333 25.491 99.887L98.975 78.44zm29.556-8.626L306.413 17.9c-97.159 9.732-187.507 23.842-245.039 39.554-15.58 4.255-27.88 8.393-37.052 12.36h104.209zM251.71 78.44l-112.756 32.097h-.002c9.512.186 19.499.282 29.95.285 125.194.038 281.634-13.312 397.551-32.382H251.71zM559.08 4.271c-15.869-.005-32.244.206-48.972.616L282.014 69.814h332.05c19.518-3.91 37.202-7.985 52.547-12.176C774.352 28.215 726.214 4.321 559.08 4.271z"
      />
    </svg>
    <div class="text-overlap">
      <h1 class="title-text-stroke">{{ topText }}</h1>
      <h1 class="title-text-color">{{ topText }}</h1>
    </div>
    <div class="text-overlap">
      <h2 class="title-text-stroke">{{ bottomText }}</h2>
      <h2 class="title-text-color">{{ bottomText }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeleeTitle',
  props: {
    topText: {
      type: String,
      required: true
    },
    bottomText: {
      type: String,
      required: true
    }
  }
};
</script>
