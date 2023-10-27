import { createClient } from 'redis';
import dotenv from 'dotenv'; 

dotenv.config(); 
// export const redisClient = createClient({
//     password: process.env.REDIS_PASSWORD,
//     socket: {
//         host: process.env.REDIS_HOST,
//         port: Number(process.env.REDIS_PORT)
//     }
// });

// export const redisClient = createClient();

export const redisClient = createClient({
    password: '8b4ZqPldW2LwFTRemxQt6N5fO3NmVAk6',
    socket: {
        host: 'redis-19617.c9.us-east-1-4.ec2.cloud.redislabs.com',
        port: 19617
    }
});

// client.on('error', err => console.log('Redis Client Error', err));
// await client.connect();

// // hello world 
// await client.set('key', 'HELLO');
// const value = await client.get('key');

// console.log(value)