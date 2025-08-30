import convict from 'convict';

const config = convict({
    env: {
        doc: 'Application environment',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV'
    },
    port: {
        doc: 'Application port',
        format: 'port',
        default: 3000,
        env: 'PORT'
    },
    infuraProjectId: {
        doc: 'Infura Project ID for Ethereum network access',
        format: 'String',
        default: '',
        env: 'INFURA_PROJECT_ID',
        sensitive: true
    },
    db: {
        host: {
            doc: 'Database host name/IP',
            format: 'String',
            default: 'localhost',
            env: 'DATABASE_HOST'
        },
        user: {
            doc: 'Database user',
            format: 'String',
            default: 'postgres',
            env: 'DATABASE_USER'
        },
        password: {
            doc: 'Database password',
            format: 'String',
            default: 'postgres',
            env: 'DATABASE_PASSWORD',
            sensitive: true
        },
        name: {
            doc: 'Database name',
            format: 'String',
            default: 'mydatabase',
            env: 'DATABASE_NAME'
        },
        port: {
            doc: 'Database port',
            format: 'port',
            default: 5432,
            env: 'DATABASE_PORT'
        }
    }
});

export default config;
