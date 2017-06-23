
function removeFromArray(array, item) {
  var index = array.indexOf(item);

  if (index >= 0) {
    array.splice(index, 1);
  }
}

class DataTransferModel {

  dataByFormat = {};
  dropEffect = 'none';
  effectAllowed = 'all';
  files = [];
  types = [];

  static readonly events = ['drag', 'dragstart', 'dragenter', 'dragover', 'dragend', 'drop', 'dragleave'];

  clearData(dataFormat) {
    if (dataFormat) {
      delete this.dataByFormat[dataFormat];
      removeFromArray(this.types, dataFormat);
    } else {
      this.dataByFormat = {};
      this.types = [];
    }
  };

  getData(dataFormat) {
    return this.dataByFormat[dataFormat];
  };

  setData(dataFormat, data) {
    this.dataByFormat[dataFormat] = data;

    if (this.types.indexOf(dataFormat) < 0) {
      this.types.push(dataFormat);
    }

    return true;
  };

  setDragImage() {
    // don't do anything (the stub just makes sure there is no error thrown if someone tries to call the method)
  };

}

export default DataTransferModel;