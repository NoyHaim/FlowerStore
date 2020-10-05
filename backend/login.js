const shortid = require('shortid');
let login = {};

login.load = function(app, redisClient, userIdDict, usersInfoDict, updateLoginActivity, sidUserDict) {
    app.post('/login', (req, res) => {
        try{
            let username = req.query.username;
            let password = req.query.password;
            let rememberMe = req.query.remember;

            // validate login
            if (userIdDict[username] == undefined) {
                res.send({"status": "0"});
                return;
            }
            let id = userIdDict[username].id;
            if (id == undefined) {
                res.send({"status": "0"});
                return;
            }
            redisClient.hget('users', id, function (err, userData) {
                if (userData == null || userData == "{}" || userData == undefined) {
                    res.send({"status": "0"});
                    return;
                } else {
                    userData = JSON.parse(userData);
                    let currentPassword = userData.password;
                    if (currentPassword == undefined || currentPassword != password) {
                        res.send({"status": "0"});
                        return;
                    }
                    //user & password valid
                    let sid = shortid.generate();
                    if (rememberMe === "on") {
                        res.cookie('sid', sid);
                    } else {
                        //cookie expires in 30 min
                        res.cookie('sid', sid, {
                            expires: new Date(Date.now() + 1800000)
                        });
                    }
                    sidUserDict[sid] = username;
                    if (usersInfoDict[username] == undefined) {
                        usersInfoDict[username] = {
                            sid: sid,
                            cart: {},
                            wishList: {},
                            purchases: {},
                            purchasesCounter: 0,
                            loginActivity: {}
                        };
                    }
                    usersInfoDict[username].sid = sid;
                    updateLoginActivity(username, sid);

                    console.log(`LOGIN: user=${username} password=${password}`);
                    res.send({"status": "1"});
                }
            });
        }catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = login;