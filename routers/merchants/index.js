const { MerchantController }  = require('../../controllers');
const { Auth } = require('../../middlewares');

const router = require('express').Router();

router.post('/', MerchantController.createAccount);
router.post('/login', MerchantController.login);

router.post(
    '/verify-account/:verification_code',
    [Auth.EnsureIsAuthenticated("merchant")], 
    MerchantController.verifyAccount
);

router.put(
    '/update-account', 
    [Auth.EnsureIsAuthenticated("merchant")],
    MerchantController.updateAccount
);

router.put(
    '/update-location',
    [Auth.EnsureIsAuthenticated("merchant")],
    MerchantController.updateMerchantLocation
);


module.exports = router;