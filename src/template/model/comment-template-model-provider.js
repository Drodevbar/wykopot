import linkBuilder from '../../integration/wykop/link-builder';
import { getWroteFormat } from '../../util/verb-formatter.js';

const getModel = (commentData, postData) => ({
  authorNickname: commentData.author.login,
  content: commentData.body,
  wroteFormat: getWroteFormat(commentData.author.sex || 'male'),
  commentUri: linkBuilder.buildLinkForPost(postData, commentData)
});

export default {
  getModel
};
