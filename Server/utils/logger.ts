const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const { Client } = require('@elastic/elasticsearch');

// Elasticsearch Client Configuration
const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USER || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
    }
});

const esTransportOpts = {
    level: 'info',
    client: esClient,
    indexPrefix: 'learning-logs',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    )
};

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'learning-backend' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new ElasticsearchTransport(esTransportOpts)
    ]
});

module.exports = logger;
