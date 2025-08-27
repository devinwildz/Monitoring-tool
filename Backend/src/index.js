import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import app from './app.js';
import logger from './utils/logger.js';


dotenv.config({
    path: './.env',
});

connectDB();

try {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });

} catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1);
}