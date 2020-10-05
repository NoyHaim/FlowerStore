let logout = {};

logout.load = function(app, sidUserDict) {
    app.post('/private/logout', (req, res) => {
        let sid = req.cookies.sid;
        if (sidUserDict[sid] == undefined) {
            res.send({"status": "0"});
            return;
        }
        delete sidUserDict[sid];
        res.send({"status": "1"});
    });
}

module.exports = logout;