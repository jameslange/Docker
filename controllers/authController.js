const User = require('../models/userModel')
const bcrypt = require('bcryptjs')

class AuthController {
  async signUp(req, res) {
    const { username, password } = req.body
    const hashpassword = await bcrypt.hash(password, 12)
    try {
      const newUser = await User.create({
        username,
        password: hashpassword,
      })
      req.session.user = newUser
      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      })
    } catch (e) {
      console.log(e)
      res.status(400).json({
        status: 'fail',
      })
    }
  }

  async login(req, res) {
    const { username, password } = req.body
    try {
      const user = await User.findOne({
        username,
      })
      if (!user) {
        return res.status(400).json({
          status: 'fail',
          message: 'user not found',
        })
      }

      const isCorrect = bcrypt.compare(password, user.password)
      if (isCorrect) {
        req.session.user = user
        return res.status(200).json({
          status: 'success',
        })
      } else {
        return res.status(400).json({
          status: 'fail',
          message: 'incorrect username OR pass',
        })
      }
    } catch (e) {
      console.log(e)
      return res.status(400).json({
        status: 'fail',
      })
    }
  }
}

module.exports = { AuthController }
