const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('9SA5PPC1N4', '0b716b0faa4b4c216bb47a1ddcc18338');
const index = client.initIndex('gdesigns');

router.get('/', (req, res, next) => {
  if (req.query.query) {
    index.search({
      query: req.query.query,
      page: req.query.page,
    }, (err, content) => {
      res.json({
        success: true,
        message: "Here is your search",
        status: 200,
        content: content,
        search_result: req.query.query
      });
    });
  }
});

module.exports = router;

