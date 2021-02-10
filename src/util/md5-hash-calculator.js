import crypto from 'crypto';

const calculateMd5Hash = (...params) => crypto.createHash('md5').update(params.join('')).digest('hex');

export {
  calculateMd5Hash
};
