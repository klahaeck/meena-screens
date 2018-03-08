import config from '../../config/environment';

export const client = require('pkgcloud').storage.createClient({
  provider: 'amazon',
  keyId: config.aws.accessKey, // access key id
  key: config.aws.secretKey, // secret key
  region: config.aws.region // region
});
export const bucketName = 'meena-screens';