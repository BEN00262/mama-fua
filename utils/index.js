const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { nanoid, customAlphabet } = require('nanoid');

class MamaFuaException extends Error {
    constructor(message) {
        super(message)
    }
}

const handle_exception = (error, res, status_code = 500 /* Server Error! -- by default */) => {
    console.log(error);

    const isSafeToDisplay = error instanceof MamaFuaException;

    return res.status(status_code).json({
        status: 'failed',
        error: isSafeToDisplay ? error.message : 'Server Error!'
    })
}

const handle_response = (data, res, status_code = 200 /* success by default */) => {
    return res.status(status_code).json({
        status: 'success', 
        data
    })
}

/**
 * 
 * @param {string} unhashed_password 
 * @returns string
 */
const get_password_hash = async (unhashed_password) => {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(unhashed_password, salt);
}

/**
 * 
 * @param {object} jwt_object 
 * @returns string
 */
const get_jwt = async (jwt_object) => {
    return jwt.sign(jwt_object, process.env.JWT_SECRET_KEY)
}

/**
 * 
 * @param {number} length 
 * @returns string
 */
 const get_random_string = async (length) => {
    return nanoid(length)
}

const numbers = customAlphabet('0123456789', 6);

const gen_verification_code = (length = 6) => numbers(length)

const compare_passwords = async (password, hash) => {
    return await bcrypt.compare(password, hash)
}

module.exports = {
    MamaFuaException, gen_verification_code,
    handle_exception, handle_response, get_password_hash,
    get_jwt, get_random_string, compare_passwords
}