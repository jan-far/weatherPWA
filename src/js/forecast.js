import "./network.js";

const api = {
    key: "83c3c5a1dbce8c1b5b91c6e58154fb96",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const lat = sessionStorage.getItem("lat");
const long = sessionStorage.getItem("long");
const city = document.querySelector(".city");
const city_forecast = document.querySelector(".city-forecast");
const forecast_details = document.querySelector(".forecast-details");
const TZ = document.querySelector(".TZ");
const backHome = document.querySelector(".back");

async function getResult() {
    try {
        const res = await fetch(`${api.baseurl}onecall?lat=${lat}&lon=${long}&exclude=hourly,current,minutely&appid=${api.key}&units=metric`);
        const data = await res.json();
        console.log(data);
        let dated = new Date()
        let option = `<option value="0">select</option>`

        TZ.innerHTML= `TimeZone: ${data.timezone}`
        city.innerHTML = `for ${sessionStorage.getItem("city").toUpperCase()}`
        let i = 1;
        for (i; i < data.daily.length; i++) {
            let list = data.daily
            let time = changeTimezone(converter(list[i].dt), data.timezone)
            let result = JSON.stringify(list[i])

            option += `<option value="${i}">${time.toDateString()}</option>`
            sessionStorage.setItem(`${i}`, ` ${result}`)

        }

        city_forecast.innerHTML = option;

        city_forecast.onclick = () => {
            const Item = JSON.parse(sessionStorage.getItem(`${city_forecast.value}`))
            if(Item == null){
                forecast_details.innerHTML = " "
            }else{
                forecast_details.innerHTML = cast(Item)
            }
            console.log(Item)
        }

        function cast(daily) {
            let d = converter(daily.dt);
            let dated = changeTimezone(d, data.timezone);
            let sunrise = changeTimezone(converter(daily.sunrise), data.timezone);
            let sunset = changeTimezone(converter(daily.sunset), data.timezone);

            return ` 
                <section class="detail">
                    <div class="date">${dated.toLocaleString()}</div>
                    <img src="${icon(daily.weather[0].main)}" id="weather_con" width=100px height=100px>
                    <div class="weather">${daily.weather[0].main}</div>
                    <div class="description">${daily.weather[0].description}</div>
                    <div class="more_details">
                    <div class="inline">    
                        <dl class="feels_like">
                        <dt> Feels Like </dt>
                            <dd class="day">Day: ${daily.feels_like.day}<span>°c</span></dd>
                            <dd class="eve">Evening: ${daily.feels_like.eve}<span>°c</span></dd>
                            <dd class="morn">Morning: ${daily.feels_like.morn}<span>°c</span></dd>
                            <dd class="nigh">Night: ${daily.feels_like.night}<span>°c</span></dd>
                        </dl>
                        <dl class="sun">
                        <dt>Sun</dt>
                            <dd class="sunrise">rise: ${sunrise.getHours()}:${sunrise.getMinutes()}</dd>
                            <dd class="sunset">set: ${sunset.getHours()}:${sunset.getMinutes()}</dd>
                        </dl>
                        <dl class="temp">
                        <dt> Temperature </dt>
                            <dd class="day">Day: ${daily.temp.day}<span>°c</span></dd>
                            <dd class="eve">Evening: ${daily.temp.eve}<span>°c</span></dd>
                            <dd class="morn">Morning: ${daily.temp.morn}<span>°c</span></dd>
                            <dd class="nigh">Night: ${daily.temp.night}<span>°c</span></dd>
                        </dl>
                    </div>
                        <div class="humidity">Humidity: ${daily.humidity}%</div>
                        <div class="pressure">Pressure: ${daily.pressure}hPa</div>
                        <dl class="wind">
                        <dt>Wind</dt>
                            <dd class="wind_deg">Wind Degree: ${daily.wind_deg}<span>°</span></dd>
                            <dd class="wind_speed">Wind Speed: ${daily.wind_speed}m/s</dd>
                        </dl>
                    </div>
                    <div class="hi-low"></div>
                </section>
                `
        }
    } catch (err) {
        if (navigator.onLine == false) {
            window.open("../pages/offline.html", "_self")
        }else if (err){
            TZ.innerHTML = ""
            city.innerHTML = ""
        }
    }
}

function changeTimezone(date, TZ) {

    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: TZ
    }));

    // then invdate will be 07:00 in Toronto and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();

    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff);
}

// function date(data) {
//     const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//     const months_arr = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//     //  var aestTime = new Date().toLocaleString("en-US", {
//     //     timeZone: data.timezone
//     // });

//     // console.log('AEST time: ' + (new Date(aestTime)).toISOString())

//     let Unixdate = data
//     const date = converter(Unixdate);
//     return date
// }

function icon(condition) {
    let weather_condition = document.querySelector("img");

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


function converter(unix) {
    let conv = new Date(unix * 1000)
    return conv;
}

window.onload = () =>{
    getResult();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log(`Service Worker registered! Scope: ${registration.scope}`);
            })
            .catch(err => {
                console.log(`Service Worker registration failed: ${err}`);
            });
    }
};

backHome.onclick = ()=>{
    sessionStorage.clear()
}
// var here = new Date();
// var there = changeTimezone(here, "America/Los_Angeles");

// console.log(`Here: ${here.toString()}\nToronto: ${there}`);