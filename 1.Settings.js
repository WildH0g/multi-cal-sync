// jshint esversion: 9
// jshint laxbreak: true

const Settings = (() => {
  const _settings = {
    syncTo: ['dmitry@noodledocs.com', 'dmitry.kostyuk.ext@veolia.com'],
    syncFrom: ['dmitry.kostyuk@gmail.com'],
    eventPrefix: '[MSC Synced] ',
    localFolderName: 'MultiCalSync',
    localFileName: 'MCSSyncFile.json',
    verbose: true,
  };
  return _settings;
})();
