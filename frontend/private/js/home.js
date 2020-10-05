window.addEventListener("load", (loadEvent) => {
    console.log('Document had been loaded', loadEvent);
    fetchUsername();
});

async function fetchUsername() {
    console.log(`getting username from server`);
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/private/home`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(res);
            displayWelcome(responseJson);
        })
        .catch(error => alert('Error: Could not get cart data', error));
}

async function displayWelcome(responseJson) {
    let flowersSpace = document.getElementById("welcome-message");
    if (responseJson["status"] == "2") {
        window.location.replace('http://localhost:5000/error.html');
    }
    // display welcome message
    let username = `${responseJson["username"]}`;
    let flowerDiv = document.createElement("div");
    flowerDiv.setAttribute("class", "flowers-class");
    let pWelcome = document.createElement("p");
    pWelcome.innerHTML = `Welcome ${username},`;
    let pMessage = document.createElement("p");
    pMessage.innerHTML = `We are happy you chose to shop at our store, enjoy!`;
    flowerDiv.appendChild(pWelcome);
    flowerDiv.appendChild(pMessage);

    flowerDiv.style.fontSize = "20px";
    flowerDiv.style.textAlign = "center";
    flowersSpace.style.padding = "10px";
    flowersSpace.appendChild(flowerDiv);
}

async function onLogout() {
    console.log(`Performing logout`);
    let requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/private/logout`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(res);
            if (responseJson["status"] === "1") {
                window.location.replace('http://localhost:5000/login.html');
            } else {
                alert(`Error: Could not logout`);
            }
        })
        .catch(error => alert(`Error: Could not logout: ${error}`));
}