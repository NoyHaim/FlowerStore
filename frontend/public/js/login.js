window.addEventListener("load", (loadEvent) => {
    console.log('Document had been loaded', loadEvent);

    let loginButton = document.getElementById("login");
    loginButton.addEventListener("click", onLogin);
})

async function onLogin(clickEvent) {
    console.log('Login button has been clicked', clickEvent);

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let remember = document.getElementById("remember").checked;

    if (!validateUsername(username)) {
        if (!validatePassword(password)) {
            // Check username and password
            console.log(`sending user:${username} and password:${password} to server`);
            await checkUserPass(username, password, remember);
        }
    }
}

function validateUsername(username) {
    if (!username || username.length < 2) {
        // ERROR for username
        let errorMessage = "Username must contain at least 2 characters \n";
        console.error(`sending user:${username} the message: ${errorMessage}`);
        let errorSpace = document.getElementById("error");
        errorSpace.innerHTML = errorMessage;
        errorSpace.style.color = "red";
        return true;
    }
    return false;
}

function validatePassword(password) {
    if (!password || password.length < 5) {
        // ERROR for password
        let errorMessage = "Password must contain at least 5 characters \n";
        console.error(`sending user:${username} the message:${errorMessage}`);
        let errorSpace = document.getElementById("error");
        errorSpace.innerHTML = errorMessage;
        errorSpace.style.color = "red";
        return true;
    }
    return false;
}

async function checkUserPass(username, password, remember) {
    let requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };
    let res;
    fetch(`http://localhost:5000/login?username=${username}&password=${password}&remember=${remember}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            redirectHome(res);
        })
        .catch(error => alert(`Error: Could not login: ${error}`));
}

async function redirectHome(response) {
    let responseJson = JSON.parse(response)
    if (Object.keys(responseJson).length > 0) {
        if (responseJson["status"] == 1) {
            console.log("Redirecting user to home page");
            window.location.replace('http://localhost:5000/private/home.html');
        } else {
            let errorMessage = "Username or Password incorrect";
            console.error(`sending user the message: ${errorMessage}`);
            let errorSpace = document.getElementById("error");
            errorSpace.innerHTML = errorMessage;
            errorSpace.style.color = "red";
        }
    } else {
        alert(`HTTP Error: ${response.status}`)
    }
}