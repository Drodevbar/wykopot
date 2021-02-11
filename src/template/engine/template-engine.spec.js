import { renderTemplate } from './template-engine';
import fs from 'fs';
import mustache from 'mustache';
import sinon from 'sinon';
import { expect } from 'chai';

describe('[template/engine/template-engine]', () => {
  describe('renderTemplate function', () => {
    let fsMock;
    let mustacheMock;
        
    beforeEach(() => {
      fsMock = sinon.mock(fs);
      mustacheMock = sinon.mock(mustache);
    });

    afterEach(() => {
      fsMock.verify();
      mustacheMock.verify();
      sinon.restore();
    });

    it('should render template', () => {
      const templateName = 'foo';
      const viewParams = { prop1: 'val1', prop2: 'val2' };
      const templateBody = 'bar';
      const renderedTemplateBody = 'baz';

      fsMock
        .expects('readFileSync')
        .once()
        .withArgs(`./data/template/${templateName}.mst`, 'UTF-8')
        .returns(templateBody);

      mustacheMock
        .expects('render')
        .once()
        .withArgs(templateBody, viewParams)
        .returns(renderedTemplateBody);
    
      expect(renderTemplate(templateName, viewParams)).to.be.equal(renderedTemplateBody);
    });
  });
});
