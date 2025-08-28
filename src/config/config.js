import convict from 'convict';

const config = convict({
    database: {
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
        db: {
            doc: 'Database name',
            format: 'String',
            default: 'mydatabase',
            env: 'DATABASE_NAME'
        }
    }
});

export default config;
