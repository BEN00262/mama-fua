const { CancellationController } = require('../../controllers');
const { Auth } = require("../../middlewares");

const router = require('express').Router();

router.get(
    '/:merchantReference', 
    [Auth.EnsureIsAuthenticated("admin")], // not implemented yet
    CancellationController.getMerchantsCancellations
);

router.post(
    '/',
    [Auth.EnsureIsAuthenticated("customer")],
    CancellationController.createCancellation
);

module.exports = router;