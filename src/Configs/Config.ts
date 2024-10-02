import dotenv from 'dotenv';

dotenv.config();


const config={
    port:parseInt(process.env.PORT as string)||5008,


    DATABASE_URL : process.env.DATABASE_URL || 'not  found',
}


export default config