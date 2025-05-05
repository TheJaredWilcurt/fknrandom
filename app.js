const imageMap = Object.freeze([
  {
    alt: 'Bill... yep',
    src: 'bill-yep.webp',
    width: 190
  },
  {
    alt: 'Bobby loves ice cream',
    src: 'bobby-ice-cream.gif',
    width: 140
  },
  {
    alt: 'Bobby Hill, merica',
    src: 'bobby-merica.webp',
    width: 130
  },
  {
    alt: 'Melee box spin',
    src: 'box-spin.webp',
    width: 140
  },
  {
    alt: 'Gamecube spin',
    src: 'cube-spin.gif',
    width: 110
  },
  {
    alt: 'Melee disc spin',
    src: 'disc-spin.gif',
    width: 100
  },
  {
    alt: 'Zero-Suit Samus doing Fortnite dance',
    src: 'fortnite.gif',
    width: 180
  },
  {
    alt: 'Hank Hill saying Oh my god, it\'s so juicy',
    src: 'hank-juice.gif',
    width: 180
  },
  {
    alt: 'Peggy Hill with mohawk and tattoos',
    src: 'peggy-punk.webp',
    width: 190
  },
  {
    alt: 'Peggy and Bobby Hill with myspace sparkles',
    src: 'sparkle-true-my-friend.gif',
    width: 100
  },
  {
    alt: 'Hank Hill stutter walkin\'',
    src: 'stutter-walkin.gif',
    width: 190
  },
  {
    alt: 'Yoshi wearing pink Samus armor',
    src: 'yoshi-armor.png',
    width: 170
  }
]);

Vue.createApp({
  data: function () {
    return {
      animatedBg: true,
      showImages: true,
      topLeft: null,
      topRight: null,
      bottomLeft: null,
      bottomRight: null
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
    },
    getRandomHank: function () {
      return this.getRandomSound('hank');
    },
    getRandomCorner: function () {
      const imagesAmount = imageMap.length;
      return Math.floor(Math.random() * imagesAmount);
    },
    getRandomCorners: function () {
      let corners = [];
      while (corners.length < 4) {
        corners.push(this.getRandomCorner());
        corners = Array.from(new Set(corners));
      }
      return corners;
    },
    initializeCorners: function () {
      const indices = this.getRandomCorners();
      this.topLeft = imageMap[indices[0]];
      this.topRight = imageMap[indices[1]];
      this.bottomLeft = imageMap[indices[2]];
      this.bottomRight = imageMap[indices[3]];
    }
  },
  created: function () {
    this.initializeCorners();
  }
}).mount('#app');
