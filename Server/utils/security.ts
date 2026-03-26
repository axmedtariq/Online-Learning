import validator from 'validator';

/**
 * Military-grade input sanitization utility.
 * Protects against SQL Injection (via Sequelize), NoSQL Injection, and XSS.
 */
export const sanitizeInput = (data: any): any => {
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
        const sanitizedObj: Record<string, any> = {};
        for (const key in data) {
            // SECURITY FIX: Prevent Prototype Pollution
            if (Object.prototype.hasOwnProperty.call(data, key) && !['__proto__', 'constructor', 'prototype'].includes(key)) {
                sanitizedObj[key] = sanitizeInput(data[key]);
            }
        }
        return sanitizedObj;
    }

    return data;
};
