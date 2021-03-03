const router = require('express').Router();
const md_auth = require('../middleWares/auth.middleware');
const adminController = require('../controllers/users/admin.controller');

router.post('/createUser', md_auth.ensureAuth, adminController.createUser)
router.put('/updateUser/:userID', md_auth.ensureAuth, adminController.updateUser)
router.delete('/deleteUser/:userID', md_auth.ensureAuth, adminController.deleteUser)


module.exports = router;