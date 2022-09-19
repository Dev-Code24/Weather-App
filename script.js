const container = document.querySelector(`.container`);
inputPart = container.querySelector(`.input-part`);
infoTxt = inputPart.querySelector(`.info-txt`);
inputField = inputPart.querySelector(`input`);
locationBtn = inputPart.querySelector(`button`);
wIcon = document.querySelector(`.weather-part img`);
arrowBack = container.querySelector(`header i`);
let api;
inputField.addEventListener(`keyup`, (e) => {
  if (e.key == `Enter` && inputField.value != ``) {
    requestApi(inputField.value);
  }
});
locationBtn.addEventListener(`click`, () => {
  if (navigator.geolocation) {
    // if browser support geolocation apu
    navigator.geolocation.getCurrentPosition(onSucces, onError);
  } else {
    alert(`Your browser does not support geolocation api`);
  }
});

function onSucces(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=cfb286c656e2aa00aa0168a9da51d164`;
}
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("pending");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cfb286c656e2aa00aa0168a9da51d164`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = `Getting weather details`;
  infoTxt.classList.add("pending");
  // getting api response and returnign it wiht parsing into js obj and in another
  // then function calling weatherDetails function with passing api result as an argument
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  infoTxt.classList.replace("pending", `error`);
  if (info.cod == `404`) {
    infoTxt.innerText = `${inputField.value} isn't a valid city`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;
    //using cutsom icons according to the id which api returns
    if (id == 800) {
      wIcon.src = `images/clear.png`;
    } else if (id >= 200 && id <= 232) {
      wIcon.src = `images/storm.png`;
    } else if (id >= 600 && id <= 622) {
      wIcon.src = `images/snow.png`;
    } else if (id >= 701 && id <= 781) {
      wIcon.src = `images/haze.png`;
    } else if (id >= 801 && id <= 804) {
      wIcon.src = `images/clouds.png`;
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = `images/rain.png`;
    }

    container.querySelector(`.temp .number`).innerText = temp;
    container.querySelector(`.weather`).innerText = description;
    container.querySelector(`.location span`).innerText = `${city} , ${country}`;
    container.querySelector(`.temp .number-2`).innerText = feels_like;
    container.querySelector(`.humidity span`).innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", `error`);
    container.classList.add(`active`);
    // console.log(info);
  }
}

arrowBack.addEventListener(`click`, () => {
  container.classList.remove(`active`);
});
