const express = require('express')
const { PostController } = require('../controllers/postController')
const postController = new PostController()
const router = express.Router()

router
  .route('/')
  .get(postController.getAllPosts)
  .post(postController.createPost)

router
  .route('/:id')
  .get(postController.getOnePost)
  .patch(postController.updatePost)
  .delete(postController.deletePost)

module.exports = router
