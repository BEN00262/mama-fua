const { Agenda } = require('@hokify/agenda');
const { RoutineModel, JobModel } = require('../../models');
const { pushToQueue } = require('../../publisher');

let mama_fua_reminder_engine_instance = null;

class MamaFuaReminderEngineBase {
    // init the engine
    // expose a method to create a reminder(s)
    // expose a method to pause reminder(s)
    // expose a method to remove reminder(s)
    constructor () {
        this.agenda = new Agenda({ db: { address: process.env.MONGO_URI } });
        this.scheduled_jobs = [];
    }

    async addReminder(name, routineRefId, reminder_pattern, repeat = true) {
        this.agenda.define(name, async job => {
            // run your stuff here
            // maybe we should ask the user first?
            // just fire an event to the job scheduler ( create it and off we go )
            // send a notification to the guy and if they still want it we just send the guy :) is it the best way really ?
            // or we just create a job and try to assign it to someone ? ( lets work with this one for now )
            const routine = await RoutineModel.findOne({ _id: routineRefId });

            if (routine) {
                // if the routine is paused just do nothing at the time
                if (routine.is_paused) {
                    return;
                }


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

        this.scheduled_jobs.push({ name, reminder_pattern, repeat });
    }

    // async pauseReminders(name) {
    //     // figure this out
    // }

    async removeReminders(name) {
        // figure this out too
        // the job names are unique
        // remove it
        await this.agenda.cancel({ name })
    }

    async startWorker() {
        // on error send a notification to us : but before just ignore it and move on
        console.log(process.env.MONGO_URI)
        await this.agenda.start();

        for (const { name, reminder_pattern, repeat } of this.scheduled_jobs) {
            await this.agenda?.[repeat ? 'every' : 'schedule'](reminder_pattern, name);
        }
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