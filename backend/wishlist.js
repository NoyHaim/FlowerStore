let wishlist = {};

wishlist.load = function(app, redisClient, sidUserDict, usersInfoDict) {
    app.get('/private/wishlist', (req, res) => {
        try {
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            redisClient.hget('wishlist', username, function (err, wishlistData) {
                if (wishlistData == null || wishlistData == "{}") {
                    res.send({"status": "empty"});
                } else {
                    res.send(wishlistData);
                }
            });
        } catch (e) {
            return res.sendStatus(500);
        }
    });

    app.post('/private/remove-from-wishlist', (req, res) => {
        try {
            let flowerName = req.query.flower;
            let sid = req.cookies.sid;
            let username = sidUserDict[sid];
            if (username == undefined) {
                return res.sendStatus(401);
            }
            delete usersInfoDict[username].wishList[flowerName];
            redisClient.hmset('wishlist', username, JSON.stringify(usersInfoDict[username].wishList));
            res.send({"status": "1"});
        } catch (e) {
            return res.sendStatus(500);
        }
    });
}

module.exports = wishlist;