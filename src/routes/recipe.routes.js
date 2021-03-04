const recipeController = require('../controllers/recipe/recipe.controller');
const router = require('express').Router();
const md_auth = require('../middleWares/auth.middleware')


router.get('/', md_auth.ensureAuth, recipeController.finishPurchase);
router.get('/all', md_auth.ensureAuth, recipeController.getAllRecipes)
router.get('/number/:id', md_auth.ensureAuth, recipeController.getRecipe)

module.exports = router;