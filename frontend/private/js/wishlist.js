window.addEventListener("load", (loadEvent) => {
    console.log('Document had been loaded', loadEvent);
    fetchWishlist();
});

async function fetchWishlist() {
    console.log(`getting flowers data from server`);
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/private/wishlist`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(res);
            displayWishlistData(responseJson);
        })
        .catch(error => alert(`Error: Could not get wishlist data: ${error}`));
}

async function displayWishlistData(responseJson) {
    let flowersDivIds = [];
    let flowersSpace = document.getElementById("flowers");
    flowersSpace.innerHTML = "";
    if (responseJson["status"] === "empty") {
        flowersSpace.style.padding = "60px";
        flowersSpace.style.fontSize = "17px"
        flowersSpace.innerHTML = "No items";
        return;
    } else if (responseJson["status"] === "2") {
        window.location.replace('http://localhost:5000/error.html');
    }
    // display flowers data
    for (let flower in responseJson) {
        let flowerDataName = `${flower}`;
        let flowerDataPrice = `Price: ${responseJson[flower]} NIS`;
        let flowerDiv = document.createElement("div");
        flowerDiv.setAttribute("class", "flowers-class");
        flowersDivIds.push(flowerDiv);
        let removeButton = document.createElement("input");
        removeButton.setAttribute("class", "add-button");
        removeButton.setAttribute("type", "button");
        removeButton.setAttribute("value", "remove");
        removeButton.setAttribute("name", `${flower}`);
        removeButton.onclick = function () {
            removeFromWishlist(flower);
        };
        let flowerPName = document.createElement("p");
        let flowerPPrice = document.createElement("p");
        let flowerImg = document.createElement("img");
        flowerImg.setAttribute("class", "image-class");
        flowerImg.setAttribute('src', `flowersImages/${flower}.jpg`);
        flowerImg.setAttribute('width', '300px');
        flowerImg.setAttribute('height', '300px');
        flowerPName.innerHTML = flowerDataName;
        flowerPPrice.innerHTML = flowerDataPrice;
        flowerDiv.appendChild(flowerPName);
        flowerDiv.appendChild(flowerPPrice);
        flowerDiv.appendChild(flowerImg);
        flowerDiv.appendChild(removeButton);
        flowerDiv.style.fontSize = "16px";
        flowerDiv.style.textAlign = "center";
        flowerPName.style.fontWeight = "bold";
        flowerDiv.style.float = "left";
        flowerDiv.style.padding = "25px";
        flowerDiv.style.hover = "gray";
        flowersSpace.style.padding = "45px";
        flowersSpace.appendChild(flowerDiv);
    }
}

async function removeFromWishlist(bouquetName) {
    let requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/private/remove-from-wishlist?flower=${bouquetName}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(result);
            if (responseJson["status"] == 1) {
                fetchWishlist();
            } else {
                alert('Error: Could not remove bouquet from wishlist');
            }
        })
        .catch(error => alert(`Error: Could not remove bouquet from wishlist: ${error}`));
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