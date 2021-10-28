class Service {
  constructor(model) {
    this.Model = model;
  }

  createDoc(data) {
    const created = new this.Model(data);
    const error = created.validateSync();
    if (error) throw error;
    return created;
  }

  createDocAndSave(data) {
    const created = this.createDoc(data);
    return created.save();
  }
}

module.exports = Service;
