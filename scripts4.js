const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');
const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');

// Function to handle search button click
searchBtn.addEventListener('click', () => {
    checkWeather(inputBox.value);
});

// Function to handle input changes for autocomplete
inputBox.addEventListener('input', () => {
    const query = inputBox.value;
    if (query.length > 2) { // Start searching when the input length is greater than 2
        fetchLocations(query);
    }
});

// Function to fetch location data
async function fetchLocations(query) {
    const api_key = "3af6ed2ce97845da8b4586258c93bfd1"; // Replace with your OpenCage API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${api_key}&limit=5`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const suggestions = data.results.map(place => place.formatted);
        showSuggestions(suggestions);
    } catch (error) {
        console.error("Error fetching location data: ", error);
    }
}

// Function to display suggestions
function showSuggestions(suggestions) {
    // Clear existing suggestions
    const suggestionBox = document.querySelector('.suggestions');
    if (suggestionBox) {
        suggestionBox.remove();
    }

    // Create suggestion box
    const newSuggestionBox = document.createElement('div');
    newSuggestionBox.className = 'suggestions';
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', () => {
            inputBox.value = suggestion;
            checkWeather(suggestion);
            newSuggestionBox.remove(); // Remove suggestions after selecting one
        });
        newSuggestionBox.appendChild(suggestionItem);
    });
    inputBox.parentNode.appendChild(newSuggestionBox);
}

// Function to fetch and display weather data
async function checkWeather(city) {
    const api_key = "ef82d284800dae7a3bb5aa594f65f305";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const weather_data = await response.json();

        if (weather_data.cod === '404') {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            return;
        }

        location_not_found.style.display = "none";
        weather_body.style.display = "flex";
        temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
        description.innerHTML = `${weather_data.weather[0].description}`;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

        switch (weather_data.weather[0].main) {
            case 'Clouds':
                weather_img.src = "pictures/cloud.png";
                break;
            case 'Clear':
                weather_img.src = "pictures/clear.png";
                break;
            case 'Rain':
                weather_img.src = "pictures/rain.png";
                break;
            case 'Mist':
                weather_img.src = "pictures/mist.png";
                break;
            case 'Snow':
                weather_img.src = "pictures/snow.png";
                break;
        }
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
    }
}

// Function to fetch and display weather data based on coordinates
async function checkWeatherByCoords(lat, lon) {
    const api_key = "ef82d284800dae7a3bb5aa594f65f305";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const weather_data = await response.json();

        if (weather_data.cod === '404') {
            location_not_found.style.display = "flex";
            weather_body.style.display = "none";
            return;
        }

        location_not_found.style.display = "none";
        weather_body.style.display = "flex";
        temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
        description.innerHTML = `${weather_data.weather[0].description}`;
        humidity.innerHTML = `${weather_data.main.humidity}%`;
        wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

        switch (weather_data.weather[0].main) {
            case 'Clouds':
                weather_img.src = "pictures/cloud.png";
                break;
            case 'Clear':
                weather_img.src = "pictures/clear.png";
                break;
            case 'Rain':
                weather_img.src = "pictures/rain.png";
                break;
            case 'Mist':
                weather_img.src = "pictures/mist.png";
                break;
            case 'Snow':
                weather_img.src = "pictures/snow.png";
                break;
        }
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
    }
}

// Get weather data for the user's current location on page load
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        checkWeatherByCoords(latitude, longitude);
    });
}
