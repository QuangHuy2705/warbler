require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errHandler = require("./handlers/error");
const authRoutes = require("./routes/auth");
const messagesRoutes = require("./routes/messages");
const {loginRequired, ensureCorrectUser} = require("./middleware/auth");
const db = require("./models");
const circularJson = require("circular-json");

const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());

//routes over here
app.use("/api/auth", authRoutes);
app.use(
	"/api/users/:id/messages", 
	loginRequired, 
	ensureCorrectUser, 
	messagesRoutes
);

app.get("/api/messages", loginRequired, async function(req, res, next) {
	try {
		let messages = await db.Message.find().sort({createdAt: "desc"}).populate("user", {
			userName: true,
			profileImageUrl: true,
			text: true
		});
		return res.status(200).json(messages);
	} catch(e) {
		return next(e);
	}
});

app.use(function(req, res, next) {
	let err = new Error("Not Found");
	err.status = 404;
	next(err);
});

app.use(errHandler);

app.listen(PORT, function() {
	console.log(`Server is starting on PORT ${PORT}`);
})