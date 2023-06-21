let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let radius = 220;
let angle = 0;
let current_deg = 0;
let deg_part = 0;
let fontSize = '20px serif';
let stopFlg = false;
let addFlg = false;
let itemCount = 0;
let colorCount = 0;
let itemColor;
let installPromptEvent;
let data = [];
const mediaQuery = window.matchMedia('(max-width: 768px)');
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const addButton = document.getElementById("addButton");
const form = document.getElementById("form");
const inputText = document.getElementById("inputText");
const initButton = document.getElementById("initButton");
const shareButton = document.getElementById("shareButton");
const modalMask = document.getElementById("modalMask");
const termsButton = document.getElementById("termsButton");
const inputTitle = document.getElementById("inputTitle");
const inputItems = document.getElementById("inputItems");
const installButton = document.getElementById("installButton");

if(mediaQuery.matches){
  radius = 150;
  canvas.width = 350;
  canvas.height = 350;
  fontSize = '15px serif';
}

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test( userAgent );
}
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
const isSafari = () => {
  const safari = window.navigator.userAgent;
  return /Safari/.test(safari);
}

if (isIos() && isSafari() && !isInStandaloneMode()) {
  const iosPrompt = document.getElementById("iosPrompt");
  const promptClose = document.getElementById("promptClose");
  iosPrompt.style.display = "flex";
  iosPrompt.style.zIndex = 10;
  promptClose.addEventListener("click", () => {
    iosPrompt.style.display = "none";
    iosPrompt.style.zIndex = 0;
  });
}

ctx.translate(canvas.width / 2, canvas.height / 2);

drawRoullet(0);
drawTriangle();

function drawRoullet(offset){
  let sum_deg = 0;
  if(addFlg === true){
    addFlg = false;
    itemCount++;
  }
  if(itemCount === 0){
    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(0, 0, radius,0 * Math.PI / 180, 360 * Math.PI / 180);
    ctx.stroke();
    ctx.font = fontSize;
    ctx.fillStyle = 'black';
    ctx.fillText('アイテムを入力してください', -radius / 2 -20, 0);
    drawTriangle();
  }
  deg_part = 360 / itemCount;
  for(let i = 0; i < itemCount; i++){
    angle = sum_deg + offset + 90;
    let start_deg = (360 - angle) * Math.PI / 180;
    let end_deg = ((360 - (angle + deg_part)) * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillStyle = data[i].color;
    ctx.arc(0, 0, radius, start_deg, end_deg, true);
    ctx.fill();
    sum_deg += deg_part;
  }
  current_deg = offset % 360;
}

function drawTriangle(){
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(-8, -(radius + 20));
  ctx.lineTo(8, -(radius + 20));
  ctx.closePath();
  ctx.fillStyle = "#FF4D4D";
  ctx.fill();
}

function runRoullet(){
  let deg_counter = 0;
  let count = 0;
  let timer = setInterval(function(){
    deg_counter += 26;
    if(stopFlg){
      count++;
    }
    if(count < 200){
      deg_counter -= count / 8;
      drawRoullet(deg_counter);
    }else{
      count = 0;
      clearInterval(timer);
      stopFlg = false;
      endEvent();
    }
  }, 10);

  const endEvent = function(){
    let sum = 0;
    let reversed = [...data].reverse();
    let color;
    let text;
    for(let i = 0; i < data.length; i++){
      if(
        deg_part * sum < current_deg &&
        current_deg < deg_part * (sum + 1)
      ){
        color = reversed[i].color;
        text = reversed[i].name;
        break;
      }
      sum++;
    }
    setTimeout(() => modalOpen(color, text), 1000);
  }
}

function onClickAdd(){
  const text = inputText.value;
  let color = itemColor;
  let judge = data.some(e => e.name === text);
  if(judge){
    alert("同じアイテムは登録できません");
  } else{
    data.push({name: text, color: color});
    inputText.value = "";
    createItemList(text, color);
    drawRoullet(0);
  }
}

function createItemList(text, color){
  const div = document.createElement("div");
  div.className = "item";

  const paint = document.createElement("div");
  paint.className = "paint";
  paint.style.backgroundColor = color;

  const p = document.createElement("p");
  p.innerText = text;
  p.className = "item-name";
  const editButton = document.createElement("button");
  const editIcon = document.createElement("i");
  const confirmIcon = document.createElement("i");
  confirmIcon.className = "fa-regular fa-circle-check confirm";
  confirmIcon.style.color = "lightgreen";
  editIcon.className = "fa-solid fa-pen"
  editButton.className = "edit-button";
  editButton.appendChild(editIcon);
  let editFlg = 0;
  editButton.addEventListener("click", () => {
    const editItem = editButton.parentNode;
    const editTarget = editItem.children[1];
    if (editFlg === 0){
      editFlg = 1;
      editButton.removeChild(editIcon);
      editButton.appendChild(confirmIcon);
      const input = document.createElement("input");
      input.type = "text";
      input.value = editTarget.innerText;
      input.className = "item-name";
      editTarget.hidden = true;
      editItem.insertBefore(input, editButton);
    } else{
      const editedText = editItem.children[2].value;
      if (editedText === ""){
        alert("未入力の項目があります");
      } else{
        editFlg = 0;
        editButton.removeChild(confirmIcon);
        editButton.appendChild(editIcon);
        editItem.children[2].remove();
        editTarget.hidden = false;
        let index = data.findIndex(e => e.name === editTarget.innerText);
        data[index].name = editedText;
        editTarget.innerText = editedText;
      }
    }
  });

  const deleteButton = document.createElement("button");
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa-regular fa-trash-can";
  deleteButton.appendChild(deleteIcon);
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", () => {
    const deleteTarget = deleteButton.parentNode;
    let index = data.findIndex(e => e.color === color);
    data.splice(index, 1);
    document.getElementById("inputItems").removeChild(deleteTarget);
    itemCount--;
    drawRoullet(0);
    if(data.length < 2){
      startButton.disabled = true;
      startButton.style.color = "rgb(185, 183, 183)";
      startButton.style.cursor = "default";
    }
  });
  div.appendChild(paint);
  div.appendChild(p);
  div.appendChild(editButton);
  div.appendChild(deleteButton);
  document.getElementById("inputItems").appendChild(div);
}

