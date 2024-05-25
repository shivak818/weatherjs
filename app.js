const apiKey = 'fdda31a926795fd5352c996cc37665ad'; // Your API key

// Function to fetch current weather data from the API based on city name
async function getWeatherDataByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to fetch 5-day forecast data from the API based on city name
async function getForecastDataByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        return null;
    }
}

// Function to display current weather information
function displayWeatherInfo(weatherData) {
    const weatherInfo = document.getElementById('weather-info');
    if (weatherData) {
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;
        const description = weatherData.weather[0].description;
        const city = weatherData.name;
        const icon = weatherData.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;
        weatherInfo.innerHTML = `
            <div class="weather-details">
                <h2>Current weather in ${city}</h2>
                <img src="${iconUrl}" alt="${description}">
                <p>Description: ${description}</p>
                <p>Temperature: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            </div>
        `;
    } else {
        weatherInfo.innerHTML = 'Failed to fetch weather data.';
    }
}

// Function to display 5-day weather forecast
function displayForecastInfo(forecastData) {
    const forecastInfo = document.getElementById('forecast-info');
    if (forecastData) {
        const forecasts = forecastData.list.filter((_, index) => index % 8 === 0);
        forecastInfo.innerHTML = '';
        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString();
            const temperature = forecast.main.temp;
            const humidity = forecast.main.humidity;
            const windSpeed = forecast.wind.speed;
            const description = forecast.weather[0].description;
            const icon = forecast.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;
            const forecastDay = document.createElement('div');
            forecastDay.classList.add('forecast-day');
            forecastDay.innerHTML = `
                <img src="${iconUrl}" alt="${description}">
                <p>Date: ${date}</p>
                <p>Description: ${description}</p>
                <p>Temperature: ${temperature}°C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
            `;
            if (description.includes('rain')) {
                forecastDay.style.animationName = 'rain';
            } else if (description.includes('cloud')) {
                forecastDay.style.animationName = 'clouds';
            } else {
                forecastDay.style.animationName = 'sun';
            }
            forecastInfo.appendChild(forecastDay);
        });
    } else {
        forecastInfo.innerHTML = 'Failed to fetch forecast data.';
    }
}

// Function to handle city search
async function handleCitySearch() {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    if (city !== '') {
        const weatherData = await getWeatherDataByCity(city);
        const forecastData = await getForecastDataByCity(city);
        displayWeatherInfo(weatherData);
        displayForecastInfo(forecastData);
        updateRecentSearches(city);
        cityInput.value = '';
    } else {
        alert('Please enter a city name.');
    }
}

// Function to handle current location search
async function handleLocationSearch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            try {
                const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                const weatherData = await weatherResponse.json();
                const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                const forecastData = await forecastResponse.json();
                displayWeatherInfo(weatherData);
                displayForecastInfo(forecastData);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                alert('Failed to fetch weather data.');
            }
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Event listener for search buttons
document.getElementById('search-city').addEventListener('click', handleCitySearch);
document.getElementById('search-location').addEventListener('click', handleLocationSearch);

// Function to update the recent searches dropdown
function updateRecentSearches(city) {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    if (!recentSearches.includes(city)) {
        recentSearches.push(city);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    populateRecentSearches();
}

function populateRecentSearches() {
    const recentSearchesDropdown = document.getElementById('recent-searches');
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    recentSearchesDropdown.innerHTML = '';
    
    // Add a title to the dropdown
    const titleOption = document.createElement('option');
    titleOption.textContent = 'Recent Searches';
    titleOption.disabled = true;
    titleOption.selected = true;
    recentSearchesDropdown.appendChild(titleOption);
    
    recentSearches.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        
        // Add event listener to each dropdown option for the 'change' event
        option.addEventListener('change', async () => {
            const weatherData = await getWeatherDataByCity(city);
            const forecastData = await getForecastDataByCity(city);
            displayWeatherInfo(weatherData);
            displayForecastInfo(forecastData);
        });
        
        recentSearchesDropdown.appendChild(option);
    });
}

        


// Initialize recent searches dropdown on page load
window.onload
