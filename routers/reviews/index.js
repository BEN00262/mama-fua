const { ReviewsController }  = require('../../controllers');

const router = require('express').Router();

// PROTECTED BY AUTH MIDDLEWARE

router.post('/:merchantRefId/:jobRefId ', ReviewsController.createReview);
router.put('/:review_id', ReviewsController.updateReview);


module.exports = router;