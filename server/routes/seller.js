const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: "AKIAIA65I6AWJM6B23WQ", secretAccessKey: "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" });

const checkJWT = require('../middlewares/check-jwt');

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'gdesign',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});


router.route('/products')
  .get(checkJWT, (req, res, next) => {
    Product.find({ owner: req.decoded.user._id })
      .populate('owner')
      .populate('category')
      .exec((err, products) => {
        if (products) {
          res.json({
            success: true,
            message: "Products",
            products: products
          });
        }
      });
  })
  .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
    console.log(upload);
    console.log(req.file);
    let product = new Product();
    product.owner = req.decoded.user._id;
    product.category = req.body.categoryId;
    product.title = req.body.title;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.file.location;
    product.save();
    res.json({
      success: true,
      message: 'Successfully Added the product'
    });
  });

  router.route('/products/delete')
  .get(checkJWT, (req, res, next) => {
    Product.findByIdAndRemove({ _id: req.query.id }, function (err, products) {
      if (err) {
        console.log('error deleting product ', err);
      } else {
        res.json({
          success: true,
          products: products,
          message: products !== null ? 'Successfully deleted the product' : 'Product not found'
        });
      }
    });

  });

module.exports = router;
