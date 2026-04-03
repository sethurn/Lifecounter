let numPlayers=4;
const playerArea=document.getElementById("player-area");
const playerCards=[], players=[], colors=["#fef1c7","#c7e0f2","#d4c7f2","#f2c7c7"];

function createPlayers(count){
  playerArea.innerHTML=""; players.length=0; playerCards.length=0;
  for(let i=0;i<count;i++){
    players.push({life:40,poison:0,commander:0});
    const card=document.createElement("div");
    card.className="player-card"; card.style.background=colors[i%colors.length];
    card.innerHTML=`
      <input value="Player ${i+1}" class="name">
      <div class="life">${players[i].life}</div>
      <div class="controls">
        <button onclick="changeLife(${i},-1)">-</button>
        <button onclick="changeLife(${i},1)">+</button>
      </div>
      <div class="counters">☠️ <span class="poison">0</span> 🗡️ <span class="commander">0</span></div>`;
    playerArea.appendChild(card); playerCards[i]=card;
  }
  positionPlayers();
}

function positionPlayers(){
  const positions={
    2:[{top:"30%", left:"25%"},{top:"30%", left:"calc(100% - 175px)"}],
    3:[{top:"15%", left:"10%"},{top:"15%", left:"calc(100% - 175px)"},{top:"calc(100% - 190px)", left:"calc(50% - 75px)"}],
    4:[{top:"5%", left:"5%"},{top:"5%", left:"calc(100% - 155px)"},{top:"calc(100% - 190px)", left:"5%"},{top:"calc(100% - 190px)", left:"calc(100% - 155px)"}]
  };
  playerCards.forEach((c,i)=>{ c.style.top=positions[numPlayers][i].top; c.style.left=positions[numPlayers][i].left; });
}

function changeLife(i,amt){ players[i].life+=amt; updateUI(); }
function updateUI(){ playerCards.forEach((c,i)=>{ c.querySelector(".life").innerText=players[i].life; c.querySelector(".poison").innerText=players[i].poison; c.querySelector(".commander").innerText=players[i].commander; }); }

createPlayers(numPlayers);
function updatePlayerCount(val){ numPlayers=parseInt(val); createPlayers(numPlayers); }

// Voice recognition
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
const recognition=new SpeechRecognition();
const mic=document.getElementById("mic");
const output=document.getElementById("voice-output");
mic.onmousedown=()=>recognition.start();
mic.onmouseup=()=>recognition.stop();
recognition.onresult=(e)=>{ const text=e.results[0][0].transcript.toLowerCase(); output.innerText=text; parseCommand(text); }

function findPlayerByName(text){ for(let i=0;i<players.length;i++){ const name=playerCards[i].querySelector(".name").value.toLowerCase(); if(text.includes(name)) return i; } return null; }

function parseCommand(text){
  const num=text.match(/\d+/); if(!num) return; const value=parseInt(num[0]);
  const target=findPlayerByName(text) ?? 0;
  if(text.includes("damage")||text.includes("take")) players[target].life-=value;
  if(text.includes("gain")) players[target].life+=value;
  if(text.includes("lifelink")){ players[0].life+=value; players[target].life-=value; }
  if(text.includes("poison")) players[target].poison+=value;
  if(text.includes("commander")) players[target].commander+=value;
  updateUI();
}

// Save/load/reset
function saveGame(){ localStorage.setItem("mtgGame",JSON.stringify(players)); alert("Game Saved"); }
function loadGame(){ const data=localStorage.getItem("mtgGame"); if(data){ const saved=JSON.parse(data); for(let i=0;i<saved.length;i++){ players[i].life=saved[i].life; players[i].poison=saved[i].poison; players[i].commander=saved[i].commander; } updateUI(); alert("Game Loaded"); } else alert("No saved game"); }
function resetGame(){ players.forEach(p=>{p.life=40;p.poison=0;p.commander=0;}); updateUI(); }
