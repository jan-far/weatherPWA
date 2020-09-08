const element = document.querySelector(".status");
const blink = document.querySelector(".blinker");

// Listen for the page to be finished loading
window.addEventListener("load", () => {
    hasNetwork(navigator.onLine);

    window.addEventListener("online", () => {
        // Set hasNetwork to online when they change to online.
        hasNetwork(true);
    });

    window.addEventListener("offline", () => {
        // Set hasNetwork to offline when they change to offline.
        hasNetwork(false);
    });
});

function hasNetwork(online) {
    // Update the DOM to reflect the current status
    if (online) {
        element.classList.remove("offline");
        element.classList.add("online");
        element.innerText = "";
        element.style.background = "green"
        element.style.borderRadius = "20px"
        element.style.padding = "8px";
    } else {
        element.classList.remove("online");
        element.classList.add("offline");
        element.style.background = "rgb(85, 7, 17)"
        element.style.borderRadius = "10px"
        element.innerText = "Offline Mode";
        element.style.padding = "";
    }
};