<template>
  <BackgroundStage
    :background="background"
  />
  <MeleeTitle
    topText="fknsilver's random"
    bottomText="character select"
    :class="fadeOut ? 'fade-out' : 'fade-in'"
  />

  <div
    v-if="randomness === IRONMAN"
    class="carousel-reset"
    :class="{
      'fade-in': !unusedIronmanCharacters.length,
      'fade-out': unusedIronmanCharacters.length
    }"
    role="button"
    tabindex="0"
    @click="rollForCharacter"
    @keyup.enter="rollForCharacter"
    @keydown.space.prevent="rollForCharacter"
  >
    <div class="text-overlap">
      <h1 class="title-text-stroke">RESET?</h1>
      <h1 class="title-text-color">RESET?</h1>
    </div>
  </div>
  <div
    class="carousel"
    :class="{
      'fade-in': !fadeOut,
      'fade-out': fadeOut || (!unusedIronmanCharacters.length && randomness === IRONMAN),
      'green-screen': ['green', 'blue', 'purple', 'black'].includes(background)
    }"
    role="button"
    tabindex="0"
    @click="rollForCharacter"
    @keyup.enter="rollForCharacter"
    @keydown.space.prevent="rollForCharacter"
  >
    <div
      class="deck"
      :style="'transform: rotateY(' + spinLocation + 'deg);'"
    >
      <div class="cylinder">
        <div
          v-for="(card, cardIndex) in randomCards"
          class="card"
          :style="[
            'transform:',
            'rotateY(' + ((cardIndex * 22.5) + 11.25) + 'deg)',
            'translate3D(-50%, 0, 2.975em)'
          ].join(' ')"
          :key="'card-' + cardIndex"
        >
          <div
            class="character"
            :style="[
              'background-position:',
              'calc((var(--sprite-width) * -' + (card.skin - 1) + ') - ' + card.skin + 'px)',
              'calc((var(--sprite-height) * -' + card.index + ') - ' + (card.index + 1) + 'px)'
            ].join(' ')"
          ></div>
        </div>
      </div>
    </div>
    <div class="selected-card"></div>
  </div>
  <div
    v-if="randomness === IRONMAN"
    class="ironman"
    :class="{
      'fade-in': !fadeOut,
      'fade-out': fadeOut
    }"
  >
    <TransitionGroup name="fade">
      <div
        v-for="(card, cardIndex) in usedIronmanCharacters"
        :key="'card' + cardIndex"
        class="mini-card"
        :class="{ 'green-screen': ['blue', 'green'].includes(background) }"
      >
        <div
          class="mini-character"
          :style="[
            'background-position:',
            'calc((var(--sprite-width) * -' + (card.skin - 1) + ') - ' + ((card.skin * SPRITE_RATIO) * (3 * SPRITE_RATIO)) + 'px)',
            'calc((var(--sprite-height) * -' + card.index + ') - 1px)'
          ].join(' ')"
        ></div>
      </div>
    </TransitionGroup>
  </div>

  <div
    class="controls"
    :class="{
      'fade-in': !fadeOut,
      'fade-out': fadeOut,
      'green-screen': ['blue', 'green'].includes(background)
    }"
  >
    <MenuItems
      v-model="randomness"
      :volume="volume"
      :options="ALLOWED_RANDOMNESS"
      @mouseover="showRandomnessExplainer = true"
      @mouseout="showRandomnessExplainer = false"
    >
      Randomness
    </MenuItems>
    <BaseAccordion :show="showRandomnessExplainer">
      <div class="explainer">
        <p v-if="randomness === NORMAL">
          Fully random, but you cannot get the same character twice in a row.
        </p>
        <p v-if="randomness === IRONMAN">
          After a character is shown, they are removed from the deck until one character remains.
        </p>
        <p v-if="randomness === LAWLESS">
          No rules, purely random, may have duplicates or pick the same character multiple times in a row.
        </p>
        <p v-if="randomness === CLASSIC" class="justify">
          The old website had a proclivity of picking Doc like 90% of the time. This setting is for
          those that want <em>some nostalgia</em>.
        </p>
      </div>
    </BaseAccordion>

    <MenuItems
      v-model="background"
      :volume="volume"
      :options="[
        'animated',
        'still',
        'blue',
        'green',
        'purple',
        'black'
      ]"
    >
      Background
    </MenuItems>

    <MenuItem v-model="showImages" :volume="volume">
      Images
    </MenuItem>

    <MenuItem
      v-model="fadeWhenIdle"
      :volume="volume"
      @mouseover="showIdleExplainer = true"
      @mouseout="showIdleExplainer = false"
    >
      Fade when idle
    </MenuItem>
    <BaseAccordion :show="showIdleExplainer">
      <div class="explainer">
        <p class="justify">
          Fades out the UI if the mouse hasn't moved in the last 5 seconds.
          Prevents OBS overlays from covering gameplay.
        </p>
      </div>
    </BaseAccordion>

    <MeleeVolume v-model="volume" />
  </div>

  <TweetchLogo
    :background="background"
    :fadeOut="fadeOut"
  />

  <CornerImages
    v-if="showImages"
    :fadeOut="fadeOut"
  />
</template>

<script>
import BackgroundStage from '@/components/BackgroundStage.vue';
import BaseAccordion from '@/components/BaseAccordion.vue';
import CornerImages from '@/components/CornerImages.vue';
import MeleeTitle from '@/components/MeleeTitle.vue';
import MeleeVolume from '@/components/MeleeVolume.vue';
import MenuItem from '@/components/MenuItem.vue';
import MenuItems from '@/components/MenuItems.vue';
import TweetchLogo from '@/components/TweetchLogo.vue';

const APP_NAME = 'fknrandom';
const NORMAL = 'normal';
const CLASSIC = 'classic';
const LAWLESS = 'lawless';
const IRONMAN = 'ironman';
const ALLOWED_RANDOMNESS = [
  NORMAL,
  IRONMAN,
  LAWLESS,
  CLASSIC
];

const SPRITE_WIDTH = 136;
const SPRITE_HEIGHT = 188;
const SPRITE_RATIO = SPRITE_WIDTH / SPRITE_HEIGHT;

const OFFSET = 11.25 + (22.5 * 3);

export default {
  name: 'App',
  components: {
    BackgroundStage,
    BaseAccordion,
    CornerImages,
    MeleeTitle,
    MeleeVolume,
    MenuItem,
    MenuItems,
    TweetchLogo
  },
  data: function () {
    return {
      showRandomnessExplainer: false,
      showIdleExplainer: false,
      background: 'animated',
      showImages: true,
      randomness: NORMAL,
      fadeWhenIdle: false,
      fadeOut: false,
      lastMovement: new Date(),
      character: 'doc',
      skin: 1,
      volume: 25,
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
  constants: {
    ALLOWED_RANDOMNESS,
    CLASSIC,
    LAWLESS,
    IRONMAN,
    NORMAL,
    SPRITE_RATIO
  },
  methods: {
    getRandomSound: function (person) {
      const max = this.personSoundMap[person];
      const random = Math.ceil(Math.random() * max);
      return '/fknrandom/_sound/' + person + '/' + random + '.mp3';
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
    this.getRandomCharacters(16);
  }
};
</script>
