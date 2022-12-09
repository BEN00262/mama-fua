require('dotenv').config({
    path: require('find-config')('.env')
})

const { MamaFuaReminderEngine } = require("./reminder");

;(async () => {
    console.log("started the email reminder service");
    await MamaFuaReminderEngine().startWorker()
})();