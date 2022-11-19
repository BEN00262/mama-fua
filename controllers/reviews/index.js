const { ReviewModel } = require('../../models');
const { handle_exception, handle_response } = require('../../utils');

class ReviewsController {
    static async createReview(req, res) {
        /*
            STEPS:
                * create the review ( persist it in the db )
                * send a notification to the concerned merchant ( list the job referred )
                * fire an event for merchant viability index
        */
       try {
           // * create the review ( persist it in the db )
           const { merchantRefId, jobRefId } = req.params;
           const { comment, stars } = req.body;

           const review = await ReviewModel.create({
                comment, stars,
                customer: req.customer._id,
                merchant: merchantRefId, job: jobRefId
           });

           // TODO: * send a notification to the concerned merchant ( list the job referred )

           return handle_response({ review }, res, 201);
       } catch(error) {
            return handle_exception(error, res);
       }
    }

    // NOTE: do we allow editing of reviews ??
    static async updateReview(req, res) {
        /*
            STEPS:
                * update the review ( persist it in the db )
                * send a notification to the concerned merchant ( list the job referred )
        */
        try {
            // * update the review ( persist it in the db )
            const { review_id } = req.params;
            const { comment, stars } = req.body;

            const review = await ReviewModel.findOneAndUpdate({ _id: review_id }, {
                comment, stars
            });

            // TODO :: send a notification to the concerned merchant ( list the job referred )

            return handle_response({ review }, res);
        } catch(error) {
            return handle_exception(error, res);
        }
    }
}

module.exports = { ReviewsController }