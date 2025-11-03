const elInput = document.querySelector(".input");
const elPiyoda = document.querySelector(".piyoda");
const elVelasiped = document.querySelector(".velasiped");
const elMashina = document.querySelector(".mashina");
const elSamalyot = document.querySelector(".samalyot");
const elButton = document.querySelector(".bt1");
let elOutput1 = document.querySelector(".output1");
let elOutput2 = document.querySelector(".output2");
let elOutput3 = document.querySelector(".output3");
let elOutput4 = document.querySelector(".output4");



// hodisa
elButton.addEventListener("click", function (qudrat) {
  qudrat.preventDefault();
  const inputValue = +elInput.value;
  console.log(inputValue);
  const piyodaValue = +elPiyoda.dataset.value;
  const velasipedValue = +elVelasiped.dataset.value;
  const mashinaValue = +elMashina.dataset.value;
  const samalyotValue = +elSamalyot.dataset.value;

  // piyoda
  let result = inputValue / piyodaValue;
  let kun = Math.floor(result / 24);
  let Soat = Math.floor(result % 24);
  let daqiqa = Math.floor((result % 1) * 60);
  elOutput1.textContent = `${kun} kun ${Soat} soat ${daqiqa} daqiqa`

  // velasiped
  result = inputValue / velasipedValue;
  kun = Math.floor(result / 24);
  Soat = Math.floor(result % 24);
  daqiqa = Math.floor((result % 1) * 60);
  elOutput2.textContent = `${kun} kun ${Soat} soat ${daqiqa} daqiqa`;

  //  mashina
  result = inputValue / mashinaValue;
  kun = Math.floor(result / 24);
  Soat = Math.floor(result % 24);
  daqiqa = Math.floor((result % 1) * 60);
  elOutput3.textContent = `${kun} kun ${Soat} soat ${daqiqa} daqiqa`;

  // samalyot
  result = inputValue / samalyotValue;
  kun = Math.floor(result / 24);
  Soat = Math.floor(result % 24);
  daqiqa = Math.floor((result % 1) * 60);
  elOutput4.textContent = `${kun} kun ${Soat} soat ${daqiqa} daqiqa`;
});
