window.addEventListener("load", (loadEvent) => {
    console.log('Document had been loaded', loadEvent);

    console.log(`getting flowers data from server`);
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    let res;

    fetch(`http://localhost:5000/private/admin`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            let responseJson = JSON.parse(res);
            displayUsersData(responseJson);
            let searchButton = document.getElementById("search")
            searchButton.addEventListener("click", async (clickEvent) => {
                console.log('Search button has been clicked', clickEvent);
                let searchInput = document.getElementById("search-input").value;
                await displayUsersData(responseJson, searchInput);
            });
        })
        .catch(error => alert(`Error: Could not get users data: ${error}`));
});

async function displayUsersData(responseJson, searchInput = "") {
    let dataSpace = document.getElementById('data');
    dataSpace.innerHTML = "";
    if (responseJson["status"] === "empty") {
        dataSpace.style.padding = "60px";
        dataSpace.style.fontSize = "17px"
        dataSpace.innerHTML = "No users";
        return;
    } else if (responseJson["status"] === "2") {
        window.location.replace('http://localhost:5000/error-not-admin.html');
    }

    // make a list of all categories
    let firstUser = Object.keys(responseJson)[0];
    let categories = Object.keys(responseJson[firstUser]);

    // fill data for all users (or the searched user)
    for (let categoryIdx in categories) {
        let category = document.createElement("h4");
        let categoryName = categories[categoryIdx];
        category.innerHTML = categoryName;
        dataSpace.appendChild(category);

        // define the table
        let tbl = document.createElement('table');
        tbl.innerHTML = "";
        tbl.style.width = '100%';
        tbl.setAttribute('border', '1');
        let tbdy = document.createElement('tbody');
        tbdy.innerHTML = "";

        // loop users
        for (let username in responseJson) {
            if (searchInput.length == 0 || username.includes(searchInput)) {
                let trh = document.createElement('tr');
                let thUsername = document.createElement('th');
                let usernameText = document.createElement("p");
                usernameText.innerHTML = "username";
                thUsername.appendChild(usernameText);
                let usernameValue = document.createElement('td');
                let usernameValueText = document.createElement("p");
                usernameValue.appendChild(usernameValueText);
                let tr;
                switch (categoryName) {
                    case 'sid':
                        tr = document.createElement('tr');
                        if (username == firstUser){
                            let thPid = document.createElement('th');
                            let pidText = document.createElement("p");
                            pidText.innerHTML = "pid";

                            thPid.appendChild(pidText);

                            trh.appendChild(thUsername);
                            trh.appendChild(thPid);
                            tbdy.appendChild(trh);
                        }

                        let pidValueText = document.createElement('td');
                        let categoryData = document.createElement("p");
                        categoryData.innerHTML = JSON.stringify(responseJson[username][categoryName]);
                        usernameValueText.innerHTML = `${username}`;
                        pidValueText.appendChild(categoryData);
                        tr.appendChild(usernameValue);
                        tr.appendChild(pidValueText);
                        tbdy.appendChild(tr);
                        break;
                    case 'cart':
                    case 'wishList':
                        if (username == firstUser){
                            let thFlower = document.createElement('th');
                            let thPrice = document.createElement('th');
                            let thFlowerH = document.createElement("p");
                            let thPriceH = document.createElement("p");
                            thFlowerH.innerHTML = "Bouquet Name";
                            thPriceH.innerHTML = "Price";

                            thFlower.appendChild(thFlowerH);
                            thPrice.appendChild(thPriceH);

                            trh.appendChild(thUsername);
                            trh.appendChild(thFlower);
                            trh.appendChild(thPrice);
                            tbdy.appendChild(trh);
                        }

                        let flowers = responseJson[username][categoryName];
                        for (let flower in flowers) {
                            let tr2 = document.createElement('tr');
                            let thFlowerV = document.createElement('td');
                            let thUsernameVal = document.createElement('td');
                            let thPriceV = document.createElement('td');

                            let thFlowerVP = document.createElement("p");
                            let thUsernamePval = document.createElement("p");
                            let thPriceVP = document.createElement("p");
                            thFlowerVP.innerHTML = flower;
                            thUsernamePval.innerHTML = username;
                            thPriceVP.innerHTML = flowers[flower];

                            thFlowerV.appendChild(thFlowerVP);
                            thUsernameVal.appendChild(thUsernamePval);
                            thPriceV.appendChild(thPriceVP);

                            tr2.appendChild(thUsernameVal);
                            tr2.appendChild(thFlowerV);
                            tr2.appendChild(thPriceV);

                            tbdy.appendChild(tr2);
                        }
                        break;
                    case 'purchases':
                        if (username == firstUser){
                            let thPurchaseNumber = document.createElement('th');
                            let thFlowerName = document.createElement('th');
                            let thPriceHead = document.createElement('th');
                            let thPurchaseNumberV = document.createElement("p");
                            let thFlowerHV = document.createElement("p");
                            let thPriceHV = document.createElement("p");
                            thPurchaseNumberV.innerHTML = "Purchase Number";
                            thFlowerHV.innerHTML = "Bouquet Name";
                            thPriceHV.innerHTML = "Price";

                            thPurchaseNumber.appendChild(thPurchaseNumberV);
                            thFlowerName.appendChild(thFlowerHV);
                            thPriceHead.appendChild(thPriceHV);

                            trh.appendChild(thUsername);
                            trh.appendChild(thPurchaseNumber);
                            trh.appendChild(thFlowerName);
                            trh.appendChild(thPriceHead);
                            tbdy.appendChild(trh);
                        }

                        let purchases = responseJson[username][categoryName];
                        for (let purchase in purchases) {

                            let flowers = responseJson[username][categoryName][purchase];
                            for (let flower in flowers) {
                                let purchaseNumberTd = document.createElement('td');
                                let purchaseNumberValue = document.createElement("p");
                                purchaseNumberValue.innerHTML = purchase;
                                purchaseNumberTd.appendChild(purchaseNumberValue);

                                let tr2 = document.createElement('tr');
                                let thFlowerV = document.createElement('td');
                                let thUsernameVal = document.createElement('td');
                                let thPriceV = document.createElement('td');

                                let thFlowerVP = document.createElement("p");
                                let thUsernamePval = document.createElement("p");
                                let thPriceVP = document.createElement("p");
                                thFlowerVP.innerHTML = flower;
                                thUsernamePval.innerHTML = username;
                                thPriceVP.innerHTML = flowers[flower];

                                thFlowerV.appendChild(thFlowerVP);
                                thUsernameVal.appendChild(thUsernamePval);
                                thPriceV.appendChild(thPriceVP);

                                tr2.appendChild(thUsernameVal);
                                tr2.appendChild(purchaseNumberTd);
                                tr2.appendChild(thFlowerV);
                                tr2.appendChild(thPriceV);

                                tbdy.appendChild(tr2);
                            }
                        }
                        break;
                    case 'purchasesCounter':
                        tr = document.createElement('tr');
                        if (username == firstUser){
                            let thCounter = document.createElement('th');
                            let counterText = document.createElement("p");
                            counterText.innerHTML = "Total Number of Purchases ";

                            thCounter.appendChild(counterText);

                            trh.appendChild(thUsername);
                            trh.appendChild(thCounter);
                            tbdy.appendChild(trh);
                        }

                        let counterValue = document.createElement('td');
                        let counterValueText = document.createElement("p");
                        counterValueText.innerHTML = JSON.stringify(responseJson[username][categoryName]);
                        usernameValueText.innerHTML = `${username}`;
                        counterValue.appendChild(counterValueText);
                        tr.appendChild(usernameValue);
                        tr.appendChild(counterValue);
                        tbdy.appendChild(tr);
                        break;
                    case 'loginActivity':
                        if (username == firstUser){
                            tr = document.createElement('tr');
                            let thLoginDate = document.createElement('th');
                            let dateText = document.createElement("p");
                            dateText.innerHTML = "Login Date";

                            thLoginDate.appendChild(dateText);

                            trh.appendChild(thUsername);
                            trh.appendChild(thLoginDate);
                            tbdy.appendChild(trh);
                        }

                        let activities = responseJson[username][categoryName];
                        for (let activity in activities) {
                            let tr2 = document.createElement('tr');
                            let date = (new Date(responseJson[username][categoryName][activity])).toString();
                            let dateTd = document.createElement('td');
                            let dateValue = document.createElement("p");
                            dateValue.innerHTML = date;
                            dateTd.appendChild(dateValue);

                            let thUsernameTd = document.createElement('td');
                            let usernameValue = document.createElement("p");
                            usernameValue.innerHTML = username;
                            thUsernameTd.appendChild(usernameValue);

                            tr2.appendChild(thUsernameTd);
                            tr2.appendChild(dateTd);
                            tbdy.appendChild(tr2);
                        }
                        break;
                }
            }
        }
        tbl.appendChild(tbdy);
        dataSpace.appendChild(tbl);
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
                alert(`Error: Could not logout`);
            }
        })
        .catch(error => alert(`Error: Could not logout: ${error}`));
}