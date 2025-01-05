//initail declarations
let query = '';
const dataList = document.getElementById('cities');
const CityName = document.getElementById('city-name');
const dayName = document.getElementById('day-name');
const WindSpeed = document.getElementById('wind');
const HumidityValue = document.getElementById('humidity');
const PressureValue = document.getElementById('pressure');
const CurrentTemp = document.getElementById('currenttemp');
const ConditionDesc = document.getElementById('condition');
const ConditionIcon = document.getElementById('conditionicon');
const MinTemp = document.getElementById('mintemp');
const MaxTemp = document.getElementById('maxtemp');
const DayName = document.getElementById('dayname');
const ForeCast = document.getElementById('forecast');
const FirstCity = document.getElementById('firstcity');
const SecondCity = document.getElementById('secondcity');
const FavBtn = document.getElementById('favBtn');
const HeartIcon = document.getElementById('heartIcon');
const FavContainer = document.getElementById('favcontainer');
const loader = document.getElementById("loader-container");
const comparecard = document.getElementById("comparecard");
const errormsg = document.getElementById("errormsg");
const compareloader = document.getElementById("compareloader");
isFavorited = false;
let CitiesArray = [];


//icons for limited weather conditions
const weatherIcons = {
    0: "fa-sun",
    1: "fa-sun",
    2: "fa-cloud-sun",
    3: "fa-cloud",
    45: "fa-smog",
    48: "fa-smog",
    51: "fa-cloud-rain",
    53: "fa-cloud-rain",
    55: "fa-cloud-showers-heavy",
    61: "fa-cloud-showers-heavy",
    63: "fa-cloud-showers-heavy",
    65: "fa-cloud-showers-heavy",
    95: "fa-bolt",
    96: "fa-bolt",
    99: "fa-bolt",
};

//color codes for limited weather icons
const weatherIconsColors = {
    0: "#e4ea67",
    1: "#e4ea67",
    2: "#dba906",
    3: "#6cede5",
    45: "#06dbd0",
    48: "#06dbd0",
    51: "#0694db",
    53: "#0694db",
    55: "#06b8db",
    61: "#06b8db",
    63: "#06b8db",
    65: "#06b8db",
    95: "#2d4b51",
    96: "#2d4b51",
    99: "#2d4b51",
};

//default weather condition icon when exact one is not available
const defaultIcon = "fa-cloud";
const defaultColor = "#808080";


