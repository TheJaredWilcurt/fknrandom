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
    v-if="ironMode"
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
      'fade-out': fadeOut || (!unusedIronmanCharacters.length && ironMode),
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
    v-if="ironMode"
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
        :class="{
          'golf': randomness === IRONGOLF,
          'green-screen': ['blue', 'green'].includes(background)
        }"
      >
        <div
          class="mini-character"
          :style="[
            'background-position:',
            'calc((var(--sprite-width) * -' + (card.skin - 1) + ') - ' + ((card.skin * SPRITE_RATIO) * (3 * SPRITE_RATIO)) + 'px)',
            'calc((var(--sprite-height) * -' + card.index + ') - 1px)'
          ].join(' ')"
        >
          <template v-if="randomness === IRONGOLF">
            <button
              class="increment"
              @click="ironGolfScores[card.character]++"
            >
              Increment {{ card.character }} Score
            </button>
            <button
              class="decrement"
              :disabled="ironGolfScores[card.character] < 2"
              @click="decrementScore(card.character)"
            >
              Increment {{ card.character }} Score
            </button>
          </template>
        </div>
        <div
          v-if="randomness === IRONGOLF"
          class="golf-score"
        >
          {{ ironGolfScores[card.character] }}
        </div>
      </div>
    </TransitionGroup>
  </div>

  <div
    v-if="randomness === IRONGOLF && !confirmation"
    class="score-board"
  >
    <div class="score-board-title">
      <div style="width: 159px;">
        <div class="compressed">
          PERSONAL BEST:
        </div>
      </div>
      <span>
        0
      </span>
      <button
        class="clear-score"
        @click="showConfirmation"
      >
        <svg
          class="trash"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        Clear PB
      </button>
    </div>
    <div class="score-board-content">
      <div>
        <strong>Current:</strong>
        0
      </div>
      <div>
        <strong>Best possible:</strong>
        0
      </div>
    </div>
  </div>

  <div
    v-if="confirmation"
    class="confirmation score-board"
  >
    <div class="score-board-title compressed">
      You sho 'bout dat?
    </div>
    <div class="confirmation-options score-board-content">
      <button class="cancel" @click="confirmation = false">
        nah, we good
      </button>
      <button class="confirm" @click="clearPersonalBest">
        yes, delete my PB
      </button>
    </div>
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
        <p v-if="randomness === IRONGOLF">
          Same as Ironman, except you can keep track of how many attempts it took on each character.
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

    <MeleeVolume
      :modelValue="volume"
      @update:modelValue="updatePlayingSoundVolume"
    />
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

import { playRandomSound } from '@/helpers/sounds.js';

const APP_NAME = 'fknrandom';
const NORMAL = 'normal';
const CLASSIC = 'classic';
const LAWLESS = 'lawless';
const IRONGOLF = 'irongolf'
const IRONMAN = 'ironman';
const ALLOWED_RANDOMNESS = [
  NORMAL,
  IRONMAN,
  IRONGOLF,
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
      confirmation: false,
      lastMovement: new Date(),
      character: 'doc',
      skin: 1,
      volume: 25,
      currentSound: null,
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
      ironGolfScores: {
        'doc': 1,
        'mario': 1,
        'luigi': 1,
        'bowser': 1,
        'peach': 1,
        'yoshi': 1,
        'dk': 1,
        'falcon': 1,
        'gannon': 1,
        'falco': 1,
        'fox': 1,
        'ness': 1,
        'icies': 1,
        'kirby': 1,
        'samus': 1,
        'zelda': 1,
        'link': 1,
        'young-link': 1,
        'pichu': 1,
        'pikachu': 1,
        'puff': 1,
        'mewtwo': 1,
        'game-and-watch': 1,
        'marth': 1,
        'roy': 1,
        'sheik': 1
      },
      usedIronmanCharacters: [],
      spinLocation: (-1 * OFFSET),
      randomCards: [],
      playedSoundsMap: {
        bobby: [],
        hank: []
      }
    };
  },
  constants: {
    ALLOWED_RANDOMNESS,
    CLASSIC,
    LAWLESS,
    IRONGOLF,
    IRONMAN,
    NORMAL,
    SPRITE_RATIO
  },
  methods: {
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
        [IRONMAN]: this.getIronmanRandomCharacter,
        [IRONGOLF]: this.getIronmanRandomCharacter
      };
      if (!this.unusedIronmanCharacters.length) {
        randomnessFunctionMap[IRONMAN] = this.getNormalRandomCharacter;
        randomnessFunctionMap[IRONGOLF] = this.getNormalRandomCharacter;
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
    decrementScore: function (character) {
      if (this.ironGolfScores[character] > 1) {
        this.ironGolfScores[character] = this.ironGolfScores[character] - 1;
      }
    },
    resetGolfScores: function () {
      for (let character in this.ironGolfScores) {
        this.ironGolfScores[character] = 0;
      }
    },
    rollForCharacter: function () {
      if (
        !this.unusedIronmanCharacters.length &&
        this.ironMode
      ) {
        this.usedIronmanCharacters = [];
        this.resetGolfScores();
        this.getRandomCharacters(16)
        return;
      }
      const randomSoundResponse = playRandomSound(this.volume, this.playedSoundsMap);
      this.currentSound = randomSoundResponse.sound;
      this.playedSoundsMap = randomSoundResponse.playedSoundsMap;
      this.spinLocation = this.spinLocation - 180;
      this.getRandomCharacters(8);
      this.markIronmanCharacterAsUsed();
    },
    updatePlayingSoundVolume: function (volume) {
      this.volume = volume;
      if (this.currentSound) {
        this.currentSound.volume = volume / 100;
      }
    },
    markIronmanCharacterAsUsed: function () {
      if (this.ironMode) {
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
    showConfirmation: function () {
      let file = '/fknrandom/_sound/you-sho-bout-dat.mp3';
      let sound = new Audio(file);
      sound.volume = this.volume / 100;
      sound.play();
      this.confirmation = true;
    },
    clearPersonalBest: function () {
      this.confirmation = false;
      console.log('STUB');
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
        if (settings.playedSoundsMap?.bobby) {
          this.playedSoundsMap.bobby = settings.playedSoundsMap.bobby || [];
        }
        if (settings.playedSoundsMap?.hank) {
          this.playedSoundsMap.hank = settings.playedSoundsMap.hank || [];
        }
        if (settings.ironGolfScores) {
          this.ironGolfScores = settings.ironGolfScores || {};
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
    ironMode: function () {
      return [IRONMAN, IRONGOLF].includes(this.randomness);
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
        playedSoundsMap: this.playedSoundsMap || {},
        usedIronmanCharacters: this.usedIronmanCharacters || [],
        ironGolfScores: this.ironGolfScores || {},
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
