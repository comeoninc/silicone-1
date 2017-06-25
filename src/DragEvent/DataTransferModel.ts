class DataTransferModel {

  dataByFormat = {};
  dropEffect = 'none';
  effectAllowed = 'all';
  files = [];
  types = [];

  clearData(element: string) {
    if (element) {
      const { [element]: _deleted, ...newDataByFormat } = this.dataByFormat;
      this.dataByFormat = newDataByFormat;
      this.types = this.types.filter($ => $ !== element);
    } else {
      this.dataByFormat = {};
      this.types = [];
    }
  };

  getData(element) {
    return this.dataByFormat[element];
  };

  setData(element, data) {
    this.dataByFormat[element] = data;

    if (this.types.indexOf(element) < 0) {
      this.types.push(element);
    }

    return true;
  };

  setDragImage() {
    // don't do anything (the stub just makes sure there is no error thrown if someone tries to call the method)
  };

}

export default DataTransferModel;