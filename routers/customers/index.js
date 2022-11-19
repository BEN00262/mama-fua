const { CustomerController } = require('../../controllers');

const router = require('express').Router();

// PROTECTED BY AUTH MIDDLEWARE

router.post('/', CustomerController.createAccount);
router.post('/login', CustomerController.login);
router.post('/verify-account', CustomerController.verifyAccount);
router.put('/update-account', CustomerController.updateAccount);

module.exports = router;