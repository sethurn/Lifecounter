let players = [
  { life: 40, poison: 0 },
  { life: 40, poison: 0 },
  { life: 40, poison: 0 },
  { life: 40, poison: 0 }
];

function changeLife(i, amt) {
  players[i].life += amt;
  updateUI();
}

function updateUI() {
  document.querySelectorAll('.player').forEach((el, i) => {
    el.querySelector('.life').innerText = players[i].life;
    el.querySelector('.poison').innerText = players[i].poison;
  });
}

// 🎤 VOICE
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const mic = document.getElementById("mic");
const output = document.getElementById("output");

mic.onmousedown = () => recognition.start();
mic.onmouseup = () => recognition.stop();

recognition.onresult = (event) => {
  const text = event.results[0][0].transcript.toLowerCase();
  output.innerText = text;
  parseCommand(text);
};

function findPlayerByName(text) {
  const names = document.querySelectorAll('.name');
  for (let i = 0; i < names.length; i++) {
    if (text.includes(names[i].value.toLowerCase())) {
      return i;
    }
  }
  return null;
}

function parseCommand(text) {
  const numMatch = text.match(/\d+/);
  if (!numMatch) return;

  const value = parseInt(numMatch[0]);

  let target = findPlayerByName(text) ?? 1; // fallback

  // DAMAGE
  if (text.includes("damage") || text.includes("take")) {
    players[target].life -= value;
  }

  // GAIN
  if (text.includes("gain")) {
    players[target].life += value;
  }

  // LIFELINK (assume player 0 is speaker for now)
  if (text.includes("lifelink")) {
    players[0].life += value;
    players[target].life -= value;
  }

  // POISON
  if (text.includes("poison")) {
    players[target].poison += value;
  }

  updateUI();
}
