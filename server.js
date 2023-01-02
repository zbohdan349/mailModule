require("dotenv").config();

if(
    !process.env.ALLOWED_HOST ||
    !process.env.SMTP_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASSWORD ||
    !process.env.DESTINATION_EMAIL){
        console.error("Missing required fields in configuration file")
        process.exit(1)
}

//Handling ^c interrupt
process
	.on('SIGTERM', shutdown('SIGTERM'))
	.on('SIGINT', shutdown('SIGINT'))
	.on('uncaughtException', shutdown('uncaughtException'))

function shutdown(signal) {
	return (err) => {
		console.log(`${ signal }...`);
		if (err) console.error(err.stack || err);
		process.exit(err ? 1 : 0);
	}
}

const express = require("express");
const app = express();

app.use(express.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.ALLOWED_HOST)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
    next()
});


const mailRoute = require('./routes/mailRoute')
app.use('/',mailRoute);

app.listen(process.env.APP_PORT || 3001, ()=>{ console.log(`server started on port ${process.env.APP_PORT || 3001}`) });