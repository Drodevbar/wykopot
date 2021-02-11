import { expect } from 'chai';
import wykopLinkBuilder from './link-builder';

describe('[integration/wykop/link-builder]', () => {
  describe('buildLinkForPost function', () => {
    const post = { id: 123 };
    const comment = { id: 456 };

    it('should build a link for post without anchor to comment', () => {
      const result = wykopLinkBuilder.buildLinkForPost(post);

      expect(result).to.be.equal(`https://wykop.pl/wpis/${post.id}`);
    });

    it('should build a link for post with anchor to comment', () => {
      const result = wykopLinkBuilder.buildLinkForPost(post, comment);

      expect(result).to.be.equal(`https://wykop.pl/wpis/${post.id}#comment-${comment.id}`);
    });
  });
});
