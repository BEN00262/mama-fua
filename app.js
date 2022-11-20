require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const { CancellationRoute, CustomerRoute, JobRoute, ReviewRoute } = require('./routers');


const PORT = +process.env.PORT || 3300;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/cancellations', CancellationRoute);
app.use('/customer', CustomerRoute);
app.use('/jobs', JobRoute);
app.use('/reviews', ReviewRoute);


;(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        })

    } catch(error) {
        console.log("Failed to connect to the DB");
        console.error(error);
    }
})()