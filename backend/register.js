let register = {};

register.load = function(app, redisClient, userIdDict, generateNewID){
    app.use('/register', (req, res) => {
        try{
            let id = generateNewID();
            let username = req.query.username;
            if (userIdDict[username] != undefined) {
                res.send({"status": "2"});
                return;
            }
            let password = req.query.password;
            let email = req.query.email;
            let userDetails = {
                id: id,
                username: username,
                password: password,
                email: email
            };
            userIdDict[username] = {};
            userIdDict[username].id = id;
            redisClient.hmset('users', id, JSON.stringify(userDetails));
            res.send({"status": "1"});
        }catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = register;