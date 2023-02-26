const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const NEWS_API_KEY = process.env.NEWS_API_KEY;

router.get('/articles', (req, res) => {
  fetch(`https://newsapi.org/v2/everything?sources=the-verge&apiKey=${NEWS_API_KEY}&pageSize=20`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        res.json({ articles: data.articles });
      } else {
        res.json({ articles: [] });
      }
    }).catch((error) => res.json({result: false, error: 'An error has occurred.', details: error}));
});

module.exports = router;
