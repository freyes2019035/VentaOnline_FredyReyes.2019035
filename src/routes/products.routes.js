const router = require('express').Router();
const productsController = require('../controllers/products/products.controller')
const md_auth = require('../middleWares/auth.middleware')


router.post('/', md_auth.ensureAuth, productsController.createProduct)
router.delete('/:id', md_auth.ensureAuth, productsController.deleteProduct)
router.put('/:id', md_auth.ensureAuth, productsController.updateProduct)
router.get('/', md_auth.ensureAuth, productsController.getProducts)
router.get('/product/:id', md_auth.ensureAuth, productsController.getProduct)
router.get('/name', md_auth.ensureAuth, productsController.searchProductByName)
module.exports = router;