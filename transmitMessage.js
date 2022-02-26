const WebSocket = require("ws");

const secondArgument = Number(process.argv[3]);
const thirdArgument = Number(process.argv[4]);

// repeat the message every n milliseconds
const EVERY_N_MS =
  !secondArgument || Number.isNaN(secondArgument) ? 60 * 1000 : secondArgument;

// 50 ms, according to wikipedia, but let's make it easy to parse
const TIME_UNIT_LENGTH =
  !thirdArgument || Number.isNaN(thirdArgument) ? 300 : thirdArgument;

const message = process.argv[2] || "tjwds";

// simple hack:  use '+' to indicate letter is over
const lettersToMorse = {
  A: ".-+",
  B: "-...+",
  C: "-.-.+",
  D: "-..+",
  E: ".+",
  F: "..-.+",
  G: "--.+",
  H: "....+",
  I: "..+",
  J: ".---+",
  K: "-.-+",
  L: ".-..+",
  M: "--+",
  N: "-.+",
  O: "---+",
  P: ".--.+",
  Q: "--.-+",
  R: ".-.+",
  S: "...+",
  T: "-+",
  U: "..-+",
  W: ".--+",
  X: "-..-+",
  Y: "-.--+",
  Z: "--..+",
  " ": " ",
};

const wait = function (timeUnit) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeUnit * TIME_UNIT_LENGTH);
  });
};

/* The length of a dot is 1 time unit.
A dash is 3 time units.
The space between symbols (dots and dashes) of the same letter is 1 time unit.
The space between letters is 3 time units.
The space between words is 7 time units.*/

const transmitCharacter = async function (character, toggleLight) {
  console.log(character);
  if (character === " ") {
    // 7 - proceeding 3 tu for end of letter
    await wait(4);
  } else if (character === "-") {
    toggleLight();
    await wait(3);
    toggleLight();
    await wait(1);
  } else if (character === ".") {
    toggleLight();
    await wait(1);
    toggleLight();
    await wait(1);
  } else if (character === "+") {
    // 3 tu - 1 tu symbol separator
    await wait(2);
  }
};

let lightIsOn = true;

const transmitMessage = async function (string, toggleLight) {
  // make sure the light starts off off
  if (lightIsOn) {
    toggleLight();
    await wait(1);
  }
  // convert our string to morse code
  const letters = string.toUpperCase().split("");
  const morse = letters.map((letter) => lettersToMorse[letter]);
  // translate morse code to send actions and execute
  for (let i = 0; i < morse.length; i++) {
    console.log(letters[i]);
    const instructions = morse[i].split("");
    for (let j = 0; j < instructions.length; j++) {
      await transmitCharacter(instructions[j], toggleLight);
    }
  }
  // be polite, leave on the light
  await wait(4);
  toggleLight();
};

const ws = new WebSocket("wss://www.jakobmaier.at/lamp_ws");

ws.on("open", () => {
  const doIt = () => {
    transmitMessage(message, () => ws.send(`{"action":"plus"}`));
  };

  doIt();
  setInterval(() => {
    doIt();
  }, EVERY_N_MS);
});

ws.on("message", async function incoming(data) {
  try {
    const message = JSON.parse(data.toString());
    // even means it's off
    if (message.type === "state") {
      lightIsOn = !(message.value % 2);
    }
  } catch (e) {}
});
