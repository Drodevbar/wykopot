import cron from 'node-cron';
import dotenv from 'dotenv';
import wykopPostBuilder from "./src/service/post-builder.mjs";

dotenv.config();

cron.schedule("* * * * *", () => {
    console.log("hello world (every 1 minute)");
});

wykopPostBuilder.buildPost();

// wykopHttpClient.fetchSingleEntry(50918819).then((response) => {
//     console.log("====START====");
//     let comments = response.data.comments;

//     comments.sort((a, b) => b.vote_count - a.vote_count);

//     console.log(comments);
//     console.log("====END====");
// });

// app.listen(7890);