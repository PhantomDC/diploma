const fs = require('fs');
const path = require('path');
const uid = require('uid');

class DataBase {

  dbPath = '/store';
  dbPrefix = 'mock';
  backUpPath = '/backups';

  static backUp() {
    const instance = new this();
    const pathToStore = path.join(__dirname, '../', instance.dbPath);
    const pathToBackups = path.join(__dirname, '../', instance.backUpPath);
    const storage = fs.readdirSync(pathToStore);

    if (!fs.existsSync(pathToBackups)) {
      fs.mkdirSync(pathToBackups);
    }

    storage.forEach(store => fs.copyFileSync(
      path.join(pathToStore, store),
      path.join(pathToBackups, store)
    ));
  }

  _getData(dbName) {
    const pathToFile = path.join(__dirname, '../', this.dbPath, `${this.dbPrefix}-${dbName}.json`);
    const dbData = JSON.parse(fs.readFileSync(pathToFile).toString() || "[]");

    return { dbData, pathToFile };
  }

  add(dbName, data = {}, id) {

    const { dbData, pathToFile } = this._getData(dbName);

    Object.assign(data, { _id: id || uid(16) });
    dbData.push(data);

    fs.writeFileSync(pathToFile, JSON.stringify(dbData));
    return data;
  }

  get(dbName, query = {}) {
    const { dbData } = this._getData(dbName);

    return Object.keys(query).reduce((_, key) => (
      dbData.filter(item => item[key] === query[key])
    ), Array.isArray(dbData) ? dbData : []);
  }

  delete(dbName, query = {}) {
    const { dbData, pathToFile } = this._getData(dbName);

    const resultData = Object.keys(query).reduce((_, key) => (
      dbData.filter(item => item[key] !== query[key])
    ), Array.isArray(dbData) ? dbData : []);

    fs.writeFileSync(pathToFile, JSON.stringify(resultData));
    return dbData.length > resultData.length;
  }

  update(dbName, query = {}, data) {
    const dbData = this.get(dbName, query);
    if (!!dbData.length) {
      this.delete(dbName, query);
      dbData.forEach(item => {
        this.add(dbName, data, item._id);
      });
      return true;
    }
    return false;
  }

}

module.exports = DataBase;