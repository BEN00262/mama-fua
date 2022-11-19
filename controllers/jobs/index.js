const { JobModel, PricingModel, SettlementModel } = require("../../models");
const { pushToQueue } = require("../../publisher");
const { handle_exception, handle_response, MamaFuaException } = require("../../utils")

class JobController {
    static async createJob(req, res) {
        try {
            const { basins, bring_own_supplies, basin_size } = req.body;

            // get the cost of one basin 
            // use the basin size as the differentiator
            const pricing_per_basin = await PricingModel.findOne({
                basin_size: basin_size ?? 'standard'
            })

            if (!pricing_per_basin) {
                // throw an error on this
                return handle_exception(
                    new MamaFuaException("Failed tto fetch price associated with the basin size"),
                    res, 404
                )
            }

            const job = await JobModel.create({
                basins, bring_own_supplies,
                customer: req.customer._id,
                cost: pricing_per_basin.price * basins + (bring_own_supplies ? pricing_per_basin.additional_supplies_cost : 0)
            });

            // kick off a job to find a mama fua for this guy :)
            pushToQueue(process.env.ASSIGN_JOBS_QUEUE, {
                jobRefId: job._id
            });

            return handle_response({ job }, res);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    // static async acceptJob(req, res) {
    //     try {
    //         await JobModel.findOneAndUpdate({
    //             merchant: req.merchant._id,
    //             _id: req.params.jobRefId
    //         }, { status: 'claimed' });

    //         return handle_response({ status: true }, res);
    //     } catch(error) {
    //         return handle_exception(error, res);
    //     }
    // }

    static async completeJob(req, res) {
        try {
            await JobModel.findOneAndUpdate({
                merchant: req.merchant._id,
                _id: req.params.jobRefId
            }, { status: 'done' });

            // we are waiting for the settlement
            // fire an event

            return handle_response({ status: true }, res);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    static async rejectJob(req, res) {
        try {
            await JobModel.findOneAndUpdate({
                merchant: req.merchant._id,
                _id: req.params.jobRefId
            }, { status: 'rejected' });

            // reassign the job to someone else who aint this nigga :) ?
            pushToQueue(process.env.ASSIGN_JOBS_QUEUE, {
                jobRefId: req.params.jobRefId
            });

            return handle_response({ status: true }, res);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    /**
     * @description Allows a merchant to settle a debt with us
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    static async settleAccount(req, res) {
        try {
            const { jobRefId } = req.params;
            const { how_much, mpesa_reference } = req.body;

            // settle on a job
            const settlement = await SettlementModel.create({
                job: jobRefId,
                merchant: req.merchant._id,
                how_much, mpesa_reference
            })

            return handle_response({ settlement }, res, 201);
        } catch(error) {
            return handle_exception(error, res);
        }
    }


    /**
     * @description Allows a merchant to settle a debt with us only done by the admin ( sisi )
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
     static async verifySettlement(req, res) {
        try {
            const { settlement_reference } = req.params;

            // settle on a job
            const settlement = await SettlementModel.findOneAndUpdate({ _id: settlement_reference }, {
                is_settled: true
            }, { $new: true });

            // send a notification to the merchant

            return handle_response({ settlement }, res, 201);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    static async listAllMyJobsClient(req, res) {
        try {
            const jobs = await JobModel.findAll({
                customer: req.params.customerReference
            })

            return handle_response({ jobs }, res);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    static async listAllMyJobsMerchant(req, res) {
        try {
            const jobs = await JobModel.findAll({
                merchant: req.params.merchantReference
            })

            return handle_response({ jobs }, res);
        } catch(error) {
            return handle_exception(error, res);
        }
    }
}

module.exports = { JobController }