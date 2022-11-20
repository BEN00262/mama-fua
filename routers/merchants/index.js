const { MerchantController }  = require('../../controllers');

const router = require('express').Router();

// PROTECTED BY AUTH MIDDLEWARE

router.post('/', MerchantController.createAccount);
router.post('/login', MerchantController.login);
router.post('/verify-account/:verification_code', MerchantController.verifyAccount);
router.put('/update-account', MerchantController.updateAccount);
router.put('/update-location', MerchantController.updateMerchantLocation);


module.exports = router;