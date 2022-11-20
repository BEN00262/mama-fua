const { CustomerController } = require('../../controllers');
const { Auth } = require('../../middlewares');

const router = require('express').Router();

// PROTECTED BY AUTH MIDDLEWARE

router.post('/', CustomerController.createAccount);
router.post('/login', CustomerController.login);

router.post(
    '/verify-account', 
    [Auth.EnsureIsAuthenticated("customers")],
    CustomerController.verifyAccount
);

router.put(
    '/update-account', 
    [Auth.EnsureIsAuthenticated("customers")],
    CustomerController.updateAccount
);

module.exports = router;