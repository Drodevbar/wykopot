import fs from 'fs';
import mustache from 'mustache';

const renderTemplate = (templateName, viewParams) => {
  const template = fs.readFileSync('./data/template/' + templateName + '.mst', 'UTF-8');

  return mustache.render(template, viewParams);
};

export {
  renderTemplate
};