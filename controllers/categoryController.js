import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createcategoryController = async(req,res)=>{
  try {
    const {name} = req.body;
    if(!name){
        return res.status(401).send({message:'Name is Registered'})
    }
    const existingCategory = await categoryModel.findOne({name})
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"Category already exists"
        })
    }
    const category = await categoryModel({name,slug:slugify(name)}).save();
    return res.status(201).send({
        success:true,
        message:'New Category Created',
        category
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        error,
        message:'Error in category'
    })
  }
}
export const updatecategoryController = async(req,res) => {
   try {
    const {name}=req.body;
    const {id}=req.params;
     const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name,)},{new:true});
     res.status(200).send({
      success:true,
      message:'Category Updated',
      category
     })
   } catch (error) {
      console.log(error);
      res.status(500).send({
        success:false,
        error,
        message:'Error while updating category'
      })
   }
}
export const categoryController = async(req,res) =>{
  try {
    const category=await categoryModel.find({});
    res.status(200).send({
      success:true,
      message:'All Categories List',
      category,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
      message:"Error while getting category"
    })
  }
}
export const singlecategoryController = async(req,res) => {
   try {
     const category = await categoryModel.findOne({slug:req.params.slug})
     res.status(200).send({
      success:true,
      message:"Got Single Category Successfully",
      category
     })
   } catch (error) {
    console.log(error);
    res.send(500).send({
      success:false,
      error,
      message:'Not Able to get single category'
    })
   }
}
export const deletecategoryController = async(req,res) =>{
  try {
    const {id} = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success:true,
      message:"delete category succcessfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success:false,
      message:'Error while deleting category',
      error
    })
  }
}