let store = {};

store.load = function(app, redisClient, sidUserDict, usersInfoDict) {
    app.get('/private/store', (req, res) => {
        try {
            let sid = req.cookies.sid;
            if (sidUserDict[sid] == undefined) {
                return res.sendStatus(401);
            }
            redisClient.hgetall("flowers", function (err, flowersData) {
                res.send(flowersData);
            });
        } catch (e) {
            return res.sendStatus(500);
        }
    });

    app.post('/private/add-to-cart', (req, res) => {
        try {
            let flowerName = req.query.flower;
            let price = req.query.price;
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            usersInfoDict[username].cart[flowerName] = price;
            redisClient.hmset('cart', username, JSON.stringify(usersInfoDict[username].cart));
            res.send({"status": "1"});
        } catch (e) {
            return res.sendStatus(500);
        }
    });

    app.post('/private/add-to-wishlist', (req, res) => {
        try {
            let flowerName = req.query.flower;
            let price = req.query.price;
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            usersInfoDict[username].wishList[flowerName] = price;
            redisClient.hmset('wishlist', username, JSON.stringify(usersInfoDict[username].wishList));
            res.send({"status": "1"});
        } catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = store;