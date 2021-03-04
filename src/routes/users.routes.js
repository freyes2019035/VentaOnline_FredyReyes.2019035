const router = require('express').Router();
const md_auth = require('../middleWares/auth.middleware');
const userController = require('../controllers/users/users.controller');

router.post('/createAccount', userController.createUser)
router.put('/updateAccount/', md_auth.ensureAuth, userController.updateUser)
router.delete('/deleteAccount/', md_auth.ensureAuth, userController.deleteUser)
router.post('/addToCart', md_auth.ensureAuth, userController.addToCart)

module.exports = router;