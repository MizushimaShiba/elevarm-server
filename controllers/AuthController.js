const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi').extend(require('@joi/date'));
const moment = require('moment')
const User = require('../models/User')

module.exports = class AuthController {
    static async register(req, res, next) {
        try {
            const schema = Joi.object().keys({
                email: Joi.string().required(),
                password: Joi.string().required(),
                name: Joi.string().required(),
                username: Joi.string().required(),
                birthdate: Joi.date().format('YYYY-MM-DD')
            })

            const validate = schema.validate(req.body)

            if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

            const isEmailAlready = await User.findOne({email: req.body.email})

            if (isEmailAlready) return res.status(403).json({message: 'Email sudah terdaftar!', status: false})


            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password, salt);


            const result = await User.create(req.body)


            const token = jwt.sign({username: result.username, email: result.email, id: result.id}, process.env.JWT_KEY, {
                expiresIn: '15h'
            })
            
            return res.status(200).json({
                message: 'Register success!',
                data: {username: result.username, email: result.email, id: result.id, token: token}
            })
        } catch (error) {
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            const schema = Joi.object().keys({
                email: Joi.string().required(),
                password: Joi.string().required()
            })

            const validate = schema.validate(req.body)
            if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

            const user = await User.findOne({email: req.body.email})

            if (!user) return res.status(404).json({message: 'Email and / or password Error'})
            const compared = await bcrypt.compareSync(req.body.password, user.password)
            if (!compared) return res.status(404).json({message: 'Email and / or password Error'})

            const token = jwt.sign({username: user.username, email: user.email, id: user.id}, process.env.JWT_KEY, {
                expiresIn: '15h'
            })

            user.token = token
            return res.status(200).json({
                message: 'Success!',
                data: {username: user.username, email: user.email, id: user.id, token: user.token}
            })
        } catch (error) {
            next(error)
        }
    }

}