const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId();
const TestSchema= new Schema({
    firstname: {
    type: String,
    // required: true
  },
  lastname: {
    type: String,
    // required: true
  },
updatedTime:{
  type: Date,
  default:Date.now
}
});
const Test = mongoose.model("Test", TestSchema);

module.exports = Test;