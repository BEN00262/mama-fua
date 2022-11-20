const { handle_exception } = require("../../utils")

class RoutineController {
    // create the routine
    static async createRoutine(req, res) {
        try {

        } catch(error) {
            return handle_exception(error, res);
        }
    }

    // add timestamps to the reminders routine ( register the job immediately for running )
    static async addTimestampsToRoutine(req, res) {
        try {

        } catch(error) {
            return handle_exception(error, res);
        }
    }

    // pause the timestamps ( the routine )
    static async pauseRoutine(req, res) {
        try {

        } catch(error) {
            return handle_exception(error, res);
        }
    }

    // unpause the reminders and start them again
    static async unPauseRoutine(req, res) {
        try {

        } catch(error) {
            return handle_exception(error, res);
        }
    }

    // update timestamps
    static async updateRoutine(req, res) {
        try {

        } catch(error) {
            return handle_exception(error, res);
        }
    }

    // remove all the reminders for this job
    static async deleteRoutine(req, res) {
        try {

        } catch(error) {
            return handle_exception(error, res);
        }
    }

    // in this case just stop the reminders for this job
    static async removeTimestampFromRoutine(req, res) {
        try {

        } catch(error) {
            return handle_exception(error, res);
        }
    }
}

module.exports = { RoutineController }