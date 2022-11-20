const { ReviewsController }  = require('../../controllers');
const { Auth } = require('../../middlewares');

const router = require('express').Router();

// PROTECTED BY AUTH MIDDLEWARE

router.post(
    '/:merchantRefId/:jobRefId ',
    [Auth.EnsureIsAuthenticated("customer")], 
    ReviewsController.createReview
);
router.put(
    '/:review_id',
    [Auth.EnsureIsAuthenticated("customer")],  
    ReviewsController.updateReview
);


module.exports = router;