import { expect } from 'chai';
import sinon from 'sinon';
import provider from './post-template-model-provider.js';
import linkBuilder from '../../integration/wykop/link-builder';
import * as verbFormatter from '../../util/verb-formatter.js';

describe('[template/model/post-template-model-provider]', () => {
  describe('getModel function', () => {
    let postData;
    let getWroteFormatSpy;

    beforeEach(() => {
      postData = {
        id: 123,
        author: { 
          login: 'Stefan Batory',
          sex: 'male'
        },
        body: 'Hello World!'
      };
      getWroteFormatSpy = sinon.spy(verbFormatter, 'getWroteFormat');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should map author nickname', () => {
      expect(provider.getModel(postData).authorNickname).to.be.equal(postData.author.login);
    });

    it('should map content', () => {
      expect(provider.getModel(postData).content).to.be.equal(postData.body);
    });

    describe('wrote format mapping', () => {
      it('should invoke getWroteFormat function with proper parameter', () => {
        const result = provider.getModel(postData);

        expect(result.wroteFormat).to.be.equal(getWroteFormatSpy.returnValues[0]);
        expect(getWroteFormatSpy.calledOnceWithExactly(postData.author.sex)).to.be.true;
      });

      it('should invoke getWroteFormat function with default parameter when sex is undefined', () => {
        postData.author.sex = undefined;

        const result = provider.getModel(postData);

        expect(result.wroteFormat).to.be.equal(getWroteFormatSpy.returnValues[0]);
        expect(getWroteFormatSpy.calledOnceWithExactly('male')).to.be.true;
      });
    });

    describe('post uri mapping', () => {
      let buildLinkForPostSpy;

      beforeEach(() => {
        buildLinkForPostSpy = sinon.spy(linkBuilder, 'buildLinkForPost') ;
      });

      afterEach(() => {
        sinon.restore();
      });

      it('mapps post uri and passes post data to link builder', () => {
        const result = provider.getModel(postData);

        expect(result.postUri).to.be.equal(buildLinkForPostSpy.returnValues[0]);
        expect(buildLinkForPostSpy.calledOnceWithExactly(postData)).to.be.true;
      });
    });
  });
});
