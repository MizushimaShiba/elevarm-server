const User = require('../models/User')
const Goride = require('../models/Goride')
const Joi = require('joi').extend(require('@joi/date'));
const moment = require('moment')

module.exports = class GorideController {
  static async create (req, res, next) {
    try {
      const schema = Joi.object().keys({
        fromWhere: Joi.string().required(),
        toWhere: Joi.string().required(),
        price: Joi.number().required(),
      })

      const {fromWhere, toWhere, price} = req.body

      const validate = schema.validate(req.body)

      if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

      const result = await Goride.create({userId: req.user.id, fromWhere, toWhere, finished: false, createdAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'), finishedAt: null, price})

      return res.status(200).json({
        message: "Order taken!",
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  static async readFromUser(req, res, next) {
    try {
      const user = await User.findById(req.user.id)

      const gorideOrder = await Goride.find({userId: req.user.id})

      return res.status(200).json({
        message: "SUCCESS!",
        data: {name: user.name, username: user.username, email: user.email, birthdate: user.birthdate, gorideOrder}
      })
    } catch (error) {
      next(error)
    }
  }

  static async orderDetail(req, res, next) {
    try {
      const gorideOrder = await Goride.findById(req.headers.id)

      return res.status(200).json({
        message: "SUCCESS!",
        data: gorideOrder
      })

    } catch (error) {
      next(error)
    }
  }

  static async orderFinished(req, res, next) {
    try {
      const updateGoride = await Goride.findByIdAndUpdate(req.headers.id, {finished: true, finishedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}, {new: true})

      return res.status(200).json({
        message: "Order Finished!",
        data: updateGoride
      })
    } catch (error) {
      next(error)
    }
  }

  static async changeOrder(req, res, next) {
    try {
      const schema = Joi.object().keys({
        fromWhere: Joi.string().optional(),
        toWhere: Joi.string().optional(),
        price: Joi.number().required(),
      })

      const {fromWhere, toWhere, price} = req.body

      const validate = schema.validate(req.body)

      if (validate.error) return res.status(422).json({message: validate.error.message, status: false})

      const updateOrder = await Goride.findByIdAndUpdate(req.headers.id, {fromWhere, toWhere, price}, {runValidators: true, omitUndefined: true,new: true})

      if (!updateOrder) return res.status(404).json({
        message: "Order unknown!",
        status: false
      })

      return res.status(200).json({
        message: "Order Updated!",
        data: updateOrder
      })
    } catch (error) {
      next(error)
    }
  }

  static async deleteOrder(req, res, next) {
    try {
      const deleteOrder = await Goride.findByIdAndDelete(req.headers.id)

      if (!deleteOrder) return res.status(404).json({
        message: "Order unknown!",
        status: false
      })

      return res.status(200).json({
        message: "Order deleted!"
      })
    } catch (error) {
      next(error)
    }
  }
}