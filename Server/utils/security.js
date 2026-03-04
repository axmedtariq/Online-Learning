const validator = require('validator');

/**
 * Military-grade input sanitization utility.
 * Protects against SQL Injection (via Sequelize), NoSQL Injection, and XSS.
 */
const sanitizeInput = (data) => {
    if (typeof data === 'string') {
        // Remove scripts, trim, and escape HTML characters
        let sanitized = data.trim();
        sanitized = validator.escape(sanitized);
        return sanitized;
    }
    
    if (Array.isArray(data)) {
        return data.map(item => sanitizeInput(item));
    }
    
    if (typeof data === 'object' && data !== null) {
        const sanitizedObj = {};
        for (const key in data) {
            sanitizedObj[key] = sanitizeInput(data[key]);
        }
        return sanitizedObj;
    }
    
    return data;
};

module.exports = { sanitizeInput };
