const consola = require('consola');
const { CustomerModel, MerchantModel } = require("../../models");
const { MamaFuaException, destructure_jwt } = require("../../utils");

const parseAuthorizationHeader = (AuthorizationHeaderValue) => {
    if (!AuthorizationHeaderValue) {
        throw new MamaFuaException('Failed to get the authorization header');
    }

    // check to see if its the Bearer auth format
    const XAccessTokenHeaderAuth = AuthorizationHeaderValue.trim();

    if (!XAccessTokenHeaderAuth) {
        throw new MamaFuaException('Malformed authentication header. Please use the x-access-token format')
    }

    return XAccessTokenHeaderAuth;
}

const handle_authentication_errors = (error, res, status_code = 403) => {
    consola.error(error);

    // also check for jwt errors
    const isSafeToDisplayException = error instanceof MamaFuaException
        || error instanceof TokenExpiredError || error instanceof JsonWebTokenError
        || error instanceof NotBeforeError;

    return res.status(isSafeToDisplayException ? status_code : 500).json({
        status: 'failed',
        message: [ isSafeToDisplayException ? error.message : 'Unknown error occurred!' ]
    })
}

module.exports = {
    EnsureIsAuthenticated: (expected_who = 'customer') => async (req, res) => {
        try {
            const { customerId, merchantId } = destructure_jwt(

                // authToken from the headers
                parseAuthorizationHeader(
                    req.headers.authorization || req.headers['x-access-token']
                )
            );

            switch(expected_who.toLowerCase()) {
                case "customer":
                    if (customerId) {
                        const customer = await CustomerModel.findOne({ _id: customerId });
        
                        if (!customer) {
                            throw new MamaFuaException("Invalid authentication token");
                        }
        
                        req.customer = customer;
                    } else {
                        throw new MamaFuaException("Invalid authentication token");
                    }
                    break;
                case "merchant":
                    if (merchantId) {
                        const merchant = await MerchantModel.findOne({ _id: merchantId });
        
                        if (!merchant) {
                            throw new MamaFuaException("Invalid authentication token");
                        }
        
                        req.merchant = merchant;
                    } else {
                        throw new MamaFuaException("Invalid authentication token");
                    }
                    break;
                default:
                    // throw an error :)
                    throw new MamaFuaException("Failed to decode the authentication token")
            }

            return next();
        } catch(error) {
            // 403
            return handle_authentication_errors(error, res);
        }
    }
}