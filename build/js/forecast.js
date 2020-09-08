const api = {
    key: "83c3c5a1dbce8c1b5b91c6e58154fb96",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const lat = sessionStorage.getItem("lat");
const long = sessionStorage.getItem("long");
const city_forecast = document.querySelector(".city-forecast");
const forecast_details = document.querySelector(".forecast-details");

async function getResult() {
    try {
        const res = await fetch(`${api.baseurl}onecall?lat=${lat}&lon=${long}&exclude=hourly,current,minutely&appid=${api.key}&units=metric`);
        const data = await res.json();
        console.log(data);
        let dated = new Date()
        let i = 0;

        // for (let i = 0; i < data.daily.length; i++) {
        //     // city_forecast.innerHTML = data.daily[i].map(daily => console.log(daily))
        //     // console.log(data.daily[i])
        // // }
        // data.daily.forEach(myFunction);

        // function myFunction(item, i) {
        //     if (i) {
        //         // city_forecast.innerHTML = `<option value="${date(item.dt)}">${changeTimezone(date(item.dt), data.timezone )}</option>`
        //     }
        // }
        forecast_details.innerHTML = data.daily.map(cast).join("\n");
        
        return data
    } catch (err) {
        if (navigator.onLine == false) {
            window.open("../pages/offline.html", "_self")
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
    return new Date(date.getTime() - diff).toDateString();
}


function date(data) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const months_arr = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    //  var aestTime = new Date().toLocaleString("en-US", {
    //     timeZone: data.timezone
    // });

    // console.log('AEST time: ' + (new Date(aestTime)).toISOString())

    let Unixdate = data
    const date = converter(Unixdate);

    // Year
    const year = date.getFullYear();

    // Month
    const month = months_arr[date.getMonth()];

    // Day
    const day = days[date.getDate()];
    const day_date = date.getDate();

    // Hours
    const hours = date.getHours();

    // Minutes
    const minutes = date.getMinutes();

    // Display date time in MM-dd-yyyy h:m:s format
    const convdataTime = `${day}, ${day_date} ${month} ${year}`;
    // // document.querySelector('.date').innerHTML = convdataTime;
    return date
}

function cast(data) {
    let d = converter(data.dt)
    let dated = changeTimezone(d, getResult().timezone)

    return ` 
    <aside class="current">
    <div class="date">${dated}</div>
            <img src="${icon(data.weather[0].main)}" id="weather_con" width=100px height=100px>
            <div class="weather">${data.weather[0].main}</div>
            <div class="description">${data.weather[0].description}</div>
            <div class="hi-low">
            </div>
        </aside>
    `
}

function icon(condition) {
    if (condition == "Clear") {
        return "../img/clear.png"
    } else if (condition == "Clouds") {
        return "../img/clouds.png"
    } else if (condition == "snow") {
        return "./img/snow.png"
    } else if (condition == "thunder") {
        return "./img/thunder storm.jpg"
    } else if (condition == "Rain") {
        return "../img/rain.png"
    } else if (condition == "Haze") {
        return "./img/haze.png"
    }
}

function converter(unix) {
    let conv = new Date(unix * 1000)
    return conv;
}

getResult()

var there = new Date();
var here = changeTimezone(there, "America/Los_Angeles");

console.log(`Here: ${here.toString()}\nToronto: ${there.toString()}`);