function getRandomColor(){
  let num;
  colorCount++;
  num = 360 / colorCount;
  num += Math.random();
  switch(true){
    case colorCount > 9:
      colorCount = 1;
      break;
    case colorCount % 2 === 0:
      num = num * (colorCount - 1);
      break;
    case colorCount % 3 === 0:
      num = 90 * (Math.random() * (2 - 1) + 1); 
      break;
    default:
      break;
  }
  itemColor = `hsl(${num}, 100%, 50%)`;
}

function modalOpen(color, text){
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  const resultColor = document.getElementById("resultColor");
  const resultText = document.getElementById("resultText");
  const modalTitle = document.getElementById("modalTitle");

  if(inputTitle.value != ""){
    modalTitle.innerHTML = `${inputTitle.value}に選ばれたのは...`;
  } else {
    modalTitle.innerHTML = "選ばれたのは...";
  }
  resultColor.style.backgroundColor = color;
  resultText.innerHTML = text;
  modalMask.className = "mask open";
  modalContent.style.zIndex = 2;
  modalContent.style.display = "block";
  modalMask.addEventListener("click", modalEndEvent);
  modalClose.addEventListener("click", modalEndEvent);
  function modalEndEvent(){
    modalMask.className = "mask";
    modalContent.style.zIndex = -1;
    modalContent.style.display = "none";
    startButton.style.display = "block";
    stopButton.style.display = "none";
  }
}

function itemAddEvent(){
  if(inputText.value){
    addFlg = true;
    getRandomColor();
    onClickAdd();
    if(data.length > 1){
      startButton.disabled = false;
      startButton.style.color = "#67EB3C";
      startButton.style.cursor = "pointer";
    }
  } else{
    alert("何か入力してください");
  }
}

function termsModal(){
  const termsContent = document.getElementById("termsContent");
  const termsClose = document.getElementById("termsClose");
  modalMask.className = "mask open";
  termsContent.style.zIndex = 10;
  termsContent.style.display = "block";
  modalMask.addEventListener("click", termsCloseEvent);
  termsClose.addEventListener("click", termsCloseEvent);

  function termsCloseEvent(){
    modalMask.className = "mask";
    termsContent.style.zIndex = -1;
    termsContent.style.display = "none";
  }
}

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  stopButton.style.display = "block";
  drawRoullet(0);
  runRoullet();
});

stopButton.addEventListener("click", () => stopFlg = true);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  itemAddEvent();
});

addButton.addEventListener("click", () => itemAddEvent());

initButton.addEventListener("click", () => {
  if(confirm("ルーレットをリセットしますか？")){
    while(inputItems.firstChild){
      inputItems.removeChild(inputItems.firstChild);
    }
    inputTitle.value = "";
    data = [];
    itemCount = 0;
    drawRoullet(0);
  }
});

shareButton.addEventListener("click", () => {
  const text = resultText.innerText;
  let shareContent;
  if(inputTitle.value != ""){
    shareContent = `${inputTitle.value}に`;
  } else {
    shareContent = "今回ルーレットで";
  }
  const url = `http://twitter.com/share?url=https://moderate-roullet.web.app/
    &text=${shareContent}選ばれたのは、「 ${text} 」でした！
    &hashtags=ModerateRoullet`;
  shareButton.setAttribute("href", url);
});

termsButton.addEventListener("click", termsModal);

inputTitle.addEventListener("mouseover", () => {
  const titleMessage = document.getElementById("titleMessage");
  titleMessage.innerHTML = "※入力は任意です";
  titleMessage.style = "margin: 0; padding: 0; color: gray; font-size: small;";
  inputTitle.addEventListener("mouseleave", ()=> {
    titleMessage.innerHTML = "";
    titleMessage.style = "height: 18px;";
  });
});

window.addEventListener('beforeinstallprompt', function(event) {
  event.preventDefault();
  installPromptEvent = event;
  installButton.hidden = false;
  return false;
});

installButton.addEventListener("click", () => {
  if (installPromptEvent){
    installPromptEvent.prompt();
    installPromptEvent.userChoice.then(function(choiceResult){
      if (!(choiceResult.outcome === 'dismissed')){
        window.alert('Thank You!');
        installButton.hidden = true;
      }
    });
    installPromptEvent = null;
  }
});