class WeatherData {
    constructor() {

    }
    //fetch latitude longitude values
    async getLatLong(SearchInput) {
        const responseLatLon = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${SearchInput}&key=13d9564b6c1d4441997b0624ea9c5255`);
        if (!responseLatLon.ok) {
            throw new Error(`HTTP error! status: ${responseLatLon.status}`);
        }
        const dataLatLon = await responseLatLon.json();
        const lat = dataLatLon.results[0].geometry.lat;
        const lon = dataLatLon.results[0].geometry.lng;
        return { lat, lon };
    }

    //fetch current weather data
    async GetCurrentWeather(lat, lon) {
        debugger;
        const responseCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c20dfa1be7720c512a7ef191810746a0&units=metric`);
        if (!responseCurrent.ok) {
            throw new Error(`HTTP error! status: ${responseCurrent.status}`);
        }
        const dataCurrent = await responseCurrent.json();
        return dataCurrent;
    }

    //fetch seven-day forecast data
    async GetSevenDayForecast(lat, lon) {
        const responseSeven = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&temperature_unit=celsius`);
        if (!responseSeven.ok) {
            throw new Error(`HTTP error! status: ${responseSeven.status}`);
        }
        const dataSeven = await responseSeven.json();
        loader.style.display = "none";
        return dataSeven;
    }
}

class FavoriteCities {
    constructor() {
        this.FavArray = JSON.parse(localStorage.getItem('FavoriteCitiesArr')) || [];
    }

    addCity(city) {
        debugger;
        if (!this.FavArray.includes(city)) {
            this.FavArray.push(city);
            this.saveFavorites();
            this.showFavCities(this.FavArray);
        }
    }

    removeCity(city) {
        debugger;
        this.FavArray = this.FavArray.filter(favCity => favCity !== city);
        this.saveFavorites();
        this.showFavCities(this.FavArray);
    }

    saveFavorites() {
        localStorage.setItem('FavoriteCitiesArr', JSON.stringify(this.FavArray));
    }

    getFavorites() {
        return this.FavArray;
    }

    isFavorite(city) {
        return this.FavArray.includes(city);
    }

    showFavCities(FavArray) {
        debugger;
        if (FavArray.length > 0) {
            document.getElementById('fav-alternate').innerHTML = '';
        }
        else {
            document.getElementById('fav-alternate').innerHTML = 'Mark cities as favorite from search bar to access easily';
        }

        while (FavContainer.firstChild) {
            FavContainer.removeChild(FavContainer.firstChild);
        }
        for (let i = 0; i < FavArray.length; i++) {
            const newdiv = document.createElement('div');
            const newcity = document.createElement('a');
            newcity.classList.add('favorite-badge');
            newcity.textContent = FavArray[i];

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
            removeBtn.classList.add('remove-btn');
            removeBtn.addEventListener('click', () => {
                debugger;
                FavCities.removeCity(FavArray[i]);
                if (FavArray[i].trim() === query.trim()) {
                    HeartIcon.classList.remove('fas');
                    HeartIcon.classList.add('far');
                }
            })
            newcity.addEventListener('click', () => {
                clearSearchAndUI();
                getAllValues(FavArray[i]);
            })
            newdiv.appendChild(newcity);
            newdiv.appendChild(removeBtn);

            FavContainer.appendChild(newdiv);
        }
    }
}


//initialising object
const FavCities = new FavoriteCities();
const weatherdata = new WeatherData();
this.GetAllCountries();



// search bar related functionalities start
searchInput.addEventListener("focus", () => {
    renderDropdown(CitiesArray);
    dataList.classList.add("show");
    if (searchInput.value) {
        clearBtn.style.display = "block";
    }
});

// Handle input event for filtering
searchInput.addEventListener("input", (e) => {
    query = e.target.value.trim();
    if (query !== "") {
        dataList.classList.add("show");
        clearBtn.style.display = "block";
        if (CitiesArray.includes(query)) {
            favBtn.style.display = "block";
            if (FavCities.FavArray.some(item => item.trim() === query)) {
                debugger;
                console.log('entering')
                isFavorited = true;
                HeartIcon.classList.remove('far');
                HeartIcon.classList.add('fas');
            }
            getAllValues(query);
        }
    } else {
        clearBtn.style.display = "none";
        dataList.classList.remove("show");
    }
    const filtered = filterCities(query);
    renderDropdown(filtered);
});

// Clear the search input
clearBtn.addEventListener("click", () => {
    debugger;
    clearSearchAndUI();
});


// handle fav button clicks
FavBtn.addEventListener('click', function () {
    debugger;
    isFavorited = FavCities.isFavorite(query);
    if (isFavorited) {
        HeartIcon.classList.remove('fas');
        HeartIcon.classList.add('far');
        FavCities.removeCity(query);
    }
    else {
        FavCities.addCity(query);
        HeartIcon.classList.remove('far');
        HeartIcon.classList.add('fas');

    }
})

//clear the search input
function clearSearchAndUI() {
    debugger;
    searchInput.value = "";
    isFavorited = false;
    clearBtn.style.display = "none";
    FavBtn.style.display = "none";
    HeartIcon.classList.remove('fas');
    HeartIcon.classList.add('far');
    dataList.classList.remove("show");
}

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
    debugger;

    if (!e.target.closest(".search-container")) {
        dataList.classList.remove("show");
    }
});
// search bar related functionalities end



//show all cities when city compare field is clicked
FirstCity.addEventListener("focus", () => {
    renderDropdown(CitiesArray);
    dataList.classList.add("show");
});



//load all dashboard values
async function getAllValues(query) {
    debugger;
    CityName.innerHTML = `Results for <span class="fw-bold" >${query}</span>`;
    loader.style.display = "flex";
    const { lat, lon } = await weatherdata.getLatLong(query);
    const data = await weatherdata.GetCurrentWeather(lat, lon);
    // Update current weather details
    WindSpeed.innerHTML = data.wind.speed;
    HumidityValue.innerHTML = data.main.humidity;
    PressureValue.innerHTML = data.main.pressure;
    CurrentTemp.innerHTML = data.main.temp;
    ConditionDesc.innerHTML = data.weather[0].description;
    const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    ConditionIcon.src = iconURL;
    const forecastData = await weatherdata.GetSevenDayForecast(lat, lon);
    // Update 7-day forecast
    let FinalHTML = '';
    for (let i = 0; i < 7; i++) {
        const currentDate = forecastData.daily.time[i];
        const iconcode = forecastData.daily.weather_code[i];
        const date = new Date(currentDate);
        const CurrentDay = date.toLocaleString('en-US', { weekday: 'long' }).slice(0, 3);
        const icon = weatherIcons[iconcode] || defaultIcon;
        const color = weatherIconsColors[iconcode] || defaultColor;
        FinalHTML += `
         <div class="card forecast-card">
             <small class="mb-2" id="dayname">${CurrentDay}</small>
             <i class="fas ${icon} mb-3" style="color: ${color}; font-size: 50px;"></i>
             <small class="font-size-8">
                 <span id="mintemp">${forecastData.daily.temperature_2m_min[i]}</span>/
                 <span id="maxtemp">${forecastData.daily.temperature_2m_max[i]}</span>
             </small>
         </div>`;
    }
    ForeCast.innerHTML = FinalHTML;
}



//fetch all countries data
async function GetAllCountries() {
    console.log('savedfavs', FavCities.FavArray)
    const responseCountries = await fetch(`https://countriesnow.space/api/v0.1/countries`);
    if (!responseCountries.ok) {
        throw new Error(`HTTP error! status: ${responseCountries.status}`);
    }
    const cityCountries = await responseCountries.json();
    if (cityCountries && cityCountries.data) {
        CitiesArray = [];
        cityCountries.data.forEach(country => {
            let cityArray = country.cities;
            cityArray.forEach(city => {
                CitiesArray.push(`${city},${country.country}`);
            });
        });
        console.log('CitiesArray:', CitiesArray)
    }
    if (FavCities.FavArray.length > 0) {
        FavCities.showFavCities(FavCities.FavArray);
        getAllValues(FavCities.FavArray[0]);
    }
    else {
        getAllValues('Delhi,India');
        document.getElementById('fav-alternate').innerHTML = 'Mark cities as favorite from search bar to access easily';

    }
    return cityCountries;
}

