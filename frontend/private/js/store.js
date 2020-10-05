window.addEventListener("load", (loadEvent) => {
    console.log('Document had been loaded', loadEvent);

    console.log(`getting flowers data from server`);
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/private/store`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(res);
            displayFlowersData(responseJson);
            let searchButton = document.getElementById("search")
            searchButton.addEventListener("click", async (clickEvent) => {
                console.log('Search button has been clicked', clickEvent);
                let searchInput = document.getElementById("search-input").value;
                displayFlowersData(responseJson, searchInput);
            });
        })
        .catch(error => alert(`Error: Could not get flowers data: ${error}`));
});

async function displayFlowersData(responseJson, searchInput = "") {
    let flowersDivIds = [];
    let flowersSpace = document.getElementById("flowers");
    flowersSpace.innerHTML = "";
    if (responseJson["status"] == "empty") {
        flowersSpace.style.padding = "60px";
        flowersSpace.style.fontSize = "17px"
        flowersSpace.innerHTML = "No items";
        return;
    } else if (responseJson["status"] == "2") {
        window.location.replace('http://localhost:5000/error.html');
    }
    // display flowers data
    for (let flower in responseJson) {
        if (searchInput.length == 0 || flower.includes(searchInput)) {
            let flowerDataName = `${flower}`;
            let price = responseJson[flower];
            let flowerDataPrice = `Price: ${price} NIS`;
            let flowerDiv = document.createElement("div");
            flowerDiv.setAttribute("class", "flowers-class");
            flowersDivIds.push(flowerDiv);
            let addButton = document.createElement("input");
            addButton.setAttribute("class", "add-button");
            addButton.setAttribute("type", "button");
            addButton.setAttribute("value", "add to cart");
            addButton.setAttribute("name", `${flower}`);
            addButton.onclick = function () {
                addToCart(flower, price);
            };
            let wishButton = document.createElement("input");
            wishButton.setAttribute("class", "wish-button");
            wishButton.setAttribute("type", "button");
            wishButton.setAttribute("value", "\u2661");
            wishButton.setAttribute("name", `${flower}`);
            wishButton.onclick = function () {
                addToWishlist(flower, price);
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
            flowerDiv.appendChild(addButton);
            flowerDiv.appendChild(wishButton);
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
}

async function addToCart(bouquetName, price) {
    let requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/private/add-to-cart?flower=${bouquetName}&price=${price}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(result);
            if (responseJson["status"] == 1) {
                alert(`Bouquet: '${bouquetName}' has been added to your cart`);
            } else {
                alert('Error: Could not add bouquet to cart');
            }
        })
        .catch(error => alert(`Error: Could not add bouquet to cart ${error}`));
}

async function addToWishlist(bouquetName, price) {
    let requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/private/add-to-wishlist?flower=${bouquetName}&price=${price}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(result);
            if (responseJson["status"] == 1) {
                alert(`Bouquet: '${bouquetName}' has been added to your wishlist`);
            } else {
                alert('Error: Could not add bouquet to wishlist');
            }
        })
        .catch(error => alert(`Error: Could not add bouquet to wishlist: ${error}`));
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
        .catch(error => alert(`Error: Could not logout ${error}`));
}