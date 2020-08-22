import entriesService from "./entries-service.mjs";
import { renderTemplate } from '../util/template-engine.mjs';

const buildPost = async () => {
    const activePostRequest = entriesService.getActivePostWithMostVotes();
    const hotPostRequest = entriesService.getHotPostWithMostVotes();

    const [activePost, hotPost] = await Promise.all([activePostRequest, hotPostRequest]);
    const randomTopComment = entriesService.getRandomCommentFromTopNComments(await entriesService.getCommentsForPost(hotPost));

    // console.log(await client.getUserKey());
    const postTemplate = renderTemplate('post', { post: activePost });

    const commentTemplate = renderTemplate('comment', { comment: randomTopComment });
    
    console.log(postTemplate);
    console.log(commentTemplate);

    console.log('post \n', activePost, 'comment \n', randomTopComment);
};

export default {
    buildPost
}