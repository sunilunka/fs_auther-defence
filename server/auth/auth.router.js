'use strict';

var router = require('express').Router();
var crypto  = require('crypto');

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');


router.post('/login', function (req, res, next) {
	User.findOne(req.body).exec()
	.then(function (user) {
		if (!user) throw HttpError(401);
		req.login(user, function () {
			res.json(user);
		});
	})
	.then(null, next);
});

router.post('/signup', function (req, res, next) {
	User.create(req.body)
	.then(function (user) {
		crypto.randomBytes(128, function(err, salt) {
			if(err) throw err;
				salt = new Buffer(salt).toString("hex");
				crypto.pbkdf2(user.password, salt, 7000, 256, function(err, hash){
					if(err) throw err;
					user.password = { salt: salt, 
						hash: (new Buffer(hash).toString("hex"))
					}
				})
			})
		req.login(user, function () {
			res.status(201).json(user);
		})
	})
	.then(null, next);
});

router.get('/me', function (req, res, next) {
	res.json(req.user);
});

router.delete('/me', function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;
