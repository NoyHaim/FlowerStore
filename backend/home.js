let home = {};

home.load = function(app, sidUserDict) {
    app.get('/private/home', (req, res) => {
        try {
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            res.send({"username": `${username}`});
        } catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = home;