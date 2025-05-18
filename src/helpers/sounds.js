const personSoundMap = Object.freeze({
  bobby: 71,
  hank: 325
});

const getRandomSound = function (person) {
  const max = personSoundMap[person];
  const random = Math.ceil(Math.random() * max);
  return '/fknrandom/_sound/' + person + '/' + random + '.mp3';
};

const getRandomBobby = function () {
  return getRandomSound('bobby');
};

const getRandomHank = function () {
  return getRandomSound('hank');
};

export const playRandomSound = function (volume) {
  const bobby = personSoundMap.bobby;
  const hank = personSoundMap.hank;
  let file;
  if (Math.round(Math.random() * (bobby + hank)) < bobby) {
    file = getRandomBobby();
  } else {
    file = getRandomHank();
  }
  let sound = new Audio(file);
  sound.volume = volume / 100;
  sound.play();
  return sound;
};
