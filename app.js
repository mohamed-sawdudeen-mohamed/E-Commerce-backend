const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const apiRouter = require('./routes/api')



dotenv.config();

mongoose
    .connect(process.env.MONGODB_URL, {useNewUrlParser:true, useUnifiedTopology:true })
    .then(() => console.log("DB Connection Success"))
    .catch((err) => console.log("DB Connection not success", err))


const app = express();
app.use(express.json())


app.use("/api", apiRouter)

app.get('/', (req, res, next) => {
    res.send('E-Commerce Web Application')
})

app.listen(process.env.PORT, () => {
    console.log("App is running on http://localhost:3300")
})