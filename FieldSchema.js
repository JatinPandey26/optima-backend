const mongoose = require('mongoose');


const FieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true
    },
    fieldValue:{
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    optimaIdentifier:{
        type: String,
        required: true
    }
})

const Field = mongoose.model('Field', FieldSchema);

module.exports = Field;