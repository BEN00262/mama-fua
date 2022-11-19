const { JobController } = require('../../controllers/jobs');

const router = require('express').Router();

// PROTECTED BY THE ADMIN MIDDLEWARE
router.post('/confirm-settlement', JobController.verifySettlement);

// PROTECTED BY AUTH MIDDLEWARE

router.post('/', JobController.createJob);
router.post('/complete-job/:jobRefId', JobController.completeJob);
router.post('/reject-job/:jobRefId', JobController.rejectJob);
router.post('/settle-account/:jobRefId', JobController.settleAccount);
router.get('/list-my-jobs', JobController.listAllMyJobsClient);

router.get('/list-assigned-jobs', JobController.listAllMyJobsMerchant);

module.exports = router;