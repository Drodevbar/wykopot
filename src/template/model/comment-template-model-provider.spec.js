import { expect } from 'chai';
import sinon from 'sinon';
import provider from './comment-template-model-provider.js';
import linkBuilder from '../../integration/wykop/link-builder';
import * as verbFormatter from '../../util/verb-formatter.js';

describe('[template/model/comment-template-model-provider]', () => {
  describe('getModel function', () => {
    let commentData;
    let postData;
    let getWroteFormatSpy;

    beforeEach(() => {
      commentData = {
        id: 123,
        author: { 
          login: 'Stefan Batory',
          sex: 'male'
        },
        body: 'Hello World!'
      };
      postData = { id: 456 };
      getWroteFormatSpy = sinon.spy(verbFormatter, 'getWroteFormat');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should map author nickname', () => {
      expect(provider.getModel(commentData, postData).authorNickname).to.be.equal(commentData.author.login);
    });

    it('should map content', () => {
      expect(provider.getModel(commentData, postData).content).to.be.equal(commentData.body);
    });

    describe('wrote format mapping', () => {
      it('should invoke getWroteFormat function of verb formatter with proper parameter', () => {
        const result = provider.getModel(commentData, postData);

        expect(result.wroteFormat).to.be.equal(getWroteFormatSpy.returnValues[0]);
        expect(getWroteFormatSpy.calledOnceWithExactly(commentData.author.sex)).to.be.true;
      });

      it('should invoke getWroteFormat function with default parameter when sex is undefined', () => {
        commentData.author.sex = undefined;

        const result = provider.getModel(commentData, postData);

        expect(result.wroteFormat).to.be.equal(getWroteFormatSpy.returnValues[0]);
        expect(getWroteFormatSpy.calledOnceWithExactly('male')).to.be.true;
      });
    });

    describe('comment uri mapping', () => {
      let buildLinkForPostSpy;

      beforeEach(() => {
        buildLinkForPostSpy = sinon.spy(linkBuilder, 'buildLinkForPost') ;
      });

      afterEach(() => {
        sinon.restore();
      });

      it('mapps comment uri and passes comment and post data to link builder', () => {
        const result = provider.getModel(commentData, postData);

        expect(result.commentUri).to.be.equal(buildLinkForPostSpy.returnValues[0]);
        expect(buildLinkForPostSpy.calledOnceWithExactly(postData, commentData)).to.be.true;
      });
    });
  });
});