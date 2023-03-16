const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const Joi = require('joi').extend(require('@joi/date'));
const User = require('../models/User')

module.exports = class UserController {
  static async view(req, res, next) {
    try {
      const user = await User.findById(req.user.id, 'name username birthdate email')
      
      return res.status(200).json({
        message: 'Okay!',
        data: user
      })
    } catch (error) {
      next(error)
    }
  }
  static async update(req,  res, next) {
    try {
      const schema = Joi.object().keys({
        email: Joi.string().optional(),
        name: Joi.string().optional(),
        username: Joi.string().optional(),
        birthdate: Joi.date().format('YYYY-MM-DD')
      })

      const validate = schema.validate(req.body)
      if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

      const { email, name, username, birthdate} = req.body

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {email, name, username, birthdate},
        {runValidators: true, omitUndefined: true, new: true})

      if (!user) return res.status(404).json({
        message: "User unknown!",
        status: false
      })
      
      return res.status(200).json({
        message: "User updated!",
        data: user
      })
    } catch (error) {
      next(error)
    }
  }
  static async destroy(req, res, next) {
    try {
      const user = await User.findByIdAndDelete(req.user.id)

      if (!user) return res.status(404).json({
        message: "User unknown!",
        status: false
      })
      
      return res.status(200).json({
        message: "User deleted!"
      })
    } catch (error) {
      next(error)
    }
  }
  static async password(req, res, next) {
    try {
      const schema = Joi.object().keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required()
      })
      
      const validate = schema.validate(req.body)
      if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

      const user = await User.findById(req.user.id, 'id email password')

      const compared = await bcrypt.compareSync(req.body.oldPassword, user.password)
      if (!compared) return res.status(404).json({message: 'Password error! Please try again'})

      const salt = await bcrypt.genSalt(10)
      console.log(req.body.newPassword)
      req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

      try {
        user.updateOne({
          password: req.body.newPassword
        })
      } catch (error) {
        throw new Error('PATCH ERROR')
      }

      return res.status(200).json({
        message: "Password updated!",
        data: {email: user.email, password: user.password}
      })
    } catch (error) {
      next(error)
    }
  }
}