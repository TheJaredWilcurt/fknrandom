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

const APP_NAME = 'fknrandom';
const NORMAL = 'normal';
const CLASSIC = 'classic';
const LAWLESS = 'lawless';
const IRONMAN = 'ironman';
const ALLOWED_RANDOMNESS = [
  NORMAL,
  CLASSIC,
  LAWLESS,
  IRONMAN
];

const SPRITE_WIDTH = 136;
const SPRITE_HEIGHT = 188;
const SPRITE_RATIO = SPRITE_WIDTH / SPRITE_HEIGHT;

const OFFSET = 11.25 + (22.5 * 3);

const BaseAccordion = {
  template: `
    <div :style="accordionContainer">
      <div :style="accordionInner">
        <slot></slot>
      </div>
    </div>
  `,
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
};

const CornerImage = {
  name: 'CornerImage',
  template: `
    <img
      :alt="corner.alt"
      :class="'image-' + name"
      role="button"
      :src="'_images/' + corner.src"
      :style="'width: ' + corner.width + 'px'"
      tabindex="0"
      @click="roll"
      @keyup.enter="roll"
      @keydown.space.prevent="roll"
    >
  `,
  props: {
    name: {
      type: String,
      required: true
    },
    corner: {
      type: Object,
      required: true
    }
  },
  methods: {
    roll: function () {
      this.$emit('click');
    }
  }
};

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
      <div class="menu-item-previous"></div>
      <div class="menu-item-next"></div>
    </div>
  `,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    volume: {
      type: Number,
      default: 50
    }
  },
  data: function () {
    return {
      hover: false
    };
  },
  methods: {
    toggle: function () {
      const sound = new Audio('_sound/click.wav');
      sound.volume = this.volume / 100;
      sound.play();
      this.$emit('update:modelValue', !this.modelValue);
    }
  }
};

const MenuItems = {
  name: 'MenuItems',
  template: `
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
  `,
  props: {
    options: Array,
    modelValue: String,
    volume: Number
  },
  data: function () {
    return {
      hover: false
    };
  },
  methods: {
    toggle: function () {
      const sound = new Audio('_sound/click.wav');
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

Vue.createApp({
  components: {
    BaseAccordion,
    CornerImage,
    MenuItem,
    MenuItems
  },
  data: function () {
    return {
      SPRITE_RATIO,
      showRandomnessExplainer: false,
      showIdleExplainer: false,
      background: 'animated',
      showImages: true,
      randomness: NORMAL,
      topLeft: null,
      topRight: null,
      bottomLeft: null,
      bottomRight: null,
      fadeWhenIdle: false,
      fadeOut: false,
      lastMovement: new Date(),
      character: 'doc',
      skin: 1,
      volume: 25,
      previousVolume: 25,
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
      usedIronmanCharacters: [],
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
        this.volume = 25;
        this.previousVolume = 25;
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
    updateSpecificCorner: function (up, side) {
      const srcs = [
        this.topLeft.src,
        this.topRight.src,
        this.bottomLeft.src,
        this.bottomRight.src
      ];
      let newCorner = imageMap[this.getRandomCorner()];
      if (srcs.includes(newCorner.src)) {
        this.updateSpecificCorner(up, side);
      } else {
        if (up === 'top') {
          if (side === 'left') {
            this.topLeft = newCorner;
          } else {
            this.topRight = newCorner;
          }
        } else {
          if (side === 'left') {
            this.bottomLeft = newCorner;
          } else {
            this.bottomRight = newCorner;
          }
        }
      }
    },
    getNormalRandomCharacter: function () {
      const characterNames = Object.keys(this.characters);
      const charactersAmount = characterNames.length;
      this.character = characterNames[Math.floor(Math.random() * charactersAmount)];

      const skinsAmount = this.characters[this.character];
      this.skin = Math.ceil(Math.random() * skinsAmount);

      // Prevent dupes
      const alreadyExists = this.randomCards.some((card) => {
        return card.character === this.character;
      });
      if (alreadyExists) {
        this.getNormalRandomCharacter();
      }
    },
    getLawlessRandomCharacter: function () {
      const characterNames = Object.keys(this.characters);
      const charactersAmount = characterNames.length;
      this.character = characterNames[Math.floor(Math.random() * charactersAmount)];

      const skinsAmount = this.characters[this.character];
      this.skin = Math.ceil(Math.random() * skinsAmount);
    },
    getClassicRandomCharacter: function () {
      if (Math.random() > 0.05) {
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
      if (this.character !== 'doc' && alreadyExists) {
        this.getClassicRandomCharacter();
      }
    },
    getIronmanRandomCharacter: function () {
      const characterNames = this.unusedIronmanCharacters;
      const charactersAmount = characterNames.length;
      this.character = characterNames[Math.floor(Math.random() * charactersAmount)];

      const skinsAmount = this.characters[this.character];
      this.skin = Math.ceil(Math.random() * skinsAmount);
    },
    getRandomCharacter: function () {
      const randomnessFunctionMap = {
        [NORMAL]: this.getNormalRandomCharacter,
        [LAWLESS]: this.getLawlessRandomCharacter,
        [CLASSIC]: this.getClassicRandomCharacter,
        [IRONMAN]: this.getIronmanRandomCharacter
      };
      if (!this.unusedIronmanCharacters.length) {
        randomnessFunctionMap[IRONMAN] = this.getNormalRandomCharacter;
      }
      const randomType = randomnessFunctionMap[this.randomness] || this.getNormalRandomCharacter;
      randomType();
    },
    getRandomCharacters: function (amount) {
      // if facing the front half of cylinder
      if (this.front) {
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
      if (
        !this.unusedIronmanCharacters.length &&
        this.randomness === IRONMAN
      ) {
        this.usedIronmanCharacters = [];
        this.getRandomCharacters(16)
        return;
      }
      this.playRandomSound();
      this.spinLocation = this.spinLocation - 180;
      this.getRandomCharacters(8);
      this.markIronmanCharacterAsUsed();
    },
    markIronmanCharacterAsUsed: function () {
      if (this.randomness === IRONMAN) {
        this.usedIronmanCharacters.push(this.currentCard);
        if (!this.unusedIronmanCharacters.length) {
          setTimeout(() => {
            this.getRandomCharacters(16);
          }, 3000);
        }
      }
    },
    initializeCorners: function () {
      const indices = this.getRandomCorners();
      this.topLeft = imageMap[indices[0]];
      this.topRight = imageMap[indices[1]];
      this.bottomLeft = imageMap[indices[2]];
      this.bottomRight = imageMap[indices[3]];
    },
    fadePageWhenIdle: function () {
      document.body.addEventListener('mousemove', () => {
        this.lastMovement = new Date();
      });
      setInterval(() => {
        let now = new Date();
        if (
          this.lastMovement.getTime() + 5000 < now.getTime() &&
          this.fadeWhenIdle
        ) {
          this.fadeOut = true;
        } else {
          this.fadeOut = false;
        }
      }, 1000);
    },
    loadSettings: function () {
      const settings = JSON.parse(localStorage.getItem(APP_NAME));
      if (settings) {
        if (settings.background) {
          this.background = settings.background;
        }
        this.fadeWhenIdle = settings.fadeWhenIdle;
        this.showImages = settings.showImages;
        if (ALLOWED_RANDOMNESS.includes(settings.randomness)) {
          this.randomness = settings.randomness;
        }
        this.usedIronmanCharacters = settings.usedIronmanCharacters;
        this.volume = settings.volume;
      }
    },
    saveSettings: function () {
      localStorage.setItem(APP_NAME, this.dataToSave);
    }
  },
  computed: {
    NORMAL: function () {
      return NORMAL;
    },
    CLASSIC: function () {
      return CLASSIC;
    },
    LAWLESS: function () {
      return LAWLESS;
    },
    IRONMAN: function () {
      return IRONMAN;
    },
    characterIndex: function () {
      return Object.keys(this.characters).indexOf(this.character);
    },
    unusedIronmanCharacters: function () {
      const used = (this.usedIronmanCharacters || [])
        .map((card) => {
          return card.character;
        });
      return Object
        .keys(this.characters)
        .filter((character) => {
          return !used.includes(character);
        });
    },
    currentCard: function () {
      if (this.front) {
        return this.randomCards[11]
      }
      return this.randomCards[3];
    },
    front: function () {
      // true = facing the front half of cylinder
      return !!((this.spinLocation + OFFSET) % 360);
    },
    dataToSave: function () {
      return JSON.stringify({
        background: this.background,
        fadeWhenIdle: this.fadeWhenIdle,
        showImages: this.showImages,
        randomness: this.randomness,
        usedIronmanCharacters: this.usedIronmanCharacters || [],
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
    this.fadePageWhenIdle();
    this.loadSettings();
    this.initializeCorners();
    this.getRandomCharacters(16);
  }
}).mount('#app');
