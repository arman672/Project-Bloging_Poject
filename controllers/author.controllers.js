const authorSchema = require("../models/author.model");
const jwt = require("jsonwebtoken");

//===================================================[API:FOR CREATING AUTHOR DB]===========================================================
exports.authordata = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "plz enter author data" })
        if (!data.fname) return res.status(404).send({ status: false, msg: "fname missing" })
        if (!data.fname.match(/^[a-z]+$/i)) return res.status(400).send({ status: false, msg: "Please Enter a valid First Name" })
        if (!data.lname) return res.status(404).send({ status: false, msg: "lname missing" })
        if (!data.lname.match(/^[a-z]+$/i)) return res.status(400).send({ status: false, msg: "Please Enter a valid Last Name" })
        if (!data.title) return res.status(404).send({ status: false, msg: "tittle missing" })
        if (!data.emailId) return res.status(404).send({ status: false, msg: "email missing" })
        if (!data.password) return res.status(404).send({ status: false, msg: "password missing" })
        // if (!data.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        //     return res.status(404).send({ status: false, data: "Invalid email" })
       // }
        let email = await authorSchema.findOne({ emailId: data.emailId })
        if (email) return res.status(400).send({ status: false, msg: "email aleready exist" })
        let result = await authorSchema.create(data)
        return res.status(201).send({ result })
    }
    catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }
}

exports.loginauthor = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;

        let author = await authorSchema.findOne({ email: userName,password: password})
        if (!author)
            return res.status(400).send({
                status: false,
                msg: "username  is not correct",
            });
        let token = jwt.sign({ authorId: author._id.toString() }, 'lama',{expiresIn:'6d'});
        res.status(200).send({ status: true, data: token });
    }
    catch {
        res.status(500).send({ status: false, msg: err.message })
    }
};
