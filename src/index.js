let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let radius = 220;
let angle = 0;
let deg_count = 90;
let startFlg = false;
let stopFlg = false;
let itemCount = 0;
let data = [
  {
    name: "赤色",
    color: "#FF597F"
  },
  {
    name: "緑色",
    color: "#8FFFBE"
  },
  {
    name: "青色",
    color: "#8EBEFF"
  },
  {
    name: "黄色",
    color: "#FDED75"
  }
];

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const addButton = document.getElementById("addButton");
const inputText = document.getElementById("inputText");

ctx.translate(canvas.width / 2, canvas.height / 2);

drawRoullet(0);
drawTriangle();

function drawRoullet(offset) {
  let sum_deg = 0;
  
  data.forEach((e) => {
    angle = sum_deg + offset;
    let start_deg = ((360 - angle) * Math.PI) / 180;
    let end_deg = ((360 - (angle + deg_count)) * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillStyle = e.color;
    ctx.arc(0, 0, radius, start_deg, end_deg, true);
    ctx.fill();
    sum_deg += deg_count;
  });
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
  let color = data[itemCount].color;
  if(itemCount < 3){
    itemCount++;
  } else {
    itemCount = 0;
  }
  createItemList(text, color);
}

function createItemList(text, color) {
  const div = document.createElement("div");
  div.className = "item";

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
    document.getElementById("inputItems").removeChild(deleteTarget);
  });
  div.appendChild(paint);
  div.appendChild(p);
  div.appendChild(editButton);
  div.appendChild(deleteButton);

  document.getElementById("inputItems").appendChild(div);
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
  if(startFlg){
    stopFlg = true;
  }
});

addButton.addEventListener("click", () => {
  if(inputText.value){
    onClickAdd();
  } else {
    alert("何か入力してください");
  }
});
