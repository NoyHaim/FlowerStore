let checkout = {};

checkout.load = function(app, redisClient, sidUserDict, usersInfoDict) {
    app.post('/private/checkout', (req, res) => {
        try {
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            let copyCart = {};
            Object.assign(copyCart, usersInfoDict[username].cart);
            let purchaseId = usersInfoDict[username].purchasesCounter;
            usersInfoDict[username].purchases[purchaseId] = copyCart;
            redisClient.hmset('purchases', username, JSON.stringify(usersInfoDict[username].purchases));
            usersInfoDict[username].purchasesCounter++;
            redisClient.hmset('purchasesCounter', username, JSON.stringify(usersInfoDict[username].purchases));
            res.send({"status": "1"});
        } catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = checkout;