const vault = require('node-vault');

const vaultConfig = {
    apiVersion: 'v1',
    endpoint: process.env.VAULT_ADDR || 'http://127.0.0.1:8200',
    token: process.env.VAULT_TOKEN
};

const client = vault(vaultConfig);

/**
 * Fetches secrets from Vault and puts them into process.env
 * Expects secrets at 'secret/data/learning-app' (Stardard KV v2 path)
 */
const loadVaultSecrets = async () => {
    if (!process.env.VAULT_TOKEN) {
        console.warn("⚠️ VAULT_TOKEN not found. Skipping Vault secret injection.");
        return;
    }

    try {
        console.log(`🔑 Connecting to Vault at ${vaultConfig.endpoint}...`);

        // Standard KV v2 request
        const secret = await client.read('secret/data/learning-app');
        const data = secret.data.data;

        if (data) {
            Object.keys(data).forEach(key => {
                process.env[key] = data[key];
                // console.log(`✅ Loaded secret: ${key}`);
            });
            console.log("🚀 All secrets successfully synced from HashiCorp Vault.");
        }
    } catch (err) {
        console.error("❌ Failed to fetch secrets from Vault:", err.message);
        throw err; // Stop app if secrets are missing
    }
};

module.exports = { loadVaultSecrets };
