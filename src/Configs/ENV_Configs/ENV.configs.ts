import dotenv from 'dotenv';

dotenv.config();


export const configs={
    // LISTENER PORT
    PORT : process.env.PORT || 3008,

    // GRPC PORT CONFIG
    ORDER_GRPC_PORT : process.env.ORDER_GRPC_PORT || 5008,

    // DB CONFIGS
    MONGODB_URL_ORDER : process.env.MONGODB_URL_ORDER || 'Mongodb url not  found',

    // PAYMENT GATEWAY CONFIGS
    STRIPE_SECRET_KEY : process.env.STRIPE_SECRET_KEY || 'Stripe secret key not found',
    // LOGGER CONFIGS
    LOG_RETENTION_DAYS : process.env.LOG_RETENTION_DAYS || '7d'
}