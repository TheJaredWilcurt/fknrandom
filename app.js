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

const APP_NAME = 'fknrandom'

const OFFSET = 11.25 + (22.5 * 3);

const MenuItem = {
  name: 'MenuItem',
  template: `
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
    </div>
  `,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      hover: false
    };
  },
  methods: {
    toggle: function () {
      this.$emit('update:modelValue', !this.modelValue);
    }
  }
};

Vue.createApp({
  components: {
    MenuItem
  },
  data: function () {
    return {
      animatedBg: true,
      showImages: true,
      trueRandom: false,
      topLeft: null,
      topRight: null,
      bottomLeft: null,
      bottomRight: null,
      character: 'doc',
      skin: 1,
      volume: 100,
      previousVolume: 100,
      characters: {
        'doc': 5,
        'mario': 5,
        'luigi': 4,
        'bowser': 4,
        'peach': 5,
        'yoshi': 6,
        'dk': 5,
        'falcon': 6,
        'gannon': 5,
        'falco': 4,
        'fox': 4,
        'ness': 4,
        'icies': 4,
        'kirby': 6,
        'samus': 5,
        'zelda': 5,
        'link': 5,
        'young-link': 5,
        'pichu': 4,
        'pikachu': 4,
        'puff': 5,
        'mewtwo': 4,
        'game-and-watch': 4,
        'marth': 5,
        'roy': 5,
        'sheik': 5
      },
      spinLocation: (-1 * OFFSET),
      personSoundMap: {
        bobby: 71,
        hank: 325
      },
      randomCards: []
    };
  },
  methods: {
    toggleMute: function () {
      if (
        this.volume === 0 &&
        this.previousVolume === 0
      ) {
        this.volume = 100;
        this.previousVolume = 100;
      } else if (this.volume === 0) {
        this.volume = this.previousVolume;
      } else {
        this.previousVolume = this.volume;
        this.volume = 0;
      }
    },
    getRandomSound: function (person) {
      const max = this.personSoundMap[person];
      const random = Math.ceil(Math.random() * max);
      return '_sound/' + person + '/' + random + '.mp3';
    },
    getRandomBobby: function () {
      return this.getRandomSound('bobby');
    },
    getRandomHank: function () {
      return this.getRandomSound('hank');
    },
    playRandomSound: function () {
      const bobby = this.personSoundMap.bobby;
      const hank = this.personSoundMap.hank;
      let file;
      if (Math.round(Math.random() * (bobby + hank)) < bobby) {
        file = this.getRandomBobby();
      } else {
        file = this.getRandomHank();
      }
      let sound = new Audio(file);
      sound.volume = this.volume / 100;
      sound.play();
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
    getRandomCharacter: function () {
      if (this.trueRandom && Math.random() > 0.05) {
        this.character = 'doc';
      } else {
        const characterNames = Object.keys(this.characters);
        const charactersAmount = characterNames.length;
        this.character = characterNames[Math.floor(Math.random() * charactersAmount)];
      }
      const skinsAmount = this.characters[this.character];
      this.skin = Math.ceil(Math.random() * skinsAmount);
      // Prevent dupes
      const alreadyExists = this.randomCards.some((card) => {
        return card.character === this.character;
      });
      if (this.trueRandom && this.character !== 'doc' && alreadyExists) {
        this.getRandomCharacter();
      }
      if (!this.trueRandom && alreadyExists) {
        this.getRandomCharacter();
      }
    },
    getRandomCharacters: function (amount) {
      const front = !!((this.spinLocation + OFFSET) % 360);
      // if facing the front half of cylinder
      if (front) {
        // remove the back half of the array
        this.randomCards.splice((-1 * amount), amount);
        for (let i = 0; i < amount; i++) {
          this.getRandomCharacter();
          this.randomCards.push({
            character: this.character,
            skin: this.skin,
            index: this.characterIndex
          });
        }
      } else {
        // remove the front half of the array
        this.randomCards = this.randomCards.slice(amount)
        for (let i = 0; i < amount; i++) {
          this.getRandomCharacter();
          this.randomCards.unshift({
            character: this.character,
            skin: this.skin,
            index: this.characterIndex
          });
        }
      }
    },
    rollForCharacter: function () {
      this.playRandomSound();
      this.spinLocation = this.spinLocation - 180;
      this.getRandomCharacters(8);
    },
    initializeCorners: function () {
      const indices = this.getRandomCorners();
      this.topLeft = imageMap[indices[0]];
      this.topRight = imageMap[indices[1]];
      this.bottomLeft = imageMap[indices[2]];
      this.bottomRight = imageMap[indices[3]];
    },
    loadSettings: function () {
      const settings = JSON.parse(localStorage.getItem(APP_NAME));
      if (settings) {
        this.animatedBg = settings.animatedBg;
        this.showImages = settings.showImages;
        this.trueRandom = settings.trueRandom;
        this.volume = settings.volume;
      }
    },
    saveSettings: function () {
      localStorage.setItem(APP_NAME, this.dataToSave);
    }
  },
  computed: {
    characterIndex: function () {
      return Object.keys(this.characters).indexOf(this.character);
    },
    dataToSave: function () {
      return JSON.stringify({
        animatedBg: this.animatedBg,
        showImages: this.showImages,
        trueRandom: this.trueRandom,
        volume: this.volume
      });
    }
  },
  watch: {
    dataToSave: function (argument) {
      this.saveSettings();
    }
  },
  created: function () {
    this.loadSettings();
    this.initializeCorners();
    this.getRandomCharacters(16);
  }
}).mount('#app');
