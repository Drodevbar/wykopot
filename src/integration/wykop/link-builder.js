const buildLinkForPost = (post, comment) => {
  const commentAnchor = comment ? `#comment-${comment.id}` : '';

  return `https://wykop.pl/wpis/${post.id}` + commentAnchor;
};

export default {
  buildLinkForPost
};