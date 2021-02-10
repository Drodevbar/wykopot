import linkBuilder from '../../integration/wykop/link-builder';
import { getWroteFormat } from '../../util/verb-formatter.js';

const getModel = (postData) => ({
  authorNickname: postData.author.login,
  content: postData.body,
  wroteFormat: getWroteFormat(postData.author.sex || 'male'),
  postUri: linkBuilder.buildLinkForPost(postData)
});

export default {
  getModel
};
