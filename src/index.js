let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let radius = 220;
let angle = 0;
let deg_count = 90;
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

ctx.translate(canvas.width / 2, canvas.height / 2);

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

drawRoullet(0);
drawTriangle();
