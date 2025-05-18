const amountOfSoundsMap = Object.freeze({
  bobby: 71,
  hank: 325
});
let playedSoundsMap = {
  bobby: [],
  hank: []
};

function resetPlayedSoundsWhenFull (person) {
  if (playedSoundsMap[person].length >= amountOfSoundsMap[person]) {
    playedSoundsMap[person] = [];
  }
}
function rollForSound (person) {
  const max = amountOfSoundsMap[person];
  const random = Math.ceil(Math.random() * max);
  return random;
}
const getRandomSound = function (person) {
  resetPlayedSoundsWhenFull(person);
  let randomSound = rollForSound(person);

  while (playedSoundsMap[person].includes(randomSound)) {
    randomSound = rollForSound(person);
  }
  playedSoundsMap[person].push(randomSound);
  return '/fknrandom/_sound/' + person + '/' + randomSound + '.mp3';
};

const getRandomBobby = function () {
  return getRandomSound('bobby');
};

const getRandomHank = function () {
  return getRandomSound('hank');
};

const logSound = function (file) {
  console.log(
    file
      .replace('/fknrandom/_sound/', 'PLAYED: ')
      .replace('hank/', 'Hank #')
      .replace('bobby/', 'Bobby #')
      .replace('.mp3', ' - ') +
    location.href +
    file.replace('/fknrandom', '')
  );
};

export const playRandomSound = function (volume, outerPlayedSoundsMap) {
  const bobby = amountOfSoundsMap.bobby;
  const hank = amountOfSoundsMap.hank;
  if (outerPlayedSoundsMap?.bobby) {
    playedSoundsMap.bobby = outerPlayedSoundsMap.bobby;
  }
  if (outerPlayedSoundsMap?.hank) {
    playedSoundsMap.hank = outerPlayedSoundsMap.hank;
  }
  let file;
  if (Math.round(Math.random() * (bobby + hank)) < bobby) {
    file = getRandomBobby();
  } else {
    file = getRandomHank();
  }

  logSound(file);
  let sound = new Audio(file);
  sound.volume = volume / 100;
  sound.play();

  return {
    playedSoundsMap,
    sound
  };
};
