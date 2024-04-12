const uuid = require("uuid").v4;
const { ethers } = require("hardhat");
const Field = require("./FieldSchema");
const { optimaFieldContractInstance } = require("./configuration");

class Optima {
 async save(data) {
  console.log("Data received", data);
  var dataToSaveOnMongoDB = [];
  var dataToSaveOnWeb3 = [];

  for (var i = 0; i < data.length; i++) {
   var field = data[i];
   console.log("Field", field, typeof field.saveToWeb3);
   if (field.saveToWeb3) {
    dataToSaveOnWeb3.push(field);
   } else {
    dataToSaveOnMongoDB.push(field);
   }
  }

  var startTime = new Date().getTime();

  const optimaIdentifier = this.generateID();
  var gasFee = await this.saveToWeb3(dataToSaveOnWeb3, optimaIdentifier);

  await this.saveToMongoDB(dataToSaveOnMongoDB, optimaIdentifier);

  var endTime = new Date().getTime();
  console.log("Data saved successfully", optimaIdentifier, gasFee, endTime - startTime);


  return {
   gasFee : gasFee,
   timeTaken: endTime - startTime,
   optimaIdentifier : optimaIdentifier
  }
 }

 generateID() {
  return uuid();
 }

 async saveToWeb3(data, optimaIdentifier) {
  // Save to web3

  console.log("Saving to Web3", data);

  var totalPrice = 0;

  for (var i = 0; i < data.length; i++) {
   const field = data[i];
   const { fieldName, fieldValue, type } = field;
   const transaction = await optimaFieldContractInstance.saveField(
    fieldName,
    fieldValue,
    type,
    optimaIdentifier
   );

   const transactionReceipt = await transaction.wait();
   console.log("Transaction Receipt", transactionReceipt);

   const gasUsed = transactionReceipt.gasUsed;

   console.log("Gas Used", gasUsed.toString());

   const gasPricePaid = transactionReceipt.effectiveGasPrice;
   console.log("Gas Price Paid", gasPricePaid.toString());

   const transactionFee = gasUsed.mul(gasPricePaid);

   console.log("Transaction Fee", transactionFee.toString());

   console.log("Field saved to Web3");

   const etherToRupeesRate = 280799;
   const gasFeeInRupees = ethers.utils.formatUnits(transactionFee.mul(etherToRupeesRate), 18);

   console.log("Gas Fee in Rupees", gasFeeInRupees);
    totalPrice += parseFloat(gasFeeInRupees);
  }




  return totalPrice;
   

 }

 async saveToMongoDB(data, optimaIdentifier) {
  console.log("Saving to MongoDB", data, optimaIdentifier);

  for (var i = 0; i < data.length; i++) {
   const field = data[i];

   const fieldModel = new Field({
    fieldName: field.fieldName,
    fieldValue: field.fieldValue,
    type: field.type,
    optimaIdentifier: optimaIdentifier,
   });

   await fieldModel.save();
  }
 }


 async get(optimaIdentifier) {
  console.log("Getting data", optimaIdentifier);

  const fieldsFromMongoDB = await this.getFieldsFromMongoDB(optimaIdentifier);
  const fieldsFromWeb3 = await this.getFieldsFromWeb3(optimaIdentifier);

  const fields = fieldsFromMongoDB.concat(fieldsFromWeb3);
  console.log("Fields", fields);
  return fields;
 }

 async getFieldsFromMongoDB(optimaIdentifier) {
  console.log("Getting fields from MongoDB", optimaIdentifier);

  const fields = await Field.find({ optimaIdentifier });

  console.log("Fields from MongoDB", fields);

  return fields;
 }

 async getFieldsFromWeb3(optimaIdentifier) {
  console.log("Getting fields from Web3", optimaIdentifier);

  const fields = await optimaFieldContractInstance.getFieldsByOptimaIdentifier(optimaIdentifier);

  


  const sanitizedFields = fields.map((field) => {
   return {
    fieldName: field.fieldName,
    fieldValue: field.fieldValue,
    type: field.fieldType,
    saveToWeb3: true,
   };
  });

  console.log("Fields from Web3", fields);

  return sanitizedFields;
 }

}

module.exports = Optima;
