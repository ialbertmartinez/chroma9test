// DOM Elements
const modeSelectEl = document.getElementById('mode');
const getColorsBtn = document.getElementById('get-colors-btn');
const infoDisplay = document.getElementById('info-display');
const palette = document.getElementById('palette');

getColorsBtn.addEventListener("click", fetchData);

async function fetchData(e) {
   const zipCodeEl = document.getElementById('zip');

   const apiKey = WEATHER_API_KEY;   
   let units = 'imperial';
   let mode = modeSelectEl.value;
   let uZip = zipCodeEl.value.trim();
   
   if(!isValid(uZip)) {
      displayMessage('Please enter a valid 5-digit zip code.', 'error');
   }
  
   zipCodeEl.value = ""; // input reset
   modeSelectEl.selectedIndex = 0; // select reset
   
   
   let url = `https://api.openweathermap.org/data/2.5/weather?zip=${uZip}&units=${units}&appid=${apiKey}`; // build endpoint url for api call
   try {
      // OPENWEATHER API CALL
      let weatherResponse = await fetch(url); 
      if(!weatherResponse.ok) { throw new Error(weatherResponse.status); }
      let weatherData = await weatherResponse.json(); 
     
      // console.log("weatherData: ", weatherData);
      let weatherCondition = weatherData.weather[0].main;

      let swatch = getColor(weatherCondition).replace('#', '');
      let colorUrl = `https://www.thecolorapi.com/scheme?hex=${swatch}&mode=${mode}&count=5`;

      // CALL TO THE COLOR API
      let colorResponse = await fetch(colorUrl);
      if(!colorResponse.ok) { throw new Error(colorResponse.status);}
      let colorData = await colorResponse.json();
      
      // console.log("colorData: ", colorData);
      // console.log('Weather Condition:', weatherCondition);
      // console.log('Swatch Color: ', swatch);
      // console.log('Final Color Palette:', colorData);

      // populate the DOM
      displayWeather(weatherData);
      displayPalette(colorData);

   } catch(error) {
      console.error(`Error in fetching data: ${error}`);
      displayMessage(error.message, "error");
   }
}

function isValid(val) {
   if ((!/^\d{5}$/.test(val)) || !val || val === undefined || val === "" || val === null) {
      return false;
   }
   return true;
}

function getColor(condition) {
   switch (condition) {
      case "Snow":
         return "#ffffff";
      case "Clear":
         return "#55c7f0";
      case "Clouds":
         return "#b1b5cc";
      case "Rain":
         return "#2B4D4D";
      case "Thunderstorm":
         return "#2a3454";
      case 'Mist':
      case 'Fog':
      case 'Haze':
      case 'Atmosphere':
         return '#d2d7d3';
      default:
         return '#b3c58a';
   }
}
  

function displayWeather(weatherData){
   // const weatherDisplay = document.getElementById('weather-display');
   // let tempUnit = "\u00B0F";
   let name = weatherData.name;
   // let temp = weatherData.main.temp;
   let description = weatherData.weather[0].description;
   // let currentTemp = `${temp}${tempUnit}`;
   // let iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

   // let imgEl = document.createElement('img');
   // imgEl.src = iconUrl;
   // let forecast = `${modeSelectEl.value}color palette for ${name}  ${description} - ${currentTemp}:`

   // weatherDisplay.textContent = forecast;
   displayMessage(`Showing palette for: ${description} in ${name}`);
   // weatherDisplay.appendChild(imgEl);
}

function displayPalette(colorData) {
   const colorCards = document.getElementById("color-cards");
   colorCards.innerHTML = "";
   console.log("colorData: ", colorData);
   for(let i = 0; i < 5; i++ ){
      let swatchDiv = document.getElementById(`swatch${i}`);
      swatchDiv.textContent = colorData.colors[i].hex.value;
      swatchDiv.style.background = colorData.colors[i].hex.value;
      swatchDiv.style.color = colorData.colors[i].contrast.value;
      
      let colorImgUrl = colorData.colors[i].image.named;
      let divEl = document.createElement("div"); // card el
      let ulEl = document.createElement('ul'); // ul element
      let imgEl = document.createElement('img');
      
      let colorProp1 = document.createElement("li");
      let colorProp2 = document.createElement("li");
      let colorProp3 = document.createElement("li");
      let colorProp4 = document.createElement("li");
      let colorProp5 = document.createElement("li");
      
      // card
      divEl.classList.add("col-sm", "card", "mx-1");
      divEl.style.width = "19%";
      divEl.id = `color${i}`;
      divEl.style.background = colorData.colors[i].hex.value;
      divEl.style.color = colorData.colors[i].contrast.value;
      
      // card-img
      imgEl.src = colorImgUrl;
      imgEl.alt = `image of ${colorData.colors[i].name.value}`;
      imgEl.classList.add("card-img-top");
      divEl.appendChild(imgEl);

      // list-group
      ulEl.classList.add("list-group", "list-group-flush", "text-start");
      
      // card-list-group-items
      // NAME
      colorProp1.id = `color${i}-prop1`;
      colorProp1.classList.add("list-group-item");
      colorProp1.innerHTML = `<p><strong>name:</strong> ${colorData.colors[i].name.value}</p>`
      
      // RGB
      colorProp2.id = `color${i}-prop2`;
      colorProp2.classList.add("list-group-item");
      colorProp2.innerHTML = `<p><strong>rgb:</strong> ${colorData.colors[i].rgb.value}</p>`
      
      // CMYK
      colorProp3.id = `color${i}-prop3`;
      colorProp3.classList.add("list-group-item");
      colorProp3.innerHTML = `<p><strong>cmyk:</strong> ${colorData.colors[i].cmyk.value}</p>`
      
      // HEX
      colorProp4.id = `color${i}-prop4`;
      colorProp4.classList.add("list-group-item");
      colorProp4.innerHTML = `<p><strong>hex:</strong> ${colorData.colors[i].hex.value}</p>`

      // CONTRAST
      colorProp5.id = `color${i}-prop5`;
      colorProp5.classList.add("list-group-item");
      colorProp5.innerHTML = `<p><strong>contrast:</strong> ${colorData.colors[i].contrast.value}</p>`

      ulEl.appendChild(colorProp1);
      ulEl.appendChild(colorProp2);
      ulEl.appendChild(colorProp3);
      ulEl.appendChild(colorProp4);
      ulEl.appendChild(colorProp5); // append last color property too ul
      divEl.appendChild(ulEl); // appen list to bs card  
      colorCards.appendChild(divEl);// append partent to DOM
   }
}

function displayMessage(message, type) {
   infoDisplay.innerHTML = "";
   infoDisplay.textContent = message;
   infoDisplay.className = `message ${type}`;
   setTimeout(() => { infoDisplay.style.display = "none"; }, 5000);
}