// jshint esversion: 9
// jshint laxbreak: true

const RemoteFiles = (function () {
  class RemoteFile {
    constructor(fileObj) {
      this.id = fileObj.getId();
      this.owner = fileObj.getOwner().getEmail();
      this.content = JSON.parse(fileObj.getBlob().getDataAsString());
      this.url = fileObj.getUrl();
    }
  }

  class RemoteFiles {
    constructor() {
      if (RemoteFiles.instance) return RemoteFiles.instance;
      this.registry = [];
      this.user = Session.getActiveUser().getEmail();
      RemoteFiles.instance = this;
      return RemoteFiles.instance;
    }

    getList() {
      const fileIterator = DriveApp.getFilesByName(Settings.localFileName);
      while (fileIterator.hasNext()) {
        const file = new RemoteFile(fileIterator.next());
        if (false !== this.check(file)) this.registry.push(file);
      }
      return this;
    }

    add(file) {
      if (this.check) this.registry.push(file);
      return this;
    }

    check(file) {
      if (this.user === file.owner) return false;
      return file;
    }

    toString() {
      const registry = this.registry.map(entry => {
        entry.content = JSON.stringify(entry.content).substr(0, 100) + '...';
        return entry;
      });

      return JSON.stringify(registry, null, 2);
    }
  }

  return RemoteFiles;
})();
