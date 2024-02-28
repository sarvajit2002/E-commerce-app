import productModels from "../models/productModels.js";
import fs from 'fs';
import slugify from 'slugify';
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from 'dotenv';
dotenv.config();
var gateway = new braintree.BraintreeGateway({
  environment:braintree.Environment.Sandbox,
  merchantId:process.env.BRAINTREE_MERCHANT_ID,
  publicKey:process.env.BRAINTREE_PUBLIC_KEY,
  privateKey:process.env.BRAINTREE_PRIVATE_KEY
})
export const getAllProductsController = async (req, res) => {
  try {
     const products=await productModels.find({})
     .populate('category')
     .select("-photo")
     .limit(12)
     .sort({createdAt:-1})
     res.status(200).send({
      success:true,
      message:"All Products",
      products,
      counttotal:products.length
     })
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success:false,
      error: 'Error in getting products',
      error:error.message
   });
  }
};

export const getsingleproductController = async (req, res) => {
  
  try {
    const product = await productModels.findOne({slug:req.params.slug}).select("-photo").populate("category");
    res.status(200).send({
      success:true,
      message:'Product fetched successfully',
      product
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success:false,
      error: 'Error while getting single product',
      error
    });
  }
};

export const createProductController = async (req, res) => {
  
  try {
    const {name,slug,description,price,category,quantity,shipping} = req.fields;
    const {photo} = req.files;
    switch(true){
        case !name:
          res.status(500).send({error:'Name is required'})
        case !description:
          res.status(500).send({error:'description is required'})
        case !price:
          res.status(500).send({error:'price is required'})
        case !category:
          res.status(500).send({error:'category is required'})
        case !quantity:
          res.status(500).send({error:'quantity is required'})
        case photo && photo.size>1000000:
          res.status(500).send({error:'photo is required and should be less than 1MB'})
    }
    const products = new productModels({...req.fields,slug:slugify(name)})
    if(products){
      products.photo.data = fs.readFileSync(photo.path)
      products.photo.contentType=photo.type
    }
    await products.save();
    res.status(201).send({
      success:true,
      message:'Product Created Successfully',
      products
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const productPhotoController = async (req, res) => {

  try {
    const product=await productModels.findById(req.params.pid).select("photo");
    if(product.photo.data){
      res.set('Content-type',product.photo.contentType)
      return res.status(200).send(product.photo.data)
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success:false,
      error: 'Error getting photo',
      error
    });
  }
};

export const deleteProductController = async (req, res) => {
   try {
     await productModels.findByIdAndDelete(req.params.pid).select("-photo");
     res.status(200).send({
      success:true,
      message:"Product deleted sucessfully"
     })
   } catch (error) {
     console.log(error);
     res.status(500).json({ 
      success:false,
      error: 'Error deleting product',
      error
    });
   }
};

export const updateProductController = async(req,res) =>{
   try {
    const {name,slug,description,price,category,quantity,shipping} = req.fields;
    const {photo} = req.files;
    switch(true){
        case !name:
          res.status(500).send({error:'Name is required'})
        case !description:
          res.status(500).send({error:'description is required'})
        case !price:
          res.status(500).send({error:'price is required'})
        case !category:
          res.status(500).send({error:'category is required'})
        case !quantity:
          res.status(500).send({error:'quantity is required'})
        case photo && photo.size>1000000:
          res.status(500).send({error:'photo is required and should be less than 1MB'})
    }
    const products = await productModels.findByIdAndUpdate(
      req.params.pid,
      {...req.fields,slug:slugify(name)},
      {new:true}
    );
    if(photo){
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType=photo.type;
    }
    await products.save();
    res.status(201).send({
      success:true,
      message:'Product Updated Successfully',
      products
    })
   } catch (error) {
     console.log(error);
     res.status(500).json({
      success:false,
      error,
      message:'Error in updating product'
     })
   }
}

export const productFilterController = async(req,res)=>{
  try {
    const {checked,radio} = req.body;
    let args={}
    if(checked.length>0)
    args.category = checked
    if(radio.length)
    args.price = {$gte:radio[0],$lte:radio[1]}
    const products = await productModels.find(args)
    res.status(200).send({
    success:true,
    products,
  }) 
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:"Error while filtering Products",
      error
    })
  }
}
export const productcountController = async(req,res) =>{
  try {
    const total = await productModels.find({}).estimatedDocumentCount()
    res.status(200).send({
      success:true,
      total,
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message:"Error in product count",
      error,
      success:false,
    })
  }
}
export const productListController = async(req,res) =>{
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1
    const products = await productModels
    .find({})
    .select("-photo")
    .skip((page - 1)*perPage)
    .limit(perPage)
    .sort({createdAt:-1})
    res.status(200).send({
      success:true,
      products 
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:'Error in per page ctrl',
      error
    })
  }
}

export const searchProductController = async(req,res) =>{
  try {
    const {keyword}=req.params;
    const results = await productModels.find({
      $or:[
        {name:{$regex :keyword,$options:"i"}},
        {description:{$regex :keyword,$options:"i"}},
      ]
    })
    .select("-photo");
    res.json(results)
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:'Error in Search Product Api',
      error
    })
  }
}
export const relatedProductController = async (req,res) => {
  try {
    const {pid,cid} = req.params
    const products = await productModels.find({
      category:cid,
      _id:{$ne:pid}
    }).select("-photo").limit(3).populate("category")
    res.status(200).json({
      success:true,
      products
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:"Error while getting related product",
      error
    })
  }
}
export const productCategoryController = async (req,res) => {
    try {
      const category = await categoryModel.findOne({slug:req.params.slug})
      const product = await productModels.find({category}).populate('category');
      res.status(200).send({
        success:true,
        category,
        product,
      }) 
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success:false,
        error,
        message:'Error while getting products'
      })
    }
}
export const brainTreeTokenController = async (req,res) => {
  try {
    gateway.clientToken.generate({},function(err,response){
      if(err){
        res.status(500).send(err);
      }
      else{
        res.send(response);
      }
    })
  } catch (error) {
    console.log(error);
  }
}
export const brainTreePaymentController = async (req,res) =>{
  try {
    const {cart,nonce} = req.body;
    let total = 0
    cart.map((i) => {
      total += i.price;
    }) 
    let newTransaction = gateway.transaction.sale(
      {
        amount:total,
        paymentMethodNonce:nonce,
        options:{
          submitForSettlement:true,
        },
      },
      function(error,result){
        if(result){
          const order = new orderModel({
            products: cart,
            payment:result,
            buyer:req.user._id,
          }).save();
          res.json({ok:true});
        }else{
          res.status(200).send(error);
        }
      }
    )
  } catch (error) {
    console.log(error);
  }
}