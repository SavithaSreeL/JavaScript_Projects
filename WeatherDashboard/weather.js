
// var lat = 52.52;
// var lon = 13.41;
var key = "c20dfa1be7720c512a7ef191810746a0"
const dropdown = document.getElementById('cityDropdown')
const dataList = document.getElementById('cities')


function GetCurrentWeather(lat,lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=c20dfa1be7720c512a7ef191810746a0&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('current weather', data)
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        }

        )
}

function GetSevenDayForecast() {
    let YOUR_ACCESS_KEY = "c42b4998d98841e18901dad01004d96c"; // Ensure the key is a string
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=7&temperature_unit=fahrenheit`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('7-Day Forecast:', data); // 'forecast' contains the 7-day forecast
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}

// function GetAllCountries(){
//     debugger;
//     fetch('https://countriesnow.space/api/v0.1/countries')
//     .then(response => {
//         if(!response.ok){
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//     })
//     .then( cityCountries =>{
//         console.log('All countries',cityCountries.data)
//             for(i=0 ; i < cityCountries.length ; i++){
//               let cityArray = cityCountries.data[i].cities ;
//               cityArray.forEach(option => {
//                 let newOption = document.createElement('option');
//                 newOption.value = option;
//                 newOption.textContent = option ;
//                 dropdown.appendChild(newOption);
//                 console.log('options',newOption)
//               });
//             }



//     })
//     .catch(error => {
//         "Error fetching weather data:", error
//     }

// )
//     debugger;



// }
function GetAllCountries() {
    fetch('https://countriesnow.space/api/v0.1/countries')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(cityCountries => {
            console.log('All countries', cityCountries.data); // Logs data for debugging

            if (cityCountries && cityCountries.data) {
                cityCountries.data.forEach(country => {
                    let cityArray = country.cities; // Access the cities array
                    cityArray.forEach(city => {
                        let newOption = document.createElement('option');
                        newOption.value = city; // Set the value of the option
                        newOption.textContent = city; // Set the display text of the option
                         newOption.country = country;
                        dataList.appendChild(newOption); // Append the option to the dropdown
                    });
                });
            }
        })
        .catch(error => {
            console.error("Error fetching country data:", error); // Log any errors
        });
}

function getLatLong() {
    const SearchInput = document.getElementById('cityInput').value;
    const SearchInputCountry = document.getElementById('cityInput').country;

    document.getElementById('placename').innerHTML =SearchInput ;

    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${SearchInput}&key=13d9564b6c1d4441997b0624ea9c5255`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(LatLong => {
            const lat = LatLong.results[0].geometry.lat;
            const lon = LatLong.results[0].geometry.lng;
            console.log('latitude:', lat);
            console.log('longitude:', lon);
            GetCurrentWeather(lat,lon);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}

GetAllCountries();
//getLatLong();