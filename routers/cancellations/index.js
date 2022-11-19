const { CancellationController } = require('../../controllers');

const router = require('express').Router();

// PROTECTED BY ADMIN AUTH
router.get('/:merchantReference', CancellationController.getMerchantsCancellations);

// PROTECTED BY AUTH MIDDLEWARE

router.post('/', CancellationController.createCancellation);

module.exports = router;