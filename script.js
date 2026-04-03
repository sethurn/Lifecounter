let players = [
  { life: 40 },
  { life: 40 }
];

function changeLife(index, amount) {
  players[index].life += amount;
  updateUI();
}

function updateUI() {
  document.querySelectorAll('.life').forEach((el, i) => {
    el.innerText = players[i].life;
  });
}

// 🎤 VOICE
const mic = document.getElementById("mic");
const output = document.getElementById("output");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

mic.onmousedown = () => recognition.start();
mic.onmouseup = () => recognition.stop();

recognition.onresult = (event) => {
  const text = event.results[0][0].transcript.toLowerCase();
  output.innerText = text;
  parseCommand(text);
};

function parseCommand(text) {
  const number = text.match(/\d+/);
  if (!number) return;

  const value = parseInt(number[0]);

  if (text.includes("gain")) {
    players[0].life += value;
  }

  if (text.includes("damage") || text.includes("take")) {
    players[1].life -= value;
  }

  if (text.includes("lifelink")) {
    players[0].life += value;
    players[1].life -= value;
  }

  updateUI();
}
