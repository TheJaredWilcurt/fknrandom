Vue.createApp({
  data: function () {
    return {
    };
  },
  methods: {
    getRandomSound: function (person) {
      const personMaxMap = {
        bobby: 71,
        hank: 325
      };
      const max = personMaxMap[person];
      const random = Math.ceil(Math.random() * max);
      return '_sound/' + person + '/' + random + '.mp3';
    },
    getRandomBobby: function () {
      return this.getRandomSound('bobby');
    }
    getRandomHank: function () {
      return this.getRandomSound('hank');
    }
  },
  computed: {
  }
}).mount('#app');