// Function to display dropdown items
function renderDropdown(items) {
    debugger;
    dataList.innerHTML = ""; 

    if (items.length === 0) {
        dataList.innerHTML = `<div class="no-result">No cities found</div>`;
        return;
    }

    items.forEach((city) => {
        debugger
        const item = document.createElement("option");
        item.textContent = city;
        item.addEventListener("click", () => {
            searchInput.value = city;
            clearBtn.style.display = "block"; 
            dataList.classList.remove("show");
        });

        dataList.appendChild(item);
    });
}

// Filter cities based on input
function filterCities(query) {
    return this.CitiesArray.filter((city) =>
        city.toLowerCase().includes(query.toLowerCase())
    );
}

//handle compare search click
async function searchClicked() {
    if (FirstCity.value && SecondCity.value) {
        try {
            errormsg.innerHTML = '';
            compareloader.style.display = 'flex';
            const { lat, lon } = await weatherdata.getLatLong(FirstCity.value);
            const data = await weatherdata.GetCurrentWeather(lat, lon);
            document.getElementById('firstmintemp').innerHTML = `${data.main.temp_min}°C`;
            document.getElementById('firstmaxtemp').innerHTML = `${data.main.temp_max}°C`;
            document.getElementById('firstdesc').innerHTML = data.weather[0].description;
            const { lat: lat1, lon: lon1 } = await weatherdata.getLatLong(SecondCity.value);
            const data1 = await weatherdata.GetCurrentWeather(lat1, lon1);
            document.getElementById('secondmintemp').innerHTML = `${data1.main.temp_min}°C`;
            document.getElementById('secondmaxtemp').innerHTML = `${data1.main.temp_max}°C`;
            document.getElementById('seconddesc').innerHTML = data1.weather[0].description;
            compareloader.style.display = 'none';
            comparecard.style.display = 'block';
        }
        catch (error) {
            console.error("Error:", error);
        }
    }
    else {
        errormsg.innerHTML = 'Select two cities to compare';
        errormsg.classList.add('text-danger')
        comparecard.style.display = 'none';

    }
}



