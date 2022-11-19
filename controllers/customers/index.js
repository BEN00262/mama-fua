const { CustomerModel } = require("../../models");
const { handle_exception, get_password_hash, handle_response, get_jwt, gen_verification_code, MamaFuaException } = require("../../utils")

class CustomerController {
    static async createAccount(req, res) {
        try {
            const { fullname, phone_number, password } = req.body;

            const verification_code = gen_verification_code();

            const customer = await CustomerModel.create({
                fullname, phone_number,
                verification_code,
                password: get_password_hash(password)
            });


            // TODO: send an SMS with the code

            return handle_response({
                is_phone_number_verified: false,
                authToken: get_jwt({
                    customerId: customer._id
                })
            })
        } catch(error) {
            return handle_exception(error, res);
        }
    }

    static async login(req, res) {
        try {
            const { phone_number, password } = req.body;

            const customer = await Customer.findOne({
                phone_number
            });

            if (!customer || !(await compare_passwords(password, customer.password))) {
                return handle_exception(
                    new MamaFuaException(`Merchant with the given credentials doens't exist in our platform`),
                    res, 400
                )
            }

            if (!customer.is_verified) {
                // TODO: send the SMS code
            }

            return handle_response({
                is_phone_number_verified: customer.is_verified,
                authToken: get_jwt({
                    merchantId: customer._id
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

            if (req.customer.verification_code === verification_code) {
                // throw an error
                return handle_exception(
                    new MamaFuaException('Invalid verification code'),
                    res, 400
                )
            }
            
            return handle_response({
                is_phone_number_verified: true,
                authToken: get_jwt({
                    customerId: req.customer._id
                })
            })
        } catch(error) {
            return handle_exception(error);
        }
    }

    static async updateAccount(req, res) {
        try {
            const { fullname, phone_number, password } = req.body;

            const customer = await CustomerModel.findOneAndUpdate({ _id: req.user._id }, {
                fullname: fullname ?? req.customer.fullname,
                phone_number: phone_number ?? req.customer.phone_number,
                password: password ? get_password_hash(password) : req.customer.password
            });

            return handle_response({ customer }, res);
        } catch(error) {
            return handle_exception(error, res);
        }
    }
}

module.exports = { CustomerController }