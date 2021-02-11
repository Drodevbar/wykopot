import axios from 'axios';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import * as md5HashCalculator from '../../util/md5-hash-calculator';
import client from './client';
import queryString from 'querystring';

chai.use(sinonChai);

const md5HashValue = 'md5HashValue-test';

describe('[integration/wykop/client]', () => {
  let axiosGetStub;
  let axiosPostStub;
  let md5HashCalculatorStub;
  let queryStringStringifyStub;

  beforeEach(() => {
    axiosGetStub = sinon.stub(axios, 'get');
    axiosPostStub = sinon.stub(axios, 'post');
    md5HashCalculatorStub = sinon.stub(md5HashCalculator, 'calculateMd5Hash')
      .returns(md5HashValue);
    queryStringStringifyStub = sinon.stub(queryString, 'stringify');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('fetchHotPosts function', () => {
    it('should call axios.get() with proper params when no page number provided', async () => {
      const expectedQuery = 'https://a2.wykop.pl/Entries/Hot/page/1/appkey/WYKOP_API_KEY-test/output/clear';

      await client.fetchHotPosts();

      expect(axiosGetStub).to.have.been.calledOnceWith(
        expectedQuery,
        { headers: { apisign: md5HashValue } },
      );
      expect(md5HashCalculatorStub).to.have.been.calledOnceWith(
        'WYKOP_API_SECRET-test',
        expectedQuery
      );
    });

    it('should call axios.get() with proper params when page number provided', async () => {
      const pageNumber = 5;
      const expectedQuery = `https://a2.wykop.pl/Entries/Hot/page/${pageNumber}/appkey/WYKOP_API_KEY-test/output/clear`;
      
      await client.fetchHotPosts(pageNumber);

      expect(axiosGetStub).to.have.been.calledOnceWith(
        expectedQuery,
        { headers: { apisign: md5HashValue } },
      );
      expect(md5HashCalculatorStub).to.have.been.calledOnceWith(
        'WYKOP_API_SECRET-test',
        expectedQuery
      );
    });
  });

  describe('fetchActivePosts function', () => {
    it('should call axios.get() with proper params when no page number provided', async () => {
      const expectedQuery = 'https://a2.wykop.pl/Entries/Active/page/1/appkey/WYKOP_API_KEY-test/output/clear';

      await client.fetchActivePosts();

      expect(axiosGetStub).to.have.been.calledOnceWith(
        expectedQuery,
        { headers: { apisign: md5HashValue } },
      );
      expect(md5HashCalculatorStub).to.have.been.calledOnceWith(
        'WYKOP_API_SECRET-test',
        expectedQuery
      );
    });

    it('should call axios.get() with proper params when page number provided', async () => {
      const pageNumber = 10;
      const expectedQuery =
        `https://a2.wykop.pl/Entries/Active/page/${pageNumber}/appkey/WYKOP_API_KEY-test/output/clear`;
      
      await client.fetchActivePosts(pageNumber);

      expect(axiosGetStub).to.have.been.calledOnceWith(
        expectedQuery,
        { headers: { apisign: md5HashValue } },
      );
      expect(md5HashCalculatorStub).to.have.been.calledOnceWith(
        'WYKOP_API_SECRET-test',
        expectedQuery
      );
    });
  });

  describe('fetchSingleEntry function', () => {
    it('should call axios.get() with proper params', async () => {
      const entryId = 1;
      const expectedQuery = `https://a2.wykop.pl/Entries/Entry/${entryId}/appkey/WYKOP_API_KEY-test/output/clear`;

      await client.fetchSingleEntry(entryId);

      expect(axiosGetStub).to.have.been.calledOnceWith(
        expectedQuery,
        { headers: { apisign: md5HashValue } },
      );
      expect(md5HashCalculatorStub).to.have.been.calledOnceWith(
        'WYKOP_API_SECRET-test',
        expectedQuery
      );
    });
  });

  describe('addEntry function', () => {
    describe('should call axios.post() with proper params', () => {
      const userkey = 'user-key-test';
      const body = 'body-test';
      const embed = 'embed-test';
      const stringifiedQuery = 'stringified-query';

      beforeEach(() => {
        axiosPostStub.onFirstCall().resolves({
          data: { data: { userkey } }
        });
        queryStringStringifyStub.returns(stringifiedQuery);
      });

      it('when adding new post', async () => {
        const expectedQuery = `https://a2.wykop.pl/Entries/Add/appkey/WYKOP_API_KEY-test/userkey/${userkey}`;

        await client.addEntry({ body, embed });

        expect(axiosPostStub).to.have.been.calledWith(
          expectedQuery,
          stringifiedQuery,
          { headers: { apisign: md5HashValue } },
        );
      });

      it('when adding new comment', async () => {
        const postId = 1;
        const expectedQuery =
          `https://a2.wykop.pl/Entries/CommentAdd/${postId}/appkey/WYKOP_API_KEY-test/userkey/${userkey}`;

        await client.addEntry({ body, embed }, postId);

        expect(axiosPostStub).to.have.been.calledWith(
          expectedQuery,
          stringifiedQuery,
          { headers: { apisign: md5HashValue } },
        );
      });
    });
  });
  
});
