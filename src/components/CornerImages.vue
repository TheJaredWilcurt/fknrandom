<template>
  <div>
    <CornerImage
      :fadeOut="fadeOut"
      name="top-left"
      :corner="topLeft"
      @click="updateSpecificCorner('top', 'left')"
    />
    <CornerImage
      :fadeOut="fadeOut"
      name="top-right"
      :corner="topRight"
      @click="updateSpecificCorner('top', 'right')"
    />
    <CornerImage
      :fadeOut="fadeOut"
      name="bottom-left"
      :corner="bottomLeft"
      @click="updateSpecificCorner('bottom', 'left')"
    />
    <CornerImage
      :fadeOut="fadeOut"
      name="bottom-right"
      :corner="bottomRight"
      @click="updateSpecificCorner('bottom', 'right')"
    />
  </div>
</template>

<script>
import CornerImage from '@/components/CornerImage.vue';

import { imageMap } from '@/helpers/cornerData.js';

export default {
  name: 'CornerImages',
  components: {
    CornerImage
  },
  props: {
    fadeOut: {
      type: Boolean,
      required: true
    }
  },
  data: function () {
    return {
      topLeft: null,
      topRight: null,
      bottomLeft: null,
      bottomRight: null
    };
  },
  methods: {
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
};
</script>
