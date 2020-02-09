const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch('9SA5PPC1N4', 'd0cd66994c1b2a3fbec69d0679914209');
const index = client.initIndex('gdesigns');

index.setSettings({
  searchableAttributes: [
    'body_html',
    'options',
    'tags',
    'title',
    'variant_title'
  ],
  customRanking: ['desc(popularity)'],
});

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

