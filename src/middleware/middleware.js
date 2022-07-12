const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const BookModel = require("../models/bookModel");
const UserModel = require("../models/userModel");

let authentication = function (req, res, next) {
    try {
        const bookId = req.params.bookId;
        if (bookId) {
            if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "please provide valid format for bookId" })
        }
        let token = req.headers["x-api-key"];


        if (!token) return res.status(400).send({ status: false, message: "Token Must be Present" })

        let decodedToken = jwt.verify(token, "Room-60-Radon");
        if (!decodedToken)
            return res.status(401).send({ status: false, message: "token is invalid" })
        req.bookIdNew = decodedToken.userId

        next();
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

const authorisation = async function (req, res, next) {

    let userLoggedIn = req.bookIdNew
    let usersId = req.body.userId
    if (!usersId)
        return res.status(400).send({ status: false, message: "body should not remain empty" })
    console.log(userLoggedIn)
    try {
        let bookId = req.params.bookId

        if (bookId) {
            let usersId = await BookModel.findOne({ _id: bookId }).select({ userId: 1, _id: 0 })
            if (!usersId) return res.status(403).send({ status: false, msg: 'Please enter valid book ID' })
            let newAuth = usersId.userId.valueOf()
            if (newAuth != userLoggedIn) return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })
        }

        else if (userLoggedIn != usersId) return res.send({ status: false, msg: 'User logged is not allowed to modify the requested users data' })

        next()
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.authentication = authentication;
module.exports.authorisation = authorisation;