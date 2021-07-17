// jshint esversion: 9
// jshint laxbreak: true

if ('undefined' !== typeof require) {
  Utils = require('./Utils');
}

const MCSFile = (function () {
  const _folderName = 'MultiCalSync';
  const _fileName = 'MCSSyncFile.json';

  const _getFolder = obj => {
    console.log(`_getFolder(${JSON.stringify(obj)})`);
    const folders = DriveApp.getFoldersByName(obj.folderName);
    if (!folders.hasNext()) obj.folder = DriveApp.createFolder(obj.folderName);
    else obj.folder = folders.next();
    return obj;
  };

  const _getFileFromFolder = obj => {
    console.log(`_getFileFromFolder(${JSON.stringify(obj)})`);
    const files = obj.folder.getFilesByName(obj.fileName);
    if (!files.hasNext())
      obj.file = obj.folder.createFile(obj.fileName, '{}', MimeType.PLAIN_TEXT);
    else obj.file = files.next();
    return obj;
  };

  const _getFile = Utils.pipe(_getFolder, _getFileFromFolder);

  const _readFile = obj => {
    console.log(`_readFile(${JSON.stringify(obj)})`);
    return obj.file.getBlob().getDataAsString();
  };

  const _getFileContent = Utils.pipe(_getFile, _readFile);

  class MCSFile {
    constructor() {}

    static get folderName() {
      return _folderName;
    }

    static get fileName() {
      return _fileName;
    }

    static read() {
      console.log(`MCSFile.read()`);
      const content = _getFileContent({
        folderName: this.folderName,
        fileName: this.fileName,
      });

      console.log('file content:', content);

      return content;
    }

    static write(data) {
      console.log(`MCSFile.write(${data})`);
      const fileObj = _getFile({
        folderName: this.folderName,
        fileName: this.fileName,
      });
      if ('object' === typeof data) data = JSON.stringify(data); // jshint ignore: line
      fileObj.file.setContent(data);
      return this;
    }
  }

  return MCSFile;
})();
