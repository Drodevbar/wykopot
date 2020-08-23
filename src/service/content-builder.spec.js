import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import contentBuilder from './content-builder.js';
import entriesService from './entries-service.js';
import * as templateEngine from '../util/template-engine.js';

chai.use(chaiAsPromised);

describe('[service/content-builder]', () => {
    describe('buildPost function', () => {
        let entriesServiceMock;
        let templateEngineMock;

        beforeEach(() => {
            entriesServiceMock = sinon.mock(entriesService);
            templateEngineMock = sinon.mock(templateEngine);
        });

        afterEach(() => {
            entriesServiceMock.verify();
            templateEngineMock.verify();
            sinon.restore();
        });

        it('should build a post', async () => {
            const post = { title: 'Some cool post title' };
            const expectedBuiltPost = 'Hello world';

            entriesServiceMock
                .expects('getActivePostWithMostVotes')
                .once()
                .returns(Promise.resolve(post));

            templateEngineMock
                .expects('renderTemplate')
                .withArgs('post', { post })
                .returns(expectedBuiltPost);

            const result = await contentBuilder.buildPost();

            expect(result).to.be.equal(expectedBuiltPost);
        });

        it('should throw an error when getActivePostWithMostVotes returns an empty object', async () => {
            entriesServiceMock
                .expects('getActivePostWithMostVotes')
                .once()
                .returns(Promise.resolve({}));

            templateEngineMock.expects('renderTemplate').never();

            await expect(contentBuilder.buildPost()).to.be.rejected;
        });
    });

    describe('buildComment function', () => {
        let getHotPostWithMostVotesStub;
        let getCommentsForPostStub;
        let getRandomCommentFromTopNCommentsStub;
        let templateEngineMock;

        beforeEach(() => {
            getHotPostWithMostVotesStub = sinon.stub(entriesService, 'getHotPostWithMostVotes');
            getCommentsForPostStub = sinon.stub(entriesService, 'getCommentsForPost');
            getRandomCommentFromTopNCommentsStub = sinon.stub(entriesService, 'getRandomCommentFromTopNComments');
            templateEngineMock = sinon.mock(templateEngine);
        });

        afterEach(() => {
            templateEngineMock.verify();
            sinon.restore();
        });

        it('should build a comment', async () => {
            const hotPost = { title: 'Some hot post title' };
            const comments = [
                { title: 'Some fancy comment title #1' },
                { title: 'Some fancy comment title #2' },
            ];
            const expectedBuiltComment = 'Hello world';

            getHotPostWithMostVotesStub.returns(Promise.resolve(hotPost));
            getCommentsForPostStub.withArgs(hotPost).returns(Promise.resolve(comments));
            getRandomCommentFromTopNCommentsStub.withArgs(comments).returns(comments[1]);

            templateEngineMock
                .expects('renderTemplate')
                .withArgs('comment', { comment: comments[1] })
                .returns(expectedBuiltComment);

            const result = await contentBuilder.buildComment();

            expect(result).to.be.equal(expectedBuiltComment);
            expect(getHotPostWithMostVotesStub.calledOnce).to.be.true;
            expect(getCommentsForPostStub.calledOnceWith(hotPost)).to.be.true;
            expect(getRandomCommentFromTopNCommentsStub.calledOnceWith(comments)).to.be.true;
        });

        describe('should throw an exception when', () => {
            beforeEach(() => {
                templateEngineMock.expects('renderTemplate').never();
            })
            
            afterEach(() => {
                expect(getHotPostWithMostVotesStub.calledOnce).to.be.true;
                expect(getCommentsForPostStub.calledOnce).to.be.true;
                expect(getRandomCommentFromTopNCommentsStub.calledOnce).to.be.true;
            });

            it('getHotPostWithMostVotes returns an empty object', async () => {
                getHotPostWithMostVotesStub.returns(Promise.resolve({}));

                await expect(contentBuilder.buildComment()).to.be.rejected;
            });

            it('getCommentsForPost returns an empty array', async () => {
                const hotPost = { title: 'Some hot post title' };

                getHotPostWithMostVotesStub.returns(Promise.resolve(hotPost));
                getCommentsForPostStub.withArgs(hotPost).returns(Promise.resolve([]));

                await expect(contentBuilder.buildComment()).to.be.rejected;
            });

            it('getRandomCommentFromTopNComments returns an empty object', async () => {
                const hotPost = { title: 'Some hot post title' };
                const comments = [
                    { title: 'Some fancy comment title #1' },
                    { title: 'Some fancy comment title #2' },
                ];

                getHotPostWithMostVotesStub.returns(Promise.resolve(hotPost));
                getCommentsForPostStub.withArgs(hotPost).returns(Promise.resolve(comments));
                getRandomCommentFromTopNCommentsStub.withArgs(comments).returns(Promise.resolve({}));

                await expect(contentBuilder.buildComment()).to.be.rejected;
            });
        });
    });
});
