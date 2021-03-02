const router = require('express').Router();
const md_auth = require('../middleWares/auth.middleware');
const categoryController = require('../controllers/categories/category.controller');

router.post('/', md_auth.ensureAuth, categoryController.createCategory);
router.put('/:categoryId', md_auth.ensureAuth, categoryController.updateCategory)
router.get('/', md_auth.ensureAuth, categoryController.getCategories)
router.delete('/:categoryId', md_auth.ensureAuth, categoryController.deleteCategory)
module.exports = router;