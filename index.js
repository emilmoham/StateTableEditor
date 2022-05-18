const AppTable = require('./src/models/AppTable');

function TestReadAppTable() {
  const table = new AppTable('sample.app');
  table.read();
  table.print();
}

function Main() {
  TestReadAppTable();
}

Main();
