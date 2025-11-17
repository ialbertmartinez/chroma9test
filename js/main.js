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
   
   
   let url = `https://api.openweathermap.org/data/2.5/weather?zip=${uZip},us&units=${units}&appid=${apiKey}`; // build endpoint url for api call
   try {
      // OPENWEATHER API CALL
      let weatherResponse = await fetch(url); 
      if(!weatherResponse.ok) { throw new Error(weatherResponse.status); }
      let weatherData = await weatherResponse.json(); 
     
      // console.log("weatherData: ", weatherData);
      let weatherCondition = weatherData.weather[0].main;
      console.log(weatherData);
      let swatch = getColor(weatherCondition).replace('#', '');
      let colorUrl = `https://www.thecolorapi.com/scheme?hex=${swatch}&mode=${mode}&count=5`;

      // CALL TO THE COLOR API
      let colorResponse = await fetch(colorUrl);
      if(!colorResponse.ok) { throw new Error(colorResponse.status);}
      let colorData = await colorResponse.json();
      weatherData.mode = mode;
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
   let name = weatherData.name;
   let description = weatherData.weather[0].description;

   displayMessage(`Showing ${weatherData.mode} palette for: ${description} in ${name}`, "success");
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
      
      let divEl = document.createElement("div"); // card el
      let ulEl = document.createElement('ul'); // ul element
      
      let colorProp1 = document.createElement("li");
      let colorProp2 = document.createElement("li");
      let colorProp3 = document.createElement("li");
      let colorProp4 = document.createElement("li");
      let colorProp5 = document.createElement("li");
      
      // card
      divEl.classList.add("col-sm", "card", "mb-3", "color-card");
      divEl.id = `color${i}`;
      divEl.style.background = colorData.colors[i].hex.value;
      divEl.style.color = colorData.colors[i].contrast.value;

      // list-group
      ulEl.id = "color-card-prop-list";
      ulEl.classList.add("list-group", "list-group-flush", "text-start");
      ulEl.style.color = colorData.colors[i].contrast.value;
      
      // card-list-group-items
      // NAME
      colorProp1.id = `color${i}-prop1`;
      colorProp1.style.color = colorData.colors[i].contrast.value;
      colorProp1.classList.add("list-group-item", "color-card-prop");
      colorProp1.innerHTML = `<h3>${colorData.colors[i].name.value}</h3>`
      
      // RGB
      colorProp2.id = `color${i}-prop2`;
      colorProp2.style.color = colorData.colors[i].contrast.value;
      colorProp2.classList.add("list-group-item", "color-card-prop");
      colorProp2.innerHTML = `<p><span class="color-card-prop-name">rgb:</span> ${colorData.colors[i].rgb.value}</p>`
      
      // CMYK
      colorProp3.id = `color${i}-prop3`;
      colorProp3.style.color = colorData.colors[i].contrast.value;
      colorProp3.classList.add("list-group-item", "color-card-prop");
      colorProp3.innerHTML = `<p><span class="color-card-prop-name">cmyk:</span> ${colorData.colors[i].cmyk.value}</p>`
      
      // HEX
      colorProp4.id = `color${i}-prop4`;
      colorProp4.style.color = colorData.colors[i].contrast.value;
      colorProp4.classList.add("list-group-item", "color-card-prop");
      colorProp4.innerHTML = `<p><span class="color-card-prop-name">hex:</span> ${colorData.colors[i].hex.value}</p>`

      // CONTRAST
      colorProp5.id = `color${i}-prop5`;
      colorProp5.style.color = colorData.colors[i].contrast.value;
      colorProp5.classList.add("list-group-item", "color-card-prop");
      colorProp5.innerHTML = `<p><span class="color-card-prop-name">contrast:</span> ${colorData.colors[i].contrast.value}</p>`

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
   infoDisplay.style.display = "block"
   infoDisplay.innerHTML = "";
   infoDisplay.textContent = message;
   infoDisplay.className = `message ${type} text-${type}`;
   console.log(`${message} | ${type}`);
   return message + " " + type;
   // setTimeout(() => { infoDisplay.style.display = "none"; }, 5000);
}