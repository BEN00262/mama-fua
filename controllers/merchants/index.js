const { MerchantModel, MerchantLocationModel } = require("../../models");
const { 
    handle_exception, handle_response, 
    get_password_hash, get_jwt, get_random_string, 
    MamaFuaException, compare_passwords
} = require("../../utils");

class MerchantController {
    static async createAccount(req, res) {

        /* STEPS:
                * create the user account
                * send the verification code to the phone number
        */

        try {
            const { fullname, phone_number, password } = req.body;

            const merchant = await MerchantModel.create({
                fullname, phone_number,
                merchant_reference: get_random_string(24),
                password: get_password_hash(password)
            });

            // TODO: send the SMS code

            return handle_response({
                is_phone_number_verified: false,
                authToken: get_jwt({
                    merchantId: merchant._id
                })
            }, res, 201);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    static async verifyAccount(req, res) {
        try {
            // check the code against what we have
            const { verification_code } = req.params;

            if (req.merchant.verification_code === verification_code) {
                // throw an error
                return handle_exception(
                    new MamaFuaException('Invalid verification code'),
                    res, 400
                )
            }
            
            return handle_response({
                is_phone_number_verified: true,
                authToken: get_jwt({
                    merchantId: req.merchant._id
                })
            })
        } catch(error) {
            return handle_exception(error);
        }
    }

    static async login(req, res) {
        try {
            const { phone_number, password } = req.body;

            const merchant = await MerchantModel.findOne({
                phone_number
            });

            if (!merchant || !(await compare_passwords(password, merchant.password))) {
                return handle_exception(
                    new MamaFuaException(`Merchant with the given credentials doens't exist in our platform`),
                    res, 400
                )
            }

            if (!merchant.is_verified) {
                // TODO: send the SMS code
            }

            return handle_response({
                is_phone_number_verified: merchant.is_verified,
                authToken: get_jwt({
                    merchantId: merchant._id
                })
            }, res, 201);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    static async suspendAccount(req, res) {
        /* STEPS:
                * block the account ( or unblock )
                * send the notification to the account if the merchant is logged in ( cancel any jobs )
        */

        try {
            const { merchantId } = req.params;
            const { block_reason, is_blocked } = req.body;

            await MerchantModel.findOneAndUpdate({ _id: merchantId }, {
                is_blocked,
                block_reason
            });

            // TODO: send a notification to the merchant of the block and the reason | also send the notification if unblocked

            return handle_response({ status: true }, res);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    static async updateAccount(req, res) {
        /* STEPS:
                * update the user account
                * send the verification code to the phone number
        */

        try {
            const { fullname, phone_number, password } = req.body;

            const merchant = await MerchantModel.findOneAndUpdate({ _id: req.user._id }, {
                fullname: fullname ?? req.merchant.fullname, 
                phone_number: phone_number ?? req.merchant.phone_number,
                password: password ? get_password_hash(password) : req.merchant.password
            });

            return handle_response({ merchant }, res, 201);
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    // called by the app ( every minute to update the current location of the merchant )
    static async updateMerchantLocation(req, res) {
        try {
            await MerchantLocationModel.updateOne({ merchant: req.merchant._id }, { 
                merchant: req.merchant._id, 
                location: req.body.location 
            }, { upsert: true });

            return handle_response({ status: true }, res, 201);
        } catch(error) {
            return handle_exception(error, res);
        }
    }
}

module.exports = { MerchantController }