const db = require("../models/index");
const jwt = require("jsonwebtoken");

exports.signIn = async function(req, res, next) {
	try {
		let user = await db.User.findOne({
			email: req.body.email
		});
		let {id, userName, profileImageUrl} = user;
		let isMatch = await user.comparePassword(req.body.password);
		if(isMatch) {
			let token = jwt.sign({
				id,
				userName,
				profileImageUrl
			},
				process.env.SECRET_KEY
			);
			return res.status(200).json({
				id,
				userName,
				profileImageUrl,
				token
			});
		} else {
			return next({
				status: 400,
				message: "Invalid email or password"
			})
		}
	} catch(e) {
		return next({
			status: 400,
			message: "Invalid email or password"
		})
	}


}

exports.signUp = async function(req, res, next) {
	try {
		//create a user
		//create a token

		let user = await db.User.create(req.body);
		let {id, userName, profileImageUrl} = user;
		let token = jwt.sign({
			id, 
			userName,
			profileImageUrl
		}, process.env.SECRET_KEY
		);
		return res.status(200).json({
			id, 
			userName,
			profileImageUrl,
			token
		})
	} catch(e){
		// if a validation fails
		if(e.code === 11000) {
			e.message = "Sorry, that username and/or email has been taken";
		}
		return next({
			status: 400,
			message: e.message 
		})
	}
}