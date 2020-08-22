import wykopHttpClient from '../integration/wykop/client.mjs';

const getActivePostWithMostVotes = async () => {
    return wykopHttpClient.fetchActivePosts()
        .then(res => res.data.data)
        .then(posts => posts.sort((a, b) => b.vote_count - a.vote_count))
        .then(posts => posts[0])
        .catch(() => ({}));
}

const getHotPostWithMostVotes = async () => {
    return wykopHttpClient.fetchHotPosts()
        .then(res => res.data.data)
        .then(posts => posts.sort((a, b) => b.vote_count - a.vote_count))
        .then(posts => posts[0])
        .catch(() => ({}));
}

const getCommentsForPost = async (post) => {
    return wykopHttpClient.fetchSingleEntry(post.id)
        .then(res => res.data.data.comments)
        .catch(() => []);
}

const getRandomCommentFromTopNComments = (comments, n = 3) => {
    if (comments.length < 1) {
        return {};
    }
    
    return comments
        .sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, n)
        .sort(() => Math.random() - 0.5)
        .shift();
}

export default {
    getActivePostWithMostVotes,
    getHotPostWithMostVotes,
    getCommentsForPost,
    getRandomCommentFromTopNComments
}