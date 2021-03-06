// jshint esversion: 9
// jshint laxbreak: true

if ('undefined' !== typeof require) {
  Utils = require('./Utils');
}

const MCSFile = (function () {
  const _folderName = 'MultiCalSync';
  const _fileName = 'MCSSyncFile.json';

  const _getFolder = obj => {
    Utils.log(`_getFolder(${JSON.stringify(obj)})`);
    const folders = DriveApp.getFoldersByName(obj.folderName);
    if (!folders.hasNext()) obj.folder = DriveApp.createFolder(obj.folderName);
    else obj.folder = folders.next();
    return obj;
  };

  const _getFileFromFolder = obj => {
    Utils.log(`_getFileFromFolder(${JSON.stringify(obj)})`);
    const files = obj.folder.getFilesByName(obj.fileName);
    if (!files.hasNext())
      obj.file = obj.folder.createFile(obj.fileName, '{}', MimeType.PLAIN_TEXT);
    else obj.file = files.next();
    return obj;
  };

  const _getFile = Utils.pipe(_getFolder, _getFileFromFolder);

  const _readFile = obj => {
    Utils.log(`_readFile(${JSON.stringify(obj)})`);
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
      Utils.log(`MCSFile.read()`);
      const content = _getFileContent({
        folderName: this.folderName,
        fileName: this.fileName,
      });

      // Utils.log('file content:', content);

      return content;
    }

    static write(data) {
      Utils.log(`MCSFile.write(${data})`);
      const fileObj = _getFile({
        folderName: this.folderName,
        fileName: this.fileName,
      });
      if ('object' === typeof data) data = JSON.stringify(data); // jshint ignore: line
      fileObj.file.setContent(data);
      return this;
    }

    static share() {
      const fileObj = _getFile({
        folderName: this.folderName,
        fileName: this.fileName,
      });
      const existingEditors = fileObj.file
        .getEditors()
        .map(editor => editor.getEmail());

      const allEditors = Settings.syncTo;

      const newEditors = allEditors.reduce((acc, editor) => {
        if (-1 === existingEditors.indexOf(editor)) acc.push(editor);
        return acc;
      }, []);

      const oldEditors = existingEditors.reduce((acc, editor) => {
        if (-1 === allEditors.indexOf(editor)) acc.push(editor);
        return acc;
      }, []);

      if (newEditors && newEditors.length) fileObj.file.addViewers(newEditors);
      oldEditors.forEach(editor => fileObj.file.removeViewer(editor));

      return this;
    }
  }

  return MCSFile;
})();
