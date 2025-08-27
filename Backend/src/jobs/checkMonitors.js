import axios from "axios";
import { Monitor } from "../models/monitorModel.js";
import { sendEmail } from "../utils/SendEmail.js";

export const checkMonitors = async () => {
    try {
        const monitors = await Monitor.find({ isActive: true }).populate("userId", "email");

        const now = Date.now();

        for (const monitor of monitors) {
            // Skip if monitor was checked recently according to its frequency
            if (monitor.lastChecked && now - new Date(monitor.lastChecked).getTime() < monitor.frequency * 60000) {
                continue;
            }

            let status = "down";
            const start = Date.now();

            try {
                const res = await axios.get(monitor.url, { timeout: 5000 });
                if (res.status >= 200 && res.status < 400) status = "up";
            } catch (err) {
                status = "down";
            }

            const responseTime = Date.now() - start;

            // Update monitor document
            monitor.status = status;
            monitor.lastChecked = new Date();
            monitor.responseTime = responseTime;
            monitor.history.push({ checkedAt: new Date(), status, responseTime });

            // Keep last 100 history entries only
            if (monitor.history.length > 100) {
                monitor.history = monitor.history.slice(-100);
            }

            // Recalculate uptime
            const total = monitor.history.length;
            const upCount = monitor.history.filter((h) => h.status === "up").length;
            monitor.uptime = total > 0 ? Math.round((upCount / total) * 100) : 100;

            await monitor.save();
            if (status === "down" && monitor.isActive && monitor.userId?.email) {
                try {
                    await sendEmail({
                        email: monitor.userId.email, // aapko ensure karna hai ki monitor document me user email ho ya fetch from user
                        subject: `⚠️ Website Down Alert: ${monitor.url}`,
                        message: `Your monitor "${monitor.name || monitor.url}" is down as of ${new Date().toLocaleString()}.`,
                    });
                } catch (emailErr) {
                    console.error("Error sending down alert email:", emailErr.message);
                }
            }
        }

        console.log(`[${new Date().toISOString()}] Monitors checked successfully.`);
    } catch (err) {
        console.error("Error in checkMonitors:", err);
    }
};