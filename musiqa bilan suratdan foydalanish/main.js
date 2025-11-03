let img = document.querySelector("img");
let btn = document.querySelector("button");

btn.addEventListener("click", () => {
  if (img.getAttribute("src") == "img/off.png") {
    img.setAttribute("src", "img/on.png");
    btn.innerHTML = "off";
    playOn();
  } else {
    img.setAttribute("src", "img/off.png");
    btn.innerHTML = "on";
    playOff();
  }
});

let playOn = () => new Audio("audio/on.mp3").play();
let playOff = () => new Audio("audio/off.mp3").play();
