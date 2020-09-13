import "./network.js";
// import fore from "./getforecast.js"

const api = {
    key: "83c3c5a1dbce8c1b5b91c6e58154fb96",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector(".search-box");
const button = document.getElementsByClassName("forecast-btn")
const modal = document.getElementById("myModal");
const modelText = document.querySelector(".model-text")
const location = document.querySelector(".loc");
const sectionLocation = document.querySelector(".location");
const forecast = document.querySelector(".forecast-btn")
let weather_condition = document.querySelector("#weather_con")
const span = document.getElementsByClassName("close")[0];
let newWorker;
let refreshing;
let reload = document.querySelector("#reload")
let notification = document.querySelector(".notification");

span.onclick = function () {
    modal.style.display = "none";

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

button.onclick = () => {
    window.open("../pages/forecast.html", "__self")
};

window.onload = ()=>{
    getLocation();
    weather_condition.style.display = "none";
    forecast.style.display = "none";
}

searchbox.addEventListener("keypress", (e) => {
    let val = searchbox.value
    if (e.keyCode == 13 | e.key == "Enter") {
        getResult(val)
        localStorage.setItem("city", val);
        window.onload = ""
    }
})

if ('serviceWorker' in navigator) {
    getLocation();

    // The event listener that is fired when the service worker updates
    navigator.serviceWorker.addEventListener("controllerchange", function () {
        // Here, reload the page
        refreshing = true;
        if (refreshing) return;
        window.location.reload();
    });

    navigator.serviceWorker.register('/sw.js')
        .then(registration => {

            registration.addEventListener("updatefound", () => {
                // updated service worker has appeared in registration.installing!
                newWorker = registration.installing;
                console.log("installing")

                // Has service worker state changed?
                newWorker.addEventListener("statechange", (e) => {
                    console.log("change")

                    if (e.target.state === "waiting") {
                        console.log("waiting")
                        notification.style.display = "flex";

                        reload.addEventListener("click", () => {
                            registration.waiting.postMessage({
                                action: "skipWaiting"
                            })
                            notification.style.display = "";
                            // registration.update();
                        });
                    };

                    if (e.target.state === "installed") {
                        console.log("installed")
                    }
                });
            });

            // if window client is currently controlled s
            if (navigator.serviceWorker.controller) {
                // so no new service worker will activate
                console.log("controller")
            };
            console.log(`Service Worker registered! Scope: ${registration.scope}`);
        })
        .catch(err => {
            console.log(`Service Worker registration failed: ${err}`);
        });
};

async function getResult(query) {
    let val = searchbox.value
    try {
        const res = await fetch(`${api.baseurl}weather?q=${query}&appid=${api.key}&units=metric`);
        const data = await res.json();

        if (data.cod == "400" || data.cod == "404") {
            modelText.innerHTML = `search for "${val}" weather condition not found. "${val}" may not exist or be found on API!`
            modal.style.display = "block";
            searchbox.value = "";
        } else if (data.cod == "400" || data.cod == "404" || searchbox.value == new RegExp("/\s/")) {
            modelText.innerHTML = `Enter a city! </br> "City" search cannot be blank! </br></br> Search for " " is INVALID!`
            modal.style.display = "block";
            searchbox.value = "";
        } else {
            sessionStorage.setItem("result", JSON.stringify(data));
            details(data)
            searchbox.value = "";
            forecast.style.display = "";
            location.style.display = "none";
            sectionLocation.style.marginTop = "-15px";
            localStorage.setItem("lat", data.coord.lat);
            localStorage.setItem("long", data.coord.lon);
        }

        const dataSaved = JSON.parse(sessionStorage.getItem("result"))
        // console.log(data)
        const resp = await fetch(`${api.baseurl}onecall?lat=${dataSaved.coord.lat}&lon=${dataSaved.coord.lon}&exclude=hourly,current,minutely&appid=${api.key}&units=metric`);
        const datas = await resp.json();
        localStorage.setItem("data", JSON.stringify(datas));

        // const res = await fetch(`${api.baseurl}weather?q=${query}&appid=${api.key}&units=metric`);
        // const data = await res.json();
        // console.log(data);
        // if (data.cod == "404") {
        //     modelText.innerHTML = `search for "${val}" weather condition not found. "${val}" may not exist or be found on API!`
        //     modal.style.display = "block";
        //     searchbox.value = "";
        // } else if (data.cod == "400" || searchbox.value == new RegExp("/\s/")) {
        //     modelText.innerHTML = `Enter a city! </br> "City" search cannot be blank! </br></br> Search for " " is INVALID!`
        //     modal.style.display = "block";
        //     searchbox.value = "";
        // } else {

        // };
    } catch (err) {
        if (navigator.onLine == false) {
            window.open("../pages/offline.html", "_self")
        }
    }
};

async function details(data) {
    let city = document.querySelector(".location .city");
    let details = document.querySelector(".location .data");
    let description = document.querySelector(".description");
    let weather = document.querySelector(".weather");
    let temp = document.querySelector(".temp");
    let tempRange = document.querySelector(".hi-low");

    city.innerHTML = `${data.name}, ${data.sys.country}`
    date(data)

    let sunrise = converter(`${data.sys.sunrise}`)
    let sunset = converter(`${data.sys.sunset}`)

    details.innerHTML = `
    <p> Sunrise: ${sunrise.getHours()}:${sunrise.getMinutes()} ||
    Sunset: ${sunset.getHours()}:${sunset.getMinutes()} </p>
    `
    temp.innerHTML = `${Math.round(data.main.temp)}<span>°c</span>`;

    // cloud(data.weather[0].icon);
    weather.innerHTML = `${data.weather[0].main}`;
    icon(data.weather[0].main);

    description.innerHTML = `${data.weather[0].description}`

    weather_condition.style.display = "";
    tempRange.innerHTML = `<p> Min Temp: ${Math.round(data.main.temp_min)}<span>°c</span> 
    </br></br>
    Max Temp: ${Math.round(data.main.temp_max)}<span>°c</span></p>`
}

function date(data) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const months_arr = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let Unixdate = data.dt
    const date = converter(Unixdate);

    // let d = new Date();

    // let utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // let nd = new Date(utc + (3600000 * data.timezone));

    // console.log(u)
    // console.log(nd.toISOString())
    // Year
    const year = date.getFullYear();

    // Month
    const month = months_arr[date.getMonth()];

    // Day
    const day = days[date.getDay()];
    const day_date = date.getDate();

    // Hours
    const hours = date.getHours();

    // Minutes
    const minutes = date.getMinutes();

    // Display date time in MM-dd-yyyy h:m:s format
    const convdataTime = `${day}, ${day_date} ${month} ${year}`;
    document.querySelector('.date').innerHTML = convdataTime;
}

function converter(unix) {
    let conv = new Date(unix * 1000)
    return conv;
}

function icon(condition) {
    // let weather_condition = document.querySelector("#weather_con");

    if (condition == "Clear") {
        weather_condition.src = "./img/clear.png"
    } else if (condition == "Clouds") {
        weather_condition.src = "./img/clouds.png"
    } else if (condition == "snow") {
        weather_condition.src = "./img/snow.png"
    } else if (condition == "Thunderstorm") {
        weather_condition.src = "./img/thunder storm.jpg"
    } else if (condition == "Rain") {
        weather_condition.src = "./img/rain.png"
    } else if (condition == "Haze") {
        weather_condition.src = "./img/haze.png"
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition)
        weather_condition.style.display = "";
        // console.log(navigator.geolocation.getCurrentPosition(setPosition))
    } else {
        modal.write = "Geolocation not allowed or supported"
        console.log(" Geolocation not currently Support ")
    };
};

function setPosition(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    async function myLocation() {
        forecast.style.display = "none"
        try {
            const res = await fetch(`${api.baseurl}weather?lat=${lat}&lon=${long}&appid=${api.key}&units=metric`)
            const data = await res.json()
            if (!data) {
                modal.style.display = "block";
            } else {
                location.innerHTML = "Current Location: "
                location.style.marginBottom = "10px"
                details(data)
            }
        } catch (err) {
            console.log("Failed to get Weather details...!");
            // When the user clicks the button, open the modal 
            modal.style.display = "block";
            forecast.style.display = "none"
        }
    }

    myLocation()

};

// var there = new Date();
// var here = changeTimezone(there, "America/Los_Angeles");

// console.log(`Here: ${here.toString()}\nToronto: ${there.toString()}`);