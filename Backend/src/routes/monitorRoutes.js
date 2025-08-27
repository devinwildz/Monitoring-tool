import express from "express";
import {
    addMonitor,
    getAllMonitors,
    toggleMonitorActiveStatus,  // <-- change here
    deleteMonitor,
    bulkDeleteMonitors
} from "../controllers/monitorController.js";
import { verifyJWT } from "../middlewares/authMiddlewares.js";


const router = express.Router();

router.post("/", verifyJWT, addMonitor); // Create
router.get("/", verifyJWT, getAllMonitors); // Read
router.patch("/:id/toggle", verifyJWT, toggleMonitorActiveStatus); // <-- change here
router.delete("/:id", verifyJWT, deleteMonitor); // Delete single
router.post("/bulk-delete", verifyJWT, bulkDeleteMonitors); // Bulk delete

export default router;
