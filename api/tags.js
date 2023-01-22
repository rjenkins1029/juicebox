const express = require('express');
const tagsRouter = express.Router();

const { 
  getAllTags,
  getPostsByTagName
} = require('../db');

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});


tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  
  const { tagName } = req.params;
  
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  const token = auth.slice(prefix.length);

  try {
    
    const allPosts = await getPostsByTagName(tagName)
    const { id } = jwt.verify(token, JWT_SECRET);
    

    const  posts = allPosts.filter(post => {
      return post.active && (post.author.id === id)
    });


    res.send({ posts: posts })

  } catch ({ name, message }) {
    
    next({ name, message });
  }
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags()

  res.send({
    tags
  });
});

module.exports = tagsRouter;