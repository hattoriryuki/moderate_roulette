let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let radius = 220;
let angle = 0;
let deg_count = 360;
let startFlg = false;
let stopFlg = false;
let addFlg = false;
let itemCount = 0;
let itemColor
let itemNum = 0;
let data = ["#FF597F","#8FFFBE","#8EBEFF","#FDED75"];

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const addButton = document.getElementById("addButton");
const inputText = document.getElementById("inputText");

ctx.translate(canvas.width / 2, canvas.height / 2);

drawRoullet(0);
drawTriangle();

function drawRoullet(offset) {
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
    ctx.font = '20px serif';
    ctx.fillStyle = 'black';
    ctx.fillText('アイテムを入力してください', -radius / 2 -20, 0);
    drawTriangle();
  }
  deg_count /= itemCount;
  for (let i = 0; i < itemCount; i++) {
    angle = sum_deg + offset;
    let start_deg = ((360 - angle) * Math.PI) / 180;
    let end_deg = ((360 - (angle + deg_count)) * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    if(i > 3)getColor();
    itemColor = data[i];
    ctx.fillStyle = itemColor;
    ctx.arc(0, 0, radius, start_deg, end_deg, true);
    ctx.fill();
    sum_deg += deg_count;
  }
  deg_count = 360;
}

function drawTriangle() {
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(-8, -(radius + 20));
  ctx.lineTo(8, -(radius + 20));
  ctx.closePath();
  ctx.fillStyle = "#FF4D4D";
  ctx.fill();
}

function runRoullet() {
  let deg_counter = 0;
  let count = 0;
  let timer = setInterval(function () {
    deg_counter += 26;
    if(stopFlg) {
      count++;
    }
    if (count < 200) {
      deg_counter -= count / 8;
      drawRoullet(deg_counter);
    } else {
      count = 0;
      clearInterval(timer);
      startFlg = false;
      stopFlg = false;
    }
  }, 10);
}

function onClickAdd() {
  const text = inputText.value;
  inputText.value = "";
  let color = itemColor;
  createItemList(text, color);
}

function createItemList(text, color) {
  const div = document.createElement("div");
  itemNum++;
  div.className = `item ${itemNum}`;

  const paint = document.createElement("div");
  paint.className = "paint";
  paint.style = `background-color: ${color};`;

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
    if (editFlg === 0) {
      editFlg = 1;
      editButton.innerText = "決定";
      const input = document.createElement("input");
      input.type = "text";
      input.value = editTarget.innerText;
      input.className = "item-name";
      editTarget.hidden = true;
      editItem.insertBefore(input, editButton);
    } else {
      const editedText = editItem.children[2].value;
      if (editedText === "") {
        alert("未入力の項目があります");
      } else {
        editFlg = 0;
        editButton.innerText = "編集";
        editItem.children[2].remove();
        editTarget.hidden = false;
        editTarget.innerText = editedText;
      }
    }
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "削除";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", () => {
    const deleteTarget = deleteButton.parentNode;
    let delElement = deleteTarget.classList.item(1);
    data.splice(delElement -1, 1);
    document.getElementById("inputItems").removeChild(deleteTarget);
    itemCount--;
    drawRoullet(0);
  });
  div.appendChild(paint);
  div.appendChild(p);
  div.appendChild(editButton);
  div.appendChild(deleteButton);

  document.getElementById("inputItems").appendChild(div);
}

function getColor(){
  let num = Math.floor(Math.random() * 4);
  data.push(data[num]);
}

startButton.addEventListener("click", () => {
  if (startFlg === false) {
    runRoullet();
    startFlg = true;
  } else {
    startFlg = false;
  }
});

stopButton.addEventListener("click", () => {
  if(startFlg)stopFlg = true;
});

addButton.addEventListener("click", () => {
  if(inputText.value){
    addFlg = true;
    drawRoullet(0);
    onClickAdd();
  } else {
    alert("何か入力してください");
  }
});
