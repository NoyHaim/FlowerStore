let cart = {};

cart.load = function(app, redisClient, sidUserDict, usersInfoDict) {
    app.get('/private/cart', (req, res) => {
        try {
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            redisClient.hget('cart', username, function (err, cartData) {
                if (cartData == null || cartData == "{}") {
                    res.send({"status": "empty"});
                } else {
                    res.send(cartData);
                }
            });
        } catch (e) {
            return res.sendStatus(500);
        }
    });

    app.post('/private/remove-from-cart', (req, res) => {
        try {
            let flowerName = req.query.flower;
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            delete usersInfoDict[username].cart[flowerName];
            redisClient.hmset('cart', username, JSON.stringify(usersInfoDict[username].cart));
            res.send({"status": "1"});
        } catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = cart;