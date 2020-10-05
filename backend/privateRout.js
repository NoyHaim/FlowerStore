let privateRout = {};

privateRout.load = function(app, sidUserDict) {
    app.get('/private/*', (req, res, next) => {
        try {
            console.log(`Cookies:`, req.cookies);
            let sid = req.cookies.sid;
            if (sid && sidUserDict[sid]) {
                next();
            } else {
                res.send({"status": "2"});
            }
        } catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = privateRout;