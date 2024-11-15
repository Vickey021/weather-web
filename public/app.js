const citiesContainer = document.getElementById("citiesContainer");
const addCityBtn = document.getElementById("addCityBtn");
const dotsContainer = document.querySelector(".dots-container");

// Fetch cities from localStorage
let cities = JSON.parse(localStorage.getItem("cities")) || [];

// Current slide index
let currentIndex = 0;

// Function to display the cities and update dots
function displayCities() {
    citiesContainer.innerHTML = "";  // Clear the container before rendering
    dotsContainer.innerHTML = "";   // Clear the dots before adding new ones

    // If no cities have been added, show a message
    if (cities.length === 0) {
        citiesContainer.innerHTML = "<p  id='noCitiesMessage'>No cities added yet. Please add a city.</p>";
    } else {
        const cityElements = cities.map(city => `
            <div class="city">
                <h3>${city.name}</h3>
                <img src="${city.icon}" alt="Weather icon">
                <div class="dots"></div> <!-- Dotted navigation container -->
                <p class="temp">${city.temp}</p>
                 <p class="cloud-condition">${city.cloudCondition}</p>
                <p>${city.humidity}</p>
                <p>${city.windSpeed}</p>
            </div>
        `).join('');

        citiesContainer.innerHTML = cityElements;
        citiesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Create dots dynamically based on the number of cities
        for (let i = 0; i < cities.length; i++) {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            dot.addEventListener("click", () => {
                currentIndex = i;
                displayCities();
            });
            dotsContainer.appendChild(dot);
        }

        // Update the active dot
        const dots = document.querySelectorAll(".dot");
        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }
}

// Swipe functionality variables
let touchStartX = 0;
let touchEndX = 0;
let mouseStartX = 0;
let mouseEndX = 0;
let isDragging = false;

// Adding touch events for mobile and laptops with touchscreens
citiesContainer.addEventListener('touchstart', handleTouchStart, false);
citiesContainer.addEventListener('touchend', handleTouchEnd, false);

// Adding mouse/trackpad events for laptops without touchscreens
citiesContainer.addEventListener('mousedown', handleMouseDown, false);
citiesContainer.addEventListener('mousemove', handleMouseMove, false);
citiesContainer.addEventListener('mouseup', handleMouseUp, false);
citiesContainer.addEventListener('mouseleave', handleMouseUp, false); // In case mouse leaves the container

// Adding keyboard events for arrow key navigation
document.addEventListener("keydown", handleArrowKeys, false);

// Touch Events for mobile/tablets
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe(touchStartX, touchEndX);
}

// Mouse/Trackpad Events for laptop users (with trackpad or without mouse)
function handleMouseDown(e) {
    isDragging = true;
    mouseStartX = e.clientX;
}

function handleMouseMove(e) {
    if (!isDragging) return;
    mouseEndX = e.clientX;
}

function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    handleSwipe(mouseStartX, mouseEndX);
}

// Function to handle the swipe (for both touch and mouse/trackpad)
function handleSwipe(startX, endX) {
    if (startX - endX > 50 && currentIndex < cities.length - 1) {
        currentIndex++;
    } else if (endX - startX > 50 && currentIndex > 0) {
        currentIndex--;
    }
    displayCities();
}

// Function to handle arrow key navigation
function handleArrowKeys(e) {
    if (e.key === "ArrowRight" && currentIndex < cities.length - 1) {
        currentIndex++;
    } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        currentIndex--;
    }
    displayCities();
}

// Handle "Add City" button click (navigate to add-city page)
addCityBtn.addEventListener("click", () => {
    window.location.href = "add-city.html";
});

// Display cities when the page loads
displayCities();
