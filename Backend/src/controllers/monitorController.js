import { Monitor } from "../models/monitorModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import apiErrors from "../utils/apiErrors.js";
import logger from "../utils/logger.js";

// Add a new monitor
export const addMonitor = asyncHandler(async (req, res) => {
    const { url, name } = req.body;
    const userId = req.user?._id;
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/;
    logger.info(`[Add Monitor] User: ${userId}, URL: ${url}, Name: ${name}`);

    // Verify authentication
    if (!userId) {
        logger.error(`[Add Monitor] Unauthorized attempt`);
        throw apiErrors(401, "User not authenticated");
    }
    if (!url) {
        logger.error(`[Add Monitor] Missing URL`);
        throw apiErrors(400, "URL is required");
    }
    if (!name) {
        logger.error(`[Add Monitor] Missing Name`);
        throw apiErrors(400, "Monitor name is required");
    }
    if (!urlRegex.test(url)) {
        logger.error(`[Add Monitor] Invalid URL format`);
        throw apiErrors(400, "Invalid URL format");
    }

    // Check duplicate monitor
    const existingSite = await Monitor.findOne({ userId: userId, url });
    if (existingSite) {
        logger.error(`[Add Monitor] Duplicate monitor found`);
        throw apiErrors(409, "This website is already being monitored");
    }

    const newMonitor = await Monitor.create({
        url,
        name,
        userId: userId,
    });

    res.status(201).json({
        success: true,
        monitor: newMonitor,
    });
});

// Delete a monitor
export const deleteMonitor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        logger.error(`[Delete Monitor] Unauthorized attempt`);
        throw apiErrors(401, "User not authenticated");
    }

    // Pehle monitor ko inactive karo (safe for concurrent cron jobs)
    const monitor = await Monitor.findOne({ _id: id, userId });
    if (!monitor) {
        logger.error(`[Delete Monitor] Monitor not found or not authorized`);
        throw apiErrors(404, "Monitor not found or not authorized");
    }

    monitor.isActive = false;
    await monitor.save();

    // Fir delete karo
    await Monitor.deleteOne({ _id: id });

    res.status(200).json({
        success: true,
        message: "Monitor deleted successfully",
    });
});


// Get all monitors for a user
export const getAllMonitors = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        logger.error(`[Get All Monitors] Unauthorized attempt`);
        throw apiErrors(401, "User not authenticated");
    }

    const monitors = await Monitor.find({ userId: userId }).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        monitors,
    });
});

// Bulk delete monitors
export const bulkDeleteMonitors = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        logger.error(`[Bulk Delete Monitors] Unauthorized attempt`);
        throw apiErrors(401, "User not authenticated");
    }
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        logger.error(`[Bulk Delete Monitors] Invalid IDs array`);
        throw apiErrors(400, "IDs array is required");
    }

    const result = await Monitor.deleteMany({ _id: { $in: ids }, userId: userId });

    res.status(200).json({
        success: true,
        message: `${result.deletedCount} monitors deleted`,
    });
});

// Toggle monitor active/inactive
export const toggleMonitorActiveStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        logger.error(`[Toggle Monitor Active Status] Unauthorized attempt`);
        throw apiErrors(401, "User not authenticated");
    }

    const monitor = await Monitor.findOne({ _id: id, userId: userId });
    if (!monitor) {
        logger.error(`[Toggle Monitor Active Status] Monitor not found`);
        throw apiErrors(404, "Monitor not found");
    }

    monitor.isActive = !monitor.isActive;
    await monitor.save();

    res.status(200).json({
        success: true,
        isActive: monitor.isActive,
    });
});
