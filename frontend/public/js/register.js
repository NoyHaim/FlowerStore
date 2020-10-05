window.addEventListener("load", (loadEvent) => {
    console.log('Document had been loaded', loadEvent);

    let registerButton = document.getElementById("register")
    registerButton.addEventListener("click", onRegister);
})

async function onRegister(clickEvent) {
    console.log('Register button has been clicked', clickEvent);

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;

    if (!validateUsername(username)){
        if (!validatePassword(password)){
            if(!validateEmail(email)){
                // Check with server
                console.log(`sending user:${username}, password:${password} and email:${email} to redis`);
                await register(username, password, email);
            }
        }
    }
}

function validateUsername(username){
    if (!username || username.length < 2) {
        // ERROR for username
        let errorMessage = "Username must contain at least 2 characters \n";
        let errorSpace = document.getElementById("error");

        console.error(`sending user:${username} the message: ${errorMessage}`);
        errorSpace.innerHTML = errorMessage;
        errorSpace.style.color = "red";
        return true;
    }
    return false;
}

function validatePassword(password){
    if (!password || password.length < 5) {
        // ERROR for password
        let errorMessage = "Password must contain at least 5 characters \n";
        let errorSpace = document.getElementById("error");

        console.error(`sending user:${username} the message:${errorMessage}`);
        errorSpace.innerHTML = errorMessage;
        errorSpace.style.color = "red";
        return true;
    }
    return false;
}

function validateEmail(email){
    if (!email || !email.includes('@')) {
        // ERROR for email
        let errorMessage = "Invalid email address \n";
        let errorSpace = document.getElementById("error");

        console.error(`sending user:${username} the message:${errorMessage}`);
        errorSpace.innerHTML = errorMessage;
        errorSpace.style.color = "red";
        return true;
    }
    return false;
}

async function register(username, password, email){
    let requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    let res;
    fetch(`http://localhost:5000/register?username=${username}&password=${password}&email=${email}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            res = result;
            redirectLogin(res);
        })
        .catch(error => alert(`Error: Could not register: ${error}`));
}

async function redirectLogin(response) {
    let response_json = JSON.parse(response)
    if (Object.keys(response_json).length > 0) {
        if (response_json["status"] == 1) {
            console.log("Redirecting user to home page");
            window.location.replace('http://localhost:5000/login.html');
        } else if (response_json["status"] == 2) {
            let errorMessage = "Username is unavailable.";
            let errorSpace = document.getElementById("error");
            console.error(`sending user the message: ${errorMessage}`);
            errorSpace.innerHTML = errorMessage;
            errorSpace.style.color = "red";
        } else {
            let errorMessage = "There was a problem with the registration process";
            let errorSpace = document.getElementById("error");
            console.error(`sending user the message: ${errorMessage}`);
            console.error(`sending user the message: ${errorMessage}`);
            errorSpace.innerHTML = errorMessage;
            errorSpace.style.color = "red";
        }
    } else {
        alert(`HTTP Error: ${response.status}`)
    }
}