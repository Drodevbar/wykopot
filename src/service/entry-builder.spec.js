import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import entryBuilder from './entry-builder';
import entriesService from './entries-service';
import * as templateEngine from '../template/engine/template-engine';
import commentModelProvider from '../template/model/comment-template-model-provider';
import postModelProvider from '../template/model/post-template-model-provider';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('[service/entry-builder]', () => {
  let consoleErrorStub;
  
  beforeEach(() => {
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('buildPost function', () => {
    let entriesServiceMock;
    let postModelProviderMock;
    let templateEngineMock;

    beforeEach(() => {
      entriesServiceMock = sinon.mock(entriesService);
      postModelProviderMock = sinon.mock(postModelProvider);
      templateEngineMock = sinon.mock(templateEngine);
    });

    afterEach(() => {
      entriesServiceMock.verify();
      postModelProviderMock.verify();
      templateEngineMock.verify();
    });

    describe('should build a post', () => {
      const expectedBuiltPost = 'Hello worlvd';
      let post;
      let postModel;

      beforeEach(() => {
        post = { title: 'Some cool post title' };
        postModel = { post };

        entriesServiceMock
          .expects('getActivePostWithMostVotes')
          .once()
          .resolves(post);

        postModelProviderMock
          .expects('getModel')
          .withArgs(post)
          .returns(postModel);

        templateEngineMock
          .expects('renderTemplate')
          .withArgs('post', postModel)
          .returns(expectedBuiltPost);
      });

      it('only with content', async () => {
        const result = await entryBuilder.buildPost();

        expect(result.content).to.be.equal(expectedBuiltPost);
        expect(result.embed).to.be.equal(undefined);
      });

      it('with content and embed', async () => {
        post.embed = { url: 'https://foo.bar' };

        const result = await entryBuilder.buildPost();

        expect(result.content).to.be.equal(expectedBuiltPost);
        expect(result.embed).to.be.equal(post.embed.url);
      });
    });

    it('should log and rethrow an error when getActivePostWithMostVotes throws', async () => {
      const expectedError = new Error('Ooops!');
      entriesServiceMock
        .expects('getActivePostWithMostVotes')
        .once()
        .rejects(expectedError);

      templateEngineMock.expects('renderTemplate').never();

      await expect(entryBuilder.buildPost()).to.be.rejectedWith(expectedError);

      expect(consoleErrorStub).to.have.been.calledOnceWith({
        message: 'Error during building post',
        errorMessage: expectedError.message
      });
    });
  });

  describe('buildComment function', () => {
    let getHotPostWithMostVotesStub;
    let getCommentsForPostStub;
    let getRandomCommentFromTopNCommentsStub;
    let commentModelProviderMock;
    let templateEngineMock;

    beforeEach(() => {
      getHotPostWithMostVotesStub = sinon.stub(entriesService, 'getHotPostWithMostVotes');
      getCommentsForPostStub = sinon.stub(entriesService, 'getCommentsForPost');
      getRandomCommentFromTopNCommentsStub = sinon.stub(entriesService, 'getRandomCommentFromTopNComments');
      commentModelProviderMock = sinon.mock(commentModelProvider);
      templateEngineMock = sinon.mock(templateEngine);
    });

    afterEach(() => {
      commentModelProviderMock.verify();
      templateEngineMock.verify();
    });

    describe('should build a comment', () => {
      const hotPost = { title: 'Some hot post title' };
      const expectedBuiltComment = 'Hello world';
      let comments;
      let commentModel;

      beforeEach(() => {
        comments = [
          { title: 'Some fancy comment title #1' },
          { title: 'Some fancy comment title #2' },
        ];
        commentModel = { comment: comments[1] };

        getHotPostWithMostVotesStub.resolves(hotPost);
        getCommentsForPostStub.withArgs(hotPost).resolves(comments);
        getRandomCommentFromTopNCommentsStub.withArgs(comments).returns(comments[1]);

        commentModelProviderMock
          .expects('getModel')
          .withArgs(comments[1])
          .returns(commentModel);

        templateEngineMock
          .expects('renderTemplate')
          .withArgs('comment', commentModel)
          .returns(expectedBuiltComment);
      });

      afterEach(() => {
        expect(getHotPostWithMostVotesStub).to.be.been.calledOnce;
        expect(getCommentsForPostStub).to.have.been.calledOnceWith(hotPost);
        expect(getRandomCommentFromTopNCommentsStub).to.have.been.calledOnceWith(comments);
      });

      it('only with content', async () => {
        const result = await entryBuilder.buildComment();

        expect(result.content).to.be.equal(expectedBuiltComment);
        expect(result.embed).to.be.equal(undefined);
      });

      it('with content and embed', async () => {
        comments[1].embed = { url: 'https://foo.bar' };

        const result = await entryBuilder.buildComment();

        expect(result.content).to.be.equal(expectedBuiltComment);
        expect(result.embed).to.be.equal(comments[1].embed.url);
      });
    });

    describe('should log and rethrow an exception when', () => {
      const expectedError = new Error('Ooops!');
      const hotPost = { title: 'Some hot post title' };

      beforeEach(() => {
        templateEngineMock.expects('renderTemplate').never();
      });

      it('getHotPostWithMostVotes throws', async () => {
        getHotPostWithMostVotesStub.rejects(expectedError);

        await expect(entryBuilder.buildComment()).to.be.rejectedWith(expectedError);

        expect(getHotPostWithMostVotesStub).to.have.been.calledOnce;
        expect(consoleErrorStub).to.have.been.calledOnceWith({
          message: 'Error during building comment',
          errorMessage: expectedError.message
        });
      });

      it('getCommentsForPost throws', async () => {
        getHotPostWithMostVotesStub.resolves(hotPost);
        getCommentsForPostStub.withArgs(hotPost).rejects(expectedError);

        await expect(entryBuilder.buildComment()).to.be.rejectedWith(expectedError);

        expect(getHotPostWithMostVotesStub).to.have.been.calledOnce;
        expect(getCommentsForPostStub).to.be.been.calledOnce;
        expect(consoleErrorStub).to.have.been.calledOnceWith({
          message: 'Error during building comment',
          errorMessage: expectedError.message
        });
      });
    });
  });
});
