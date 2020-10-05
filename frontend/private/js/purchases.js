window.addEventListener("load", (loadEvent)=>{
    console.log('Document had been loaded', loadEvent);
    fetchPurchases();
});

async function fetchPurchases(){
    console.log(`getting purchases data from server`);
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/private/purchases`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(res);
            displayPurchasesData(responseJson);
        })
        .catch(error => alert(`Error: Could not get purchases data ${error}`));
}

async function displayPurchasesData(responseJson) {
    let flowersDivIds = [];
    let flowersSpace = document.getElementById("flowers");
    flowersSpace.innerHTML = "";
    if (responseJson["status"] == "empty") {
        flowersSpace.style.padding = "60px";
        flowersSpace.style.fontSize = "17px"
        flowersSpace.innerHTML = "No purchases";
        return ;
    } else if(responseJson["status"] === "2"){
        window.location.replace('http://localhost:5000/error.html');
    }
    // display flowers data
    let sum = 0;
    for (let purchase in responseJson){
        let purchaseDiv = document.createElement("div");
        let purchasePMessage = document.createElement("p");
        purchasePMessage.style.fontWeight = "bold";
        purchasePMessage.innerHTML = `Purchase number: ${purchase}`;
        purchaseDiv.appendChild(purchasePMessage);
        for(let flower in responseJson[purchase]) {
            let flowerDataName = `${flower}`;
            let price = responseJson[flower];
            let flowerDataPrice = `Price: ${price} NIS`;
            sum += parseInt(price);
            let flowerDiv = document.createElement("div");
            flowerDiv.setAttribute("class", "flowers-class");
            flowersDivIds.push(flowerDiv);
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
            flowersSpace.style.padding = "45px";
            purchaseDiv.appendChild(flowerDiv);
            purchaseDiv.style.float = "left";
            purchaseDiv.style.position = "relative";
            purchaseDiv.style.width = "100%";

        }
        flowersSpace.appendChild(purchaseDiv);
    }
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
                alert('Error: Could not logout');
            }
        })
        .catch(error => alert(`Error: Could not logout: ${error}`));
}