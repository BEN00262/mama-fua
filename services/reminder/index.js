const { Queue, Worker } = require('bullmq');
const { RoutineModel, JobModel } = require('../../models');
const { pushToQueue } = require('../../publisher');

let mama_fua_reminder_engine_instance = null;

class MamaFuaReminderEngineBase {
    // init the engine
    // expose a method to create a reminder(s)
    // expose a method to pause reminder(s)
    // expose a method to remove reminder(s)
    constructor () {
        this.queue_name = 'mama-fua-reminder-engine';
        this.queue = new Queue(this.queue_name)
    }

    async addReminder(name, routineRefId, cron_reminder_pattern) {
        await this.queue.add(
            name, {routineRefId},
            { repeat: { pattern: cron_reminder_pattern } },
            jobId
        );
    }

    async pauseReminders(name) {
        // figure this out
    }

    async removeReminders(name) {
        // figure this out too
    }

    startWorker() {
        // on error send a notification to us : but before just ignore it and move on
        const worker = new Worker(this.queue_name, async job => {
            // maybe we should ask the user first?

            const { routineRefId } = job.data;
            // just fire an event to the job scheduler ( create it and off we go )
            // send a notification to the guy and if they still want it we just send the guy :) is it the best way really ?
            // or we just create a job and try to assign it to someone ? ( lets work with this one for now )
            const routine = await RoutineModel.findOne({ _id: routineRefId });

            if (routine) {
                // only do work when we find something
                // create the job
                // basins, bring_own_supplies, basin_size ( add this on the routines )
                const pricing_per_basin = await PricingModel.findOne({
                    basin_size: routine.basin_size ?? 'standard'
                })

                if (pricing_per_basin) {
                    const automatic_job = await JobModel.create({
                        location: routine.location,
                        basins: routine.basins, bring_own_supplies: routine.bring_own_supplies,
                        customer: routine.customer,
                        cost: pricing_per_basin.price * basins + (routine.bring_own_supplies ? pricing_per_basin.additional_supplies_cost : 0)
                    });

                    // also notify the guy that an auto job has been created

                    // fire the assign job event
                    pushToQueue(process.env.ASSIGN_JOBS_QUEUE, { jobRefId: automatic_job._id });        
                }
            }

        });

        worker.on('error', error => {
            // send an email to us ( FIX the issue ASAP )
        })
    }
}

module.exports = {
    /**
     * @returns {MamaFuaReminderEngineBase}
     */
    MamaFuaReminderEngine: () => {
        if (!mama_fua_reminder_engine_instance) {
            mama_fua_reminder_engine_instance = new MamaFuaReminderEngineBase();
        }

        return mama_fua_reminder_engine_instance;
    }
}