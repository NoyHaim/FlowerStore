let purchases = {};

purchases.load = function(app, redisClient, sidUserDict) {
    app.get('/private/purchases', (req, res) => {
        try{
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            redisClient.hget('purchases', username, function (err, purchasesData) {
                if (purchasesData == null || purchasesData == "{}") {
                    res.send({"status": "empty"});
                } else {
                    res.send(purchasesData);
                }
            });
        } catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = purchases;