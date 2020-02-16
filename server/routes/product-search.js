const router = require('express').Router();

const algoliasearch = require('algoliasearch');
// const client = algoliasearch('9SA5PPC1N4', 'd0cd66994c1b2a3fbec69d0679914209');
const client = algoliasearch('9SA5PPC1N4', '183f7ddb740690df8b6fe7cd82008198');
const index = client.initIndex('gdesigns');

const objects = [
  {
    objectID: 1,
    name: "silk"
  }
];

index
  .saveObjects(objects)
  .then(({ objectIDs }) => {
    console.log(objectIDs);
  })
  .catch(err => {
    console.log(err);
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

