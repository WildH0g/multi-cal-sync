// jshint esversion: 9
// jshint laxbreak: true

const test = () => {
  const fileName = 'sdfghjk';
  const files = DriveApp.getFilesByName(fileName);
  console.log(files.hasNext());
  DriveApp.createFile(fileName, '');
  Utilities.sleep(5000);
  console.log(files.hasNext());
};