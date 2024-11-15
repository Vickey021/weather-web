const saveCityBtn = document.getElementById("saveCityBtn");
const searchCityInput = document.getElementById("searchCity");
const cityNameDisplay = document.getElementById("cityName");
const cityIconDisplay = document.getElementById("cityIcon");
const cityTempDisplay = document.getElementById("cityTemp");
const cityHumidityDisplay = document.getElementById("cityHumidity");
const cityWindSpeedDisplay = document.getElementById("cityWindSpeed");
const cityListContainer = document.getElementById("cityListContainer");
const backToMainBtn = document.getElementById("backToMainBtn");
const searchBtn = document.getElementById("searchBtn");
const cityDetails = document.getElementById("cityDetails");
const dottedIndicatorsContainer = document.getElementById("dottedIndicators"); // Container for dotted indicators

// Fetch cities from localStorage
let cities = JSON.parse(localStorage.getItem("cities")) || [];

// OpenWeather API Key
const apiKey = "bc5b874cda28e081c86afb157849caac"; // Replace with your actual OpenWeather API key

// Function to fetch weather data from OpenWeather API
async function fetchWeatherData(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`);
        
        const data = await response.json();

        if (data.cod === "404") {
            alert("City not found!");
            return null;
        }

        const cloudCondition = data.weather[0].description;

        return {
            name: data.name,
            icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
            temp: `${data.main.temp}°C`,
            humidity: `${data.main.humidity}%`,
            windSpeed: `${data.wind.speed} km/h`,
            cloudCondition: cloudCondition
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch weather data.");
    }
}



// Function to create dotted indicators for more cities
function createDottedIndicators() {
    dottedIndicatorsContainer.innerHTML = ""; // Clear existing indicators

    const numIndicators = 5; // Number of dotted indicators to display
    for (let i = 0; i < numIndicators; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dottedIndicatorsContainer.appendChild(dot);
    }
}

// Handle search button click
searchBtn.addEventListener("click", async () => {
    const cityName = searchCityInput.value.trim();

    if (!cityName) {
        alert("Please enter a city name.");
        return;
    }

    // Clear previous city details before displaying new ones
    cityDetails.style.display = 'none';
    saveCityBtn.style.display = 'none';

    // Fetch weather data for the searched city
    const weatherData = await fetchWeatherData(cityName);

    if (weatherData) {
        // Display the city details in a card-like format
        cityNameDisplay.innerText = `City: ${weatherData.name}`;
        cityIconDisplay.src = weatherData.icon;
        const temp = parseFloat(weatherData.temp);  // Convert to number if it's a string
        if (!isNaN(temp)) {
            cityTempDisplay.innerText = Math.round(temp) + "°C";  // Now round it
        } else {
            cityTempDisplay.innerText = 'Data not available';  // Fallback if temp is invalid
        }
        document.getElementById("cityCloudCondition").innerText = weatherData.cloudCondition;
        cityHumidityDisplay.innerText = `Humidity: ${weatherData.humidity}`;
        cityWindSpeedDisplay.innerText = `Wind Speed: ${weatherData.windSpeed}`;

        // Make the "Save City" button visible
        saveCityBtn.style.display = 'inline-block';
        cityDetails.style.display = 'block';


        // Create dotted indicators for more cities
        createDottedIndicators();
    }
});

// Handle save city action
saveCityBtn.addEventListener("click", () => {
    const cityName = cityNameDisplay.innerText.split(": ")[1];

    if (!cityName) {
        alert("Please search for a city before saving.");
        return;
    }

    // Check if the city already exists
    const cityExists = cities.some(city => city.name.toLowerCase() === cityName.toLowerCase());
    if (cityExists) {
        alert("This city is already added.");
        window.location.reload();
        return;
    }

    // Create new city object
    const newCity = {
        name: cityName,
        icon: cityIconDisplay.src,
        temp: cityTempDisplay.innerText,
        cloudCondition: cityCloudCondition.innerText, // Store cloud condition
        humidity: cityHumidityDisplay.innerText,
        windSpeed: cityWindSpeedDisplay.innerText
    };

    // Add the new city to the cities array
    cities.push(newCity);

    // Save the updated cities array to localStorage
    localStorage.setItem("cities", JSON.stringify(cities));

    // Display updated city list
    displayCityList();
     // Show alert and refresh the page
     alert("City added successfully!");
     window.location.reload();

   

   
});

// Handle delete city action
cityListContainer.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("delete-btn")) {
        const cityIndex = event.target.getAttribute("data-index");

        // Confirm delete action
        const confirmDelete = confirm("Are you sure you want to delete this city?");
        if (confirmDelete) {
            cities.splice(cityIndex, 1);  // Remove city from the array
            localStorage.setItem("cities", JSON.stringify(cities));  // Update localStorage
            displayCityList();  // Re-render the city list
        }
    }
});

// Handle back to main page action
backToMainBtn.addEventListener("click", () => {
    window.location.href = "index.html"; // Redirect to the main page
});

// Function to display the cities in the list
function displayCityList() {
    cityListContainer.innerHTML = "";  // Clear previous list

    if (cities.length === 0) {
        cityListContainer.innerHTML = "<p>No cities added yet.</p>";
    } else {
        cities.forEach((city, index) => {
            const cityElement = document.createElement("div");
            cityElement.classList.add("city-item");
            cityElement.innerHTML = `
                <div class="city-info">
                    <p>${city.name}</p>
                    <img src="${city.icon}" alt="${city.name} weather icon" style="width: 30px;">
                    <p>${city.temp}</p>
                    <p>${city.cloudCondition}</p>
                    <p>${city.humidity}</p>
                    <p>${city.windSpeed}</p>
                </div>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            cityListContainer.appendChild(cityElement);
        });
    }
}

// Display the city list when the page loads
displayCityList();
