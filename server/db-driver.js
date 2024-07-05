const fileSystem = require("fs");
class DbDriver {
  connection = {};
  constructor(dbname = "db.json") {
    if (!fileSystem.existsSync(dbname)) {
      fileSystem.writeFileSync(dbname, "{}");
    }
    this.dbname = dbname;
  }

  connect() {
    let readfile = fileSystem.readFileSync(this.dbname, "utf8");
    this.connection = JSON.parse(readfile);
  }

  getValue(key) {
    if (!this.connection[key]) {
      return;
    }
    return this.connection[key].value;
  }
  setValue(key, value) {
    if (!this.connection) {
      this.connect();
    }
    if (!this.connection[key]) {
      throw Error("Invalid Key");
    }
    this.connection[key].value = value;
    fileSystem.writeFileSync(this.dbname, JSON.stringify(this.connection));
  }
  hasKey(key) {
    return !!this.connection[key];
  }
  keys(prefix='') {
    let data = {}
    Object.keys(this.connection).forEach((v)=>{
      data[prefix+v]=this.connection[v].name
    })
    return data
  }
  addKey(key, name) {
    this.connection[key] = {
      name,
    };
    fileSystem.writeFileSync(this.dbname, JSON.stringify(this.connection));
  }
  deleteKey(key) {
    if (!this.connection[key]) {
      return;
    }
    delete this.connection[key];
    fileSystem.writeFileSync(this.dbname, JSON.stringify(this.connection));
  }
}

module.exports = DbDriver;
