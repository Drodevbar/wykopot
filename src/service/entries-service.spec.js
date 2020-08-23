import { expect } from 'chai';
import sinon from 'sinon';
import entriesService from './entries-service.js';
import wykopHttpClient from '../integration/wykop/client.js'

describe('[service/entries-service]', () => {
    describe('getActivePostWithMostVotes function', () => {
        let fetchActivePostsStub;

        beforeEach(() => {
            fetchActivePostsStub = sinon.stub(wykopHttpClient, 'fetchActivePosts');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return post with most votes', async () => {
            fetchActivePostsStub.returns(Promise.resolve({
                data: {
                    data: [
                        { vote_count: 1, title: '#1' },
                        { vote_count: 100, title: '#2' },
                        { vote_count: 3, title: '#3' },
                    ]
                }
            }));
            const result = await entriesService.getActivePostWithMostVotes();

            expect(result.title).to.be.equal('#2');
            expect(fetchActivePostsStub.calledOnce).to.be.true;
        });

        it('should return an empty object when promise rejected', async () => {
            fetchActivePostsStub.returns(Promise.reject(new Error('ERROR!')));
            const result = await entriesService.getActivePostWithMostVotes();

            expect(result).to.be.eql({});
            expect(fetchActivePostsStub.calledOnce).to.be.true;
        });
    });

    describe('getHotPostWithMostVotes function', () => {
        let fetchHotPosts;

        beforeEach(() => {
            fetchHotPosts = sinon.stub(wykopHttpClient, 'fetchHotPosts');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return post with most votes', async () => {
            fetchHotPosts.returns(Promise.resolve({
                data: {
                    data: [
                        { vote_count: 1, title: '#1' },
                        { vote_count: 100, title: '#2' },
                        { vote_count: 3, title: '#3' },
                    ]
                }
            }));
            const result = await entriesService.getHotPostWithMostVotes();

            expect(result.title).to.be.equal('#2');
            expect(fetchHotPosts.calledOnce).to.be.true;
        });

        it('should return an empty object when promise rejected', async () => {
            fetchHotPosts.returns(Promise.reject(new Error('ERROR!')));
            const result = await entriesService.getHotPostWithMostVotes();

            expect(result).to.be.eql({});
            expect(fetchHotPosts.calledOnce).to.be.true;
        });
    });

    describe('getCommentsForPost function', () => {
        let fetchSingleEntryStub;
        const post = { id: 'Some fancy post id' };

        beforeEach(() => {
            fetchSingleEntryStub = sinon.stub(wykopHttpClient, 'fetchSingleEntry');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return comments for given post', async () => {
            fetchSingleEntryStub.withArgs(post.id).returns(Promise.resolve({
                data: {
                    data: {
                        comments: [
                            { title: '#1' },
                            { title: '#2' },
                            { title: '#3' }
                        ]
                    }
                }
            }));
            const result = await entriesService.getCommentsForPost(post);

            expect(result).to.have.lengthOf(3);
            expect(fetchSingleEntryStub.calledOnceWith(post.id)).to.be.true;
        });

        it('should return an empty array when promise rejected', async () => {
            fetchSingleEntryStub.returns(Promise.reject(new Error('ERROR!')));
            const result = await entriesService.getCommentsForPost(post);

            expect(result).to.have.lengthOf(0);
            expect(fetchSingleEntryStub.calledOnceWith(post.id)).to.be.true;
        });
    });
    
    describe('getRandomCommentFromTopNComments function', () => {
        it('should return an empty object when comments length is less than 1', () => {
            expect(entriesService.getRandomCommentFromTopNComments([])).to.be.eql({});
        });

        it('should return random comment from top 2 comments', () => {
            const comments = [
                { vote_count: 0, title: '#0' },
                { vote_count: 1, title: '#1' },
                { vote_count: 3, title: '#2' },
                { vote_count: 3, title: '#3' },
            ];

            expect(entriesService.getRandomCommentFromTopNComments(comments, 2).vote_count).to.be.equal(3);
        });
    });    
});