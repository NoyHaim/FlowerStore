let admin = {};

admin.load = function(app, redisClient, sidUserDict, usersInfoDict) {
    app.get('/private/admin', (req, res) => {
        try {
            let sid = req.cookies.sid;
            if (sidUserDict[sid] === "admin") {
                res.send(JSON.stringify(usersInfoDict));
            } else {
                res.send({"status": "2"});
            }
        } catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = admin;