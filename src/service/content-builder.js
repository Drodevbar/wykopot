import entriesService from './entries-service.js';
import { renderTemplate } from '../util/template-engine.js';
import { isEmpty } from 'lodash';

const buildPost = async () => {
    const activePost = await entriesService.getActivePostWithMostVotes();

    if (isEmpty(activePost)) {
        throw new Error('Could not build a post');
    }

    return renderTemplate('post', { post: activePost });
};

const buildComment = async () => {
    const hotPost = await entriesService.getHotPostWithMostVotes();
    const comments = await entriesService.getCommentsForPost(hotPost);
    const randomTopComment = entriesService.getRandomCommentFromTopNComments(comments);

    if (isEmpty(randomTopComment)) {
        throw new Error('Could not build a comment');
    }

    return renderTemplate('comment', { comment: randomTopComment });
}

export default {
    buildPost,
    buildComment
}