// const router = require("../users/users-router");
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const {checkPasswordLength,checkUsernameFree,checkUsernameExists} = require('../auth/auth-middleware')

  router.post('/register', checkUsernameFree, checkPasswordLength, (req,res,next) => {
    const {username,password} = req.body
    const hash = bcrypt.hashSync(password, 8)

    User.add({ username,password:hash})
    .then(created => {
      res.status(201).json(created)
    })
    .catch(next)
  })


  router.post('/login', checkUsernameExists, (req,res,next) => {
  const {password} = req.body
  if(bcrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user
    res.json({message: `Welcome ${req.user.username}`})
  } else {
    next({status: 401, message: 'Invalid credentials'})
  }
  })


  router.get('/logout', (req, res,next) => {
    if(req.session.user) {
      req.session.destroy(err => {
        if(err) {
          next(err)
        } else {
          res.json({message: 'logged out'})
        }
      })
    } else {
      res.json({message: 'no session'})
    }
  })
 
// Don't forget to add the router to the exports object so it can be required in other modules
module.exports = router