import 'dotenv/config';
import cron from 'node-cron';
import wykopPostBuilder from './src/service/content-builder.js';

cron.schedule('* * * * *', () => {
    console.log('hello world (every 1 minute)');
});

const app = async () => {
    const [post, comment] = await Promise.all([wykopPostBuilder.buildPost(), wykopPostBuilder.buildComment()]);

    console.log(post, '\n\n\n', comment);
}

app();