const api = {
    key: "83c3c5a1dbce8c1b5b91c6e58154fb96",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const lat = localStorage.getItem("lat");
const long = localStorage.getItem("long");

const forecast = {
    async cast(){
        const res = await fetch(`${api.baseurl}onecall?lat=${lat}&lon=${long}&exclude=hourly,current,minutely&appid=${api.key}&units=metric`);
        const data = await res.json();
        localStorage.setItem("data", JSON.stringify(data));
    }
}

export default forecast;