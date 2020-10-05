const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const redisClient = require('./redisConnector');
const login = require('./login');
const register = require('./register');
const purchases = require('./purchases');
const checkout = require('./checkout');
const wishlist = require('./wishlist');
const cart = require('./cart');
const store = require('./store');
const logout = require('./logout');
const home = require('./home');
const admin = require('./admin');
const privateRout = require('./privateRout');

const flowersPath = '../frontend/private/flowers_db.json';
const PORT = process.env.PORT || 5000;

let usersInfoDict = {};
let userIdDict = {};
let sidUserDict = {};
let idCounter = 1;

redisClient.on('connect', () => {
    fs.readFile(flowersPath, function (error, content) {
        //set up database
        setUpFlowers(content);

        //load users dict
        setUpUsersInfo();

        privateRout.load(app, sidUserDict);

        login.load(app, redisClient, userIdDict, usersInfoDict, updateLoginActivity, sidUserDict);

        register.load(app, redisClient, userIdDict, generateNewID);

        home.load(app, sidUserDict);

        admin.load(app, redisClient, sidUserDict, usersInfoDict);

        store.load(app, redisClient, sidUserDict, usersInfoDict);

        cart.load(app, redisClient, sidUserDict, usersInfoDict);

        wishlist.load(app, redisClient, sidUserDict, usersInfoDict);

        purchases.load(app, redisClient, sidUserDict);

        checkout.load(app, redisClient, sidUserDict, usersInfoDict);

        logout.load(app, sidUserDict);

        function setUpFlowers(content){
            let flowersJson = JSON.parse(content);
            for (let flower in flowersJson) {
                let value = flowersJson[flower];
                redisClient.hset('flowers', flower, value);
            }
            let adminUser = "admin";
            userIdDict[adminUser] = {};
            userIdDict[adminUser].id = 0;
            let adminDetails = {
                id: 0,
                username: adminUser,
                password: adminUser,
                email: "admin@gmail.com"
            };
            userIdDict[adminUser] = {};
            userIdDict[adminUser].id = 0;
            redisClient.hmset('users', 0, JSON.stringify(adminDetails));
        }

        function setUpUsersInfo(){
            redisClient.hgetall('users', function (err, usersData) {
                // setup known users
                if (usersData != null && usersData != "{}") {
                    for (let userId in usersData) {
                        let userData = JSON.parse(usersData[userId]);
                        let username = userData.username;
                        userIdDict[username] = {};
                        userIdDict[username].id = userId;
                        idCounter++;
                    }

                    // update local DB- usersInfoDict
                    for (let user in userIdDict) {
                        usersInfoDict[user] = {
                            sid: "",
                            cart: {},
                            wishList: {},
                            purchases: {},
                            purchasesCounter: 0,
                            loginActivity: {}
                        };
                        updateUserCart(user);
                        updateUserWishlist(user);
                        updateUserPurchases(user);
                        updateLoginActivity(user, "");
                    }
                }
            });
        }

        async function updateLoginActivity(username, sid) {
            redisClient.hget('loginActivity', username, function (err, userActivity) {
                if (userActivity === null || userActivity === undefined) {
                    usersInfoDict[username].loginActivity = JSON.parse("{}");
                } else {
                    usersInfoDict[username].loginActivity = JSON.parse(userActivity);
                }
                if (sid.length > 0) {
                    usersInfoDict[username].loginActivity[sid] = Date.now();
                    redisClient.hmset('loginActivity', username, JSON.stringify(usersInfoDict[username].loginActivity));
                }
            });
        }

        async function updateUserCart(username) {
            redisClient.hget('cart', username, function (err, userCart) {
                if (userCart == null || userCart == undefined) {
                    usersInfoDict[username].cart = JSON.parse("{}");
                } else {
                    usersInfoDict[username].cart = JSON.parse(userCart);
                }
            });
        }

        async function updateUserWishlist(username) {
            redisClient.hget('wishlist', username, function (err, userWishlist) {
                if (userWishlist == null || userWishlist == undefined) {
                    usersInfoDict[username].wishList = JSON.parse("{}");
                } else {
                    usersInfoDict[username].wishList = JSON.parse(userWishlist);
                }
            });
        }

        async function updateUserPurchases(username) {
            redisClient.hget('purchases', username, function (err, userPurchases) {
                if (userPurchases == null || userPurchases == undefined) {
                    usersInfoDict[username].purchases = JSON.parse("{}");
                } else {
                    usersInfoDict[username].purchases = JSON.parse(userPurchases);
                    usersInfoDict[username].purchasesCounter = Object.keys(usersInfoDict[username].purchases).length;
                }
            });
        }
    });
});


const generateNewID = function () {
    return idCounter++;
}

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(express.static(path.join(__dirname, '../frontend')));


app.listen(PORT, () => console.log(`Server started listening on port ${PORT}`));