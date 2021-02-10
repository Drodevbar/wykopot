
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { entriesUploaderService } from './entries-uploader-service.js';
import wykopClient from '../integration/wykop/client.js';
import entryBuilder from './entry-builder.js';
import chai, { expect } from 'chai';

chai.use(sinonChai);

describe('[service/entries-uploader-service]', () => {
  describe('uploadNewPostWithComment function', () => {
    const post = { content: 'post-content', embed: 'post-embed' };
    const comment = { content: 'comment-content', embed: 'comment-embed' };
    let buildPostStub;
    let buildCommentStub;
    let addEntryStub;

    beforeEach(() => {
      buildPostStub = sinon.stub(entryBuilder, 'buildPost').resolves(post);
      buildCommentStub = sinon.stub(entryBuilder, 'buildComment').resolves(comment);
      addEntryStub = sinon.stub(wykopClient, 'addEntry');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should call all required services in order to upload post and comment', async () => {
      const postId = 7;
      const commentId = 14;
      addEntryStub.onFirstCall().resolves({ data: { data: { id: postId } } });
      addEntryStub.onSecondCall().resolves({ data: { data: { id: commentId } } });

      await entriesUploaderService.uploadNewPostWithComment();

      expect(buildPostStub).to.have.been.calledOnce;
      expect(buildCommentStub).to.have.been.calledOnce;
      expect(addEntryStub).to.have.been.calledWith({
        body: post.content,
        embed: post.embed 
      });
      expect(addEntryStub).to.have.been.calledWith({
        body: comment.content,
        embed: comment.embed 
      }, postId);
    });
  });
});
