import fs from 'fs';
import sanitize from 'sanitize-filename';
import tmp from 'tmp';
import config from '../../config/environment';

const isProduction = config.env === 'production';

// FOR TESTING
// const isProduction = true;

const im = require('imagemagick');
const gm = require('gm').subClass({imageMagick: true});

const client = require('pkgcloud').storage.createClient({
  provider: 'amazon',
  keyId: config.aws.accessKey, // access key id
  key: config.aws.secretKey, // secret key
  region: config.aws.region // region
});
const bucketName = 'meena-screens';

const thumbWidth = 150;
const largeWidth = 1440;
const convertArgs = ['-colorspace', 'gray', '(', '+clone', '-blur', '0x2', ')', '+swap', '-compose', 'divide', '-composite', '-linear-stretch', '5%x0%', '-negate'];

function getRotationAngle(file, callback) {
  gm(file).size(function(err, size) {
    const rotationAngle = size.width < size.height ? 90 : 0;
    callback(err, rotationAngle);
  });
}

function writeFile(stdout, destPath, imagePath, resolve, reject, cb) {
  let writeStream;

  if(isProduction) {
    writeStream = client.upload({
      container: bucketName,
      remote: imagePath,
      acl: 'public-read',
      contentType: 'image/jpeg'
    });
    writeStream.on('finish', function() {
      if(typeof cb === 'function') {
        cb();
      }
      if(typeof resolve === 'function') {
        resolve();
      }
      return null;
    });
  } else {
    if(!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
    }
    writeStream = fs.createWriteStream(imagePath);
    writeStream.on('finish', function() {
      if(typeof cb === 'function') {
        cb();
      }
      if(typeof resolve === 'function') {
        resolve();
      }
    });
  }
  writeStream.on('error', function(err) {
    reject(err);
  });

  // if(stdout === null) {
  //   const readStream = fs.createReadStream();
  //   readStream.pipe(writeStream);
  // } else {
  //   stdout.pipe(writeStream);
  // }
  stdout.pipe(writeStream);
}

export function process(file) {
  const now = new Date();
  const dirName = now.getTime();
  const dirPath = `uploads/${dirName}`;

  const fileName = sanitize(file.name);
  const largeName = `large-${fileName}`;
  const thumbName = `thumb-${fileName}`;
  const linesName = `lines-${fileName}`;
  const linesThumbName = `lines-thumb-${fileName}`;

  const destPath = isProduction ? dirPath : `${config.root}/client/${dirPath}`;

  const imagePath = `${destPath}/${fileName}`;
  const largePath = `${destPath}/${largeName}`;
  const thumbPath = `${destPath}/${thumbName}`;
  const linesPath = `${destPath}/${linesName}`;
  const linesThumbPath = `${destPath}/${linesThumbName}`;

  const fileData = {
    name: fileName,
    path: dirPath,
    versions: {
      large: largeName,
      thumb: thumbName,
      lines: linesName,
      linesThumb: linesThumbName
    }
  };

  // console.log(fileData);
  let rotationAngle;

  return new Promise( resolve => {
    return new Promise( function(resolve, reject) {  
      gm(file.path)
        .stream(function (err, stdout) {
          if(err) reject(err);
          writeFile(stdout, destPath, imagePath, resolve, reject);
        });
    })
      .then(() => {
        return new Promise( (resolve, reject) => {
          getRotationAngle(file.path, function(err, value) {
            if(err) reject(err);
            rotationAngle = value;
            resolve();
          });
        });
      })
      .then(() => {
        return new Promise( function(resolve, reject) {
          gm(file.path)
            .rotate('black', rotationAngle)
            .resize(largeWidth)
            .stream(function(err, stdout) {
              if(err) reject(err);
              writeFile(stdout, destPath, largePath, null, reject);

              gm(stdout)
                .resize(thumbWidth)
                .stream(function(err, stdout) {
                  if(err) reject(err);
                  writeFile(stdout, destPath, thumbPath, resolve, reject);
                });
            });
        });
      })
      .then(function() {
        // CREATE LINES VERSION
        return new Promise( (resolve, reject) => {
          const tmpParams = {dir:`${config.root}/client/tmp`};
          const largeTmp = tmp.fileSync(tmpParams);
          const linesTmp = tmp.fileSync(tmpParams);
          
          gm(file.path)
            .rotate('black', rotationAngle)
            .resize(largeWidth)
            .write(largeTmp, function(err) {
              if(err) reject(err);
              im.convert([largeTmp, ...convertArgs, linesTmp], function(err) {
                if(err) reject(err);
                gm(linesTmp)
                  .stream(function(err, stdout) {
                    if(err) reject(err);
                    writeFile(stdout, destPath, linesPath, null, reject);

                    gm(stdout)
                      .resize(thumbWidth)
                      .stream(function(err, stdout) {
                        if(err) reject(err);
                        writeFile(stdout, destPath, linesThumbPath, resolve, reject, function() {
                          largeTmp.removeCallback();
                          linesTmp.removeCallback();
                        });
                      });
                  });
              });
            });
        });
      })
      .then(() => {
        resolve({name:dirName, file:fileData});
      });
  });
}
