const router = require('express').Router()
const JWT = require('jsonwebtoken')
const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController')
const GofoodController = require('../controllers/GofoodController')
const GorideController = require('../controllers/GorideController')
const User = require('../models/User')

router.get('/', (req, res) => {
  if (req.headers.token) {
    const token = JWT.verify(req.headers.token, process.env.JWT_KEY)
    if (token) {
      User.findById(token.id)
      .then(data => {
        if (data) {
          req.user = token
          next()
        } else {
          next({message: 'Please Login Again!'})
        }
      })
    }
  } else res.redirect('/login')
})

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

router.use(function(req, res, next) {
  try {
    const token = JWT.verify(req.headers.token, process.env.JWT_KEY)
    User.findById(token.id)
      .then(data => {
        if (data) {
          req.user = token
          next()
        } else {
          next({message: 'Please Login Again!'})
        }
      })
      
  } catch (error) {
    next(error)
  }
})

router.get('/profile', UserController.view)
router.put('/profile', UserController.update)
router.delete('/profile', UserController.destroy)
router.patch('/profile/password', UserController.password)


router.post('/order-food', GofoodController.create)
router.get('/order-list', GofoodController.readFromUser)
router.get('/order-detail', GofoodController.orderDetail)
router.patch('/order-finished', GofoodController.orderFinished)
router.put('/update-order', GofoodController.changeOrder)
router.delete('/delete-order-food', GofoodController.deleteOrder)

router.post('/order-ride', GorideController.create)
router.get('/ride-list', GorideController.readFromUser)
router.get('/ride-detail', GorideController.orderDetail)
router.patch('/ride-finished', GorideController.orderFinished)
router.put('/update-ride', GorideController.changeOrder)
router.delete('/delete-order-ride', GorideController.deleteOrder)


module.exports = router