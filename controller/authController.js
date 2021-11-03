const db = require("../models");
const Account = db.accounts;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    async register(req, res) {
        const hasedPassword = await bcrypt.hashSync(req.body.password);
        const body = {
            username: req.body.username,
            password: hasedPassword,
            email: req.body.email
        }
        try {
            await Account.findOne({
                where: {
                    username: req.body.username
                }
            }).then((accountData) => {
                if (!accountData) {
                    Account.create(body).then((data) => {
                        delete data.dataValues['password']
                        res.status(200).send({
                            status: true,
                            messages: "Success",
                            results: data.dataValues
                        })
                    }).catch((error) => {
                        res.status(500).send({
                            status: false,
                            messages: "Some error occurred while register Account",
                            results: error
                        });
                    })
                } else {
                    res.status(400).send( {
                        status: false,
                        messages: 'Username already exist',
                        results: null
                    }
                    );
                }
            }).catch((err) => {
                res.status(400).send(err);
            });
        } catch (error) {
            res.status(500).send({
                status: false,
                messages: "Some error occurred while register Account",
                results: error
            });
        }
    },

    async login(req, res) {
        const account = await Account.findOne({
            where: {
                username: req.body.username
            }
        })
        if (account) {
            const password = await bcrypt.compare(req.body.password, account.password);
            if (!password) {
                return res.status(400).send({
                    status: false,
                    messages: 'Invalid password'
                });
            }
            const token = jwt.sign({id:account.id}, process.env.TOKEN_SECRET);
            res.header('auth-token', token).send({results: account, token, status: true, messages:'Success login'});
        } else {
            return res.status(400).send({
                status: false,
                messages: 'Username is not found'
            });
        }
    }
}