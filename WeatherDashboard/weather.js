var lat = 52.52;
var lon = 13.41;
var key = "c20dfa1be7720c512a7ef191810746a0"


function GetCurrentWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`)
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
