const User = require('../models/userModel')

class AuthController {
  async signUp(req, res) {
    try {
      const newUser = await User.create(req.body)
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
}

module.exports = { AuthController }
