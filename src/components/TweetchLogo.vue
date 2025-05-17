<template>
  <a
    class="tweetch"
    :class="{
      'fade-out': fadeOut,
      'fade-in': !fadeOut,
      'purple-screen': background === 'purple'
    }"
    href="https://twitch.tv/fknsilver"
    title="twitch.tv/fknsilver"
  >
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z"
        fill-rule="evenodd"
      />
    </svg>
  </a>
</template>

<script>
export default {
  name: 'TweetchLogo',
  props: {
    background: {
      type: String,
      required: true
    },
    fadeOut: {
      type: Boolean,
      required: true
    }
  }
};
</script>
