import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cron from 'node-cron';
import { checkMonitors } from './jobs/checkMonitors.js';


const app = express();
//
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true //
}));

// Run monitor checks every minute
cron.schedule("* * * * *", async () => {
  console.log("Running scheduled monitor checks...");
  await checkMonitors();
});

app.use(cookieParser());
app.use(helmet());
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: true, limit: '500kb' }));
app.use((req, res, next) => {
    req.body = mongoSanitize.sanitize(req.body); // ❌
    next();
});


app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}));


//routes

import userRouter from "./routes/userRoutes.js"
import monitorRouter from "./routes/monitorRoutes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/monitors", monitorRouter);

import errorMiddleware from './middlewares/errorMiddlewares.js'
app.use(errorMiddleware);

export default app;