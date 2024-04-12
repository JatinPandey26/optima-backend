const Optima = require("./Optima");

const router = require("express").Router();

router.post("/save", async function (req, res) {
 try {
  const optimaInstance = new Optima();
  const fields = req.body.fields;
  const response = await optimaInstance.save(fields)
  res.status(200).json(
   {
    message: "Data saved successfully",
    timeTaken : response.timeTaken,
    gasFee: response.gasFee,
    optimaIdentifier: response.optimaIdentifier
   }
  )
 } catch (e) {
  console.log(e);
  res.status(500).json({
   message: "Internal Server Error"
  })
 }
});


router.get("/get/:optimaIdentifier",async function(req,res){
 try{

  const optimaInstance = new Optima();
  const optimaIdentifier = req.params.optimaIdentifier;
  const response = await optimaInstance.get(optimaIdentifier);
  res.status(200).json(response);
  console.log("Response",response);

 }
 catch(e){
   console.log(e);
   res.status(500).json({
     message: "Internal Server Error"
   })
 }
})


module.exports = router;
