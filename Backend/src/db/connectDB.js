import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        logger.info(`Connected to MongoDB: ${connection.connection.host}`);
        
    } catch (error) {
        logger.error(`Error connecting to database: ${error.message}`);
        process.exit(1);

    }
}

export default connectDB;

