import { getWroteFormat } from './verb-formatter.js';
import { expect } from 'chai';

describe('[util/verb-formatter]', () => {
  describe('getWroteFormat function', () => {
    it('should return \'napisał\' when male sex provided', () => {
      expect(getWroteFormat('male')).to.be.equal('napisał');
    });

    it('should return \'napisała\' when female sex provided', () => {
      expect(getWroteFormat('female')).to.be.equal('napisała');
    });
  });
});