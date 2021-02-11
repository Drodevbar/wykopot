import entriesService from './entries-service';
import { renderTemplate } from '../template/engine/template-engine';
import commentModelProvider from '../template/model/comment-template-model-provider';
import postModelProvider from '../template/model/post-template-model-provider';

const buildPost = async () => {
  try {
    const activePost = await entriesService.getActivePostWithMostVotes();

    return {
      content: renderTemplate('post', postModelProvider.getModel(activePost)),
      embed: activePost.embed?.url
    };
  } catch (err) {
    console.error({
      message: 'Error during building post',
      errorMessage: err.message
    });

    throw err;
  }
};

const buildComment = async () => {
  try {
    const hotPost = await entriesService.getHotPostWithMostVotes();
    const comments = await entriesService.getCommentsForPost(hotPost);
    const randomTopComment = entriesService.getRandomCommentFromTopNComments(comments);

    return {
      content: renderTemplate('comment', commentModelProvider.getModel(randomTopComment, hotPost)),
      embed: randomTopComment.embed?.url
    };
  } catch (err) {
    console.error({
      message: 'Error during building comment',
      errorMessage: err.message
    });

    throw err;
  }
};

export default {
  buildPost,
  buildComment
};
