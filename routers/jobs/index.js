const { JobController } = require('../../controllers/jobs');
const { Auth } = require('../../middlewares');

const router = require('express').Router();

// PROTECTED BY THE ADMIN MIDDLEWARE
router.post(
    '/confirm-settlement',
    [Auth.EnsureIsAuthenticated("admin")],
    JobController.verifySettlement
);

// PROTECTED BY AUTH MIDDLEWARE

router.post(
    '/', 
    [Auth.EnsureIsAuthenticated("customers")],
    JobController.createJob
);

router.post(
    '/complete-job/:jobRefId',
    [Auth.EnsureIsAuthenticated("merchant")],
    JobController.completeJob
);

router.post(
    '/reject-job/:jobRefId', 
    [Auth.EnsureIsAuthenticated("merchant")],
    JobController.rejectJob
);

router.post(
    '/settle-account/:jobRefId',
    [Auth.EnsureIsAuthenticated("merchant")],
    JobController.settleAccount
);

router.get(
    '/list-my-jobs', 
    [Auth.EnsureIsAuthenticated("customers")],
    JobController.listAllMyJobsClient
);

router.get(
    '/list-assigned-jobs',
    [Auth.EnsureIsAuthenticated("merchant")], 
    JobController.listAllMyJobsMerchant
);

module.exports = router;