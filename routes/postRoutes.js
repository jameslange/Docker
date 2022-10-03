const express = require('express')
const { PostController } = require('../controllers/postController')
const protect = require('../middleware/authMiddleware')
const postController = new PostController()
const router = express.Router()

router
  .route('/')
  .get(protect, postController.getAllPosts)
  .post(protect, postController.createPost)

router
  .route('/:id')
  .get(protect, postController.getOnePost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost)

module.exports = router
