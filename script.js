
// Activity 1

function saveData() {
    let name = document.getElementById("username").value.trim();

    if (name === "") {
        alert("Please enter your name.");
        return;
    }

    localStorage.setItem("userName", name);
    alert("Data Saved!");
}

function loadData() {
    let name = localStorage.getItem("userName");

    if (name) {
        document.getElementById("display").innerText =
            "Welcome, " + name;
    } else {
        document.getElementById("display").innerText =
            "No data saved!";
    }
}


// Activity 1.1

function savePreferences() {
    let theme = document.getElementById("theme").value;
    let language = document.getElementById("language").value;

    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);

    applyPreferences();

    document.getElementById("message").innerText =
        "Preferences Saved!";
}

function applyPreferences() {
    let savedTheme = localStorage.getItem("theme");
    let savedLanguage = localStorage.getItem("language");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    let themeSelect = document.getElementById("theme");
    let languageSelect = document.getElementById("language");

    if (themeSelect) {
        themeSelect.value = savedTheme || "light";
    }

    if (languageSelect) {
        languageSelect.value = savedLanguage || "en";
    }
}


// Activity 2

function getWeather() {
    let city = document.getElementById("city").value.trim();
    let result = document.getElementById("weatherResult");

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }

    result.innerText = "Loading weather data...";

    let locationURL =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    fetch(locationURL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to search for the city.");
            }

            return response.json();
        })

        .then(locationData => {

            if (!locationData.results ||
                locationData.results.length === 0) {

                throw new Error("City not found.");
            }

            let location = locationData.results[0];

            let latitude = location.latitude;
            let longitude = location.longitude;

            let weatherURL =
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=celsius`;

            return fetch(weatherURL);
        })

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to get weather data.");
            }

            return response.json();
        })

        .then(data => {

            let temperature =
                data.current.temperature_2m;

            let weatherCode =
                data.current.weather_code;

            let description =
                getWeatherDescription(weatherCode);

            result.innerHTML = `
                <h3>Current Weather</h3>
                <p>Temperature: ${temperature}°C</p>
                <p>Condition: ${description}</p>
            `;
        })

        .catch(error => {

            result.innerText =
                "Error: " + error.message;
        });
}

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code === 1 || code === 2) {
        return "Partly Cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown Weather";
}


// Activity 3

let map;
let marker;

function initMap() {

    map = L.map("map").setView(
        [14.5995, 120.9842],
        10
    );

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);
}


// Activity 3.1

function searchLocation() {

    let location =
        document.getElementById("locationInput").value.trim();

    if (location === "") {
        alert("Please enter a location.");
        return;
    }

    let searchURL =
        `https://photon.komoot.io/api/?q=${encodeURIComponent(location)}&limit=1`;

    fetch(searchURL)
        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to search for location.");
            }

            return response.json();
        })

        .then(data => {

            if (!data.features ||
                data.features.length === 0) {

                alert("Location not found!");
                return;
            }

            let coordinates =
                data.features[0].geometry.coordinates;

            let longitude = coordinates[0];
            let latitude = coordinates[1];

            map.setView(
                [latitude, longitude],
                12
            );

            if (marker) {
                map.removeLayer(marker);
            }

            marker = L.marker([
                latitude,
                longitude
            ]).addTo(map);

            marker
                .bindPopup(location)
                .openPopup();
        })

        .catch(error => {

            console.error(error);

            alert("Error searching for location.");
        });
}

// Activity 4

function getUser() {

    let username =
        document.getElementById("username").value.trim();

    let result =
        document.getElementById("userResult");

    if (username === "") {

        result.innerText =
            "Please enter a GitHub username.";

        return;
    }

    result.innerText =
        "Loading GitHub user...";

    let url =
        `https://api.github.com/users/${encodeURIComponent(username)}`;

    fetch(url)

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "GitHub user not found."
                );
            }

            return response.json();
        })

        .then(data => {

            result.innerHTML = `

                <h3>
                    ${data.name || "No Name Found"}
                </h3>

                <img
                    src="${data.avatar_url}"
                    alt="GitHub Profile Picture"
                    class="github-avatar"
                >

                <p>
                    Username: ${data.login}
                </p>

                <p>
                    Public Repositories:
                    ${data.public_repos}
                </p>

                <p>
                    Followers:
                    ${data.followers}
                </p>
            `;
        })

        .catch(error => {

            result.innerText =
                "Error: " + error.message;
        });
}
