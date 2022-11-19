const { CancellationModel } = require("../../models");
const { handle_exception, handle_response } = require("../../utils")

class CancellationController {
    static async createCancellation(req, res) {
        /*
            STEPS:
                * remove the merchant from the job
                * save the cancellation message if any ( for merchant reviews later )
                * send a notification to the merchant to inform them of the cancellation and the reason why
        */
       try {
            const { merchantRefId, jobRefId } = req.params;
            const { reason } = req.body;

            const cancellation = await CancellationModel.create({
                reason,
                merchant: merchantRefId,
                customer: req.customer._id,
                job: jobRefId
            });

            // TODO: send a notificattion to the merchant of the cancellation ( sorry ... i guess ouch! )

            return handle_response({ cancellation }, res, 201);
       } catch(error) {
            return handle_exception(error, res);
       }
    }

    // from this we can either decide if the guy is the best fit for the company
    static async getMerchantsCancellations(req, res) {
        try {
            const { merchantReference } = req.params;

            const cancellations = await CancellationModel.findAll({ 
                merchant: merchantReference // resolve the jobs also
            }).populate('merchant').populate('job');

            return handle_response({ cancellations }, res)
        } catch(error) {
            return handle_exception(error, res);
        }
    }
}

module.exports = { CancellationController }