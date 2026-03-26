const vault = require('node-vault');

const vaultConfig = {
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR || 'http://127.0.0.1:8200'
};

const client = vault(vaultConfig);

/**
 * Enterprise Grade Vault Authentication & Secret Injection
 * Implements Userpass Auth Strategy for Zero-Trust consistency.
 */
export const loadVaultSecrets = async () => {
    const username = process.env.VAULT_USER || 'Ahmed';
    const password = process.env.VAULT_PASS || 'Somali123@123!!';

    try {
        console.log(`🔒 Authenticating with Vault at ${vaultConfig.endpoint} as user: ${username}...`);

        // 1. Authenticate with Userpass Method
        const loginResponse = await client.userpassLogin({
            username: username,
            password: password
        });

        // 2. Set the token received from login for subsequent requests
        client.token = loginResponse.auth.client_token;
        console.log("✅ Vault Authentication Successful.");

        // 3. Fetch secrets from 'secret/data/learning-app' (Stardard KV v2 path)
        const secret = await client.read('secret/data/learning-app');
        const data = secret.data.data;

        if (data) {
            Object.keys(data).forEach(key => {
                process.env[key] = data[key];
            });
            console.log("🚀 All Enterprise Secrets successfully synced from HashiCorp Vault.");
        }
    } catch (err: any) {
        console.error("❌ Vault Enterprise Error:", err.message);
        // Fallback or critical failure handling
        if (process.env.NODE_ENV === 'production') {
            throw new Error("CRITICAL: Vault secrets could not be loaded. Stopping service.");
        }
        console.warn("⚠️ Continuing in development mode with local .env fallback.");
    }
};

module.exports = { loadVaultSecrets };
