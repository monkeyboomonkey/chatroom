import { createClient } from 'redis';
import dotenv from 'dotenv'; 

dotenv.config(); 
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});

client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

// hello world 
await client.set('key', 'HELLO');
const value = await client.get('key');

console.log(value)