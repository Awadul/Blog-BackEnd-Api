import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, '..', 'logs');

// Create logs directory if it doesn't exist
try {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
} catch (err) {
    console.error('Error creating logs directory:', err);
}

/**
 * Middleware to log HTTP request details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const { method, originalUrl } = req;

    // Clone body to avoid interference with other middleware
    const body = { ...req.body };

    // Remove sensitive information from logs (create a deep copy, don't modify the original)
    const logSafeBody = { ...body };
    if (logSafeBody.password) logSafeBody.password = '[REDACTED]';

    // Create a copy of cookies for logging purposes
    const logSafeCookies = req.cookies ? { ...req.cookies } : {};
    if (logSafeCookies.token) logSafeCookies.token = '[REDACTED]';

    // Format the log message
    const logMessage = `[${timestamp}] ${method} ${originalUrl}\n` +
        `${Object.keys(logSafeBody).length ? `Body: ${JSON.stringify(logSafeBody, null, 2)}\n` : ''}` +
        `Cookies: ${Object.keys(logSafeCookies).length ? JSON.stringify(logSafeCookies, null, 2) : 'None'}\n` +
        `User: ${req.cookies?.token ? 'Authenticated' : 'Guest'}\n` +
        `-`.repeat(60) + '\n';

    // Log to console
    console.log(logMessage);

    // Log to file
    fs.appendFile(path.join(logsDir, 'requests.log'), logMessage, (err) => {
        if (err) console.error('Error writing to log file:', err);
    });

    next();
};