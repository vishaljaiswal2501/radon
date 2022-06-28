const mongoose= require("mongoose")

const internSchema= new mongoose.Schema({

    name:{ type:String, required:true},
    email:{ type:String, required:true, unique:true },
    mobile:{ type:String, required:true, unique:true },
    collegeId: { type:ObjectId, ref:"College", required:true },
    isDeleted:{ type:Boolean, default:false }

},{timestamps:true})

module.exports=mongoose.model("Intern",internSchema);
// hello