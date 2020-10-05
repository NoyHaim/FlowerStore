const fetch = require('node-fetch');
const host = "http://localhost:5000";

async function testRegister() {
    //login
    let username = "tester";
    let password = "12345";
    let email = "tester@gmail.com";
    let result = await fetch(host + `/register?username=${username}&password=${password}&email=${email}`, {method: 'POST'});
    let jsonAns = JSON.parse(await result.text());
    if (jsonAns["status"] == 1) {
        console.log(`testRegister(): finished successfully`);
    } else {
        console.log(`testRegister(): failed`);
    }
}

async function testLogin() {
    //login
    let username = "tester";
    let password = "12345";
    let result = await fetch(host + `/login?username=${username}&password=${password}`, {method: 'POST'});
    let jsonAns = JSON.parse(await result.text());
    if (jsonAns["status"] == 1) {
        console.log(`testLogin(): finished successfully`);
    } else {
        console.log(`testLogin(): failed`);
    }
}

async function testPrivateRoute() {
    // try to add to cart bouquet without login
    let result = await fetch(host + `/private/add-to-cart?flower="not-existed-bouquet"&price="1000"`, {method: 'POST'});
    if (result.status == 401) {
        console.log(`testPrivateRoute(): finished successfully`);
    } else {
        console.log(`testPrivateRoute(): failed`);
    }
}


async function testAddToCart() {
    //login
    let username = "tester";
    let password = "12345";
    let res = await fetch(host + `/login?username=${username}&password=${password}`, {method: 'POST'});
    let cookie = res.headers.get('set-cookie').split(';')[0];

    // add to cart
    let bodyInfo = new URLSearchParams();
    bodyInfo.append("flower", "test-flower");
    bodyInfo.append("price", "100");
    res = await fetch(host + '/private/add-to-cart', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    let jsonAns = JSON.parse(await res.text());
    if (jsonAns["status"] == 1) {
        console.log(`testAddToCart(): finished successfully`);
    } else {
        console.log(`testAddToCart(): failed`);
    }

}

async function testAddToWishlist() {
    //login
    let username = "tester";
    let password = "12345";
    let res = await fetch(host + `/login?username=${username}&password=${password}`, {method: 'POST'});
    let cookie = res.headers.get('set-cookie').split(';')[0];

    // add to cart
    let bodyInfo = new URLSearchParams();
    bodyInfo.append("flower", "test-flower");
    bodyInfo.append("price", "100");
    res = await fetch(host + '/private/add-to-wishlist', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    let jsonAns = JSON.parse(await res.text());
    if (jsonAns["status"] == 1) {
        console.log(`testAddToWishlist(): finished successfully`);
    } else {
        console.log(`testAddToWishlist(): failed`);
    }
}

async function testRemoveFromWishlist() {
    //login
    let username = "tester";
    let password = "12345";
    let res = await fetch(host + `/login?username=${username}&password=${password}`, {method: 'POST'});
    let cookie = res.headers.get('set-cookie').split(';')[0];

    // add to wishlist
    let bodyInfo = new URLSearchParams();
    bodyInfo.append("flower", "test-flower");
    bodyInfo.append("price", "100");
    res = await fetch(host + '/private/add-to-wishlist', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    //remove from wishlist
    bodyInfo = new URLSearchParams();
    bodyInfo.append("flower", "test-flower");
    res = await fetch(host + '/private/remove-from-wishlist', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    let jsonAns = JSON.parse(await res.text());
    if (jsonAns["status"] == 1) {
        console.log(`testRemoveFromWishlist(): finished successfully`);
    } else {
        console.log(`testRemoveFromWishlist(): failed`);
    }

}


async function testRemoveFromCart() {
    //login
    let username = "tester";
    let password = "12345";
    let res = await fetch(host + `/login?username=${username}&password=${password}`, {method: 'POST'});
    let cookie = res.headers.get('set-cookie').split(';')[0];

    // add to cart
    let bodyInfo = new URLSearchParams();
    bodyInfo.append("flower", "test-flower");
    bodyInfo.append("price", "100");
    res = await fetch(host + '/private/add-to-cart', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    //remove from cart
    bodyInfo = new URLSearchParams();
    bodyInfo.append("flower", "test-flower");
    res = await fetch(host + '/private/remove-from-cart', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    let jsonAns = JSON.parse(await res.text());
    if (jsonAns["status"] == 1) {
        console.log(`testRemoveFromcart(): finished successfully`);
    } else {
        console.log(`testRemoveFromcart(): failed`);
    }

}

async function testCheckout() {
    //login
    let username = "tester";
    let password = "12345";
    let res = await fetch(host + `/login?username=${username}&password=${password}`, {method: 'POST'});
    let cookie = res.headers.get('set-cookie').split(';')[0];

    // add to cart
    let bodyInfo = new URLSearchParams();
    bodyInfo.append("flower", "test-flower");
    bodyInfo.append("price", "100");
    res = await fetch(host + '/private/add-to-cart', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    // checkout
    bodyInfo = new URLSearchParams();
    bodyInfo.append("flower", "test-flower");
    res = await fetch(host + '/private/checkout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    let jsonAns = JSON.parse(await res.text());
    if (jsonAns["status"] == 1) {
        console.log(`testCheckout(): finished successfully`);
    } else {
        console.log(`testCheckout(): failed`);
    }

}

async function testLogout() {
    //login
    let username = "tester";
    let password = "12345";
    let res = await fetch(host + `/login?username=${username}&password=${password}`, {method: 'POST'});
    let cookie = res.headers.get('set-cookie').split(';')[0];

    // Logout
    let bodyInfo = new URLSearchParams();
    res = await fetch(host + '/private/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        },
        body: bodyInfo
    });

    let jsonAns = JSON.parse(await res.text());
    if (jsonAns["status"] == 1) {
        console.log(`testLogout(): finished successfully`);
    } else {
        console.log(`testLogout(): failed`);
    }

}



// testRegister(); - should be ran only once (after that the user is not available anymore..)
testLogin();
testPrivateRoute();
testAddToCart();
testRemoveFromCart();
testAddToWishlist();
testRemoveFromWishlist();
testCheckout();
testLogout();
