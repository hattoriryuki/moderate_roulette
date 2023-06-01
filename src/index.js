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
let data = [];
const mediaQuery = window.matchMedia('(max-width: 768px)');
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const form = document.getElementById("form");
const inputText = document.getElementById("inputText");
const initButton = document.getElementById("initButton");

if(mediaQuery.matches){
  radius = 150;
  canvas.width = 350;
  canvas.height = 350;
  fontSize = '15px serif'
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
  let editFlg = 0;
  editButton.innerText = "編集";
  editButton.className = "edit-button";
  editButton.addEventListener("click", () => {
    const editItem = editButton.parentNode;
    const editTarget = editItem.children[1];
    if (editFlg === 0){
      editFlg = 1;
      editButton.innerText = "決定";
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
        editButton.innerText = "編集";
        editItem.children[2].remove();
        editTarget.hidden = false;
        let index = data.findIndex(e => e.name === editTarget.innerText);
        data[index].name = editedText;
        editTarget.innerText = editedText;
      }
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "削除";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", () => {
    const deleteTarget = deleteButton.parentNode;
    let index = data.findIndex(e => e.color === color);
    data.splice(index, 1);
    document.getElementById("inputItems").removeChild(deleteTarget);
    itemCount--;
    drawRoullet(0);
    if(data.length < 2)startButton.disabled = true;
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
  const modalMask = document.getElementById("modalMask");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  const resultColor = document.getElementById("resultColor");
  const resultText = document.getElementById("resultText");

  resultColor.style.backgroundColor = color;
  resultText.innerHTML = text;
  modalMask.className = "mask open";
  modalContent.style.zIndex = 2;
  modalContent.style.display = "block";
  modalMask.addEventListener("click", () => modalEndEvent());
  modalClose.addEventListener("click", () => modalEndEvent());
  function modalEndEvent(){
    modalMask.className = "mask";
    modalContent.style.zIndex = -1;
    modalContent.style.display = "none";
    startButton.style.display = "block";
    stopButton.style.display = "none";
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
  if(inputText.value){
    addFlg = true;
    getRandomColor();
    onClickAdd();
    if(data.length > 1)startButton.disabled = false;
  } else{
    alert("何か入力してください");
  }
});

initButton.addEventListener("click", () => {
  const inputItems = document.getElementById("inputItems");
  while(inputItems.firstChild){
    inputItems.removeChild(inputItems.firstChild);
  }
  data = [];
  itemCount = 0;
  console.log(data);
  drawRoullet(0);
});
