import { comparePassword, hashPassword } from '../helpers/authhelpers.js';
import userModel from '../models/userModels.js';
import orderModel from '../models/orderModel.js';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const registerController = async (req,res) => {
 try {
    const {name,email,password,phone,address,answer} = req.body;
    if(!name){
        return res.send({error:"Name is required"})
    }
    if(!email){
        return res.send({message:"email is required"})
    }
    if(!password){
        return res.send({message:"password is required"})
    }
    if(!phone){
        return res.send({message:"Phone is required"})
    }
    if(!address){
        return res.send({message:"address is required"})
    }
    if(!answer){
        return res.send({message:"answer is required"})
    }
    const existinguser = await userModel.findOne({email})
    if(existinguser){
        res.status(200).send({
            success:false,
            message:'Already Registered Please Login'
        })
    }
    const hashedPassword = await hashPassword(password)
    const user = await new userModel({name,email,phone,address,password:hashedPassword,answer}).save()
    res.status(201).send({
        success:true,
        message:'User Register Successfully',
        user,
    })
 } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:'Error in Registration',
        error
    })
 }
}
export const loginController = async(req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Username or Password"
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registered"
            })
        }
        const match = await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password"
            })
        }
        const token = JWT.sign({_id: user._id},process.env.JWT_SECRET,{
            expiresIn:"7d",
        });
        return res.status(200).send({
            success:true,
            message:"Login Successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
                
            },
            token,
        })
     } catch (error) {
            console.log(error);
            res.status(500).send({
                success:false,
                message:"Error in Login",
                error
            })
        }
    
}
export const forgotPasswordController = async (req,res) =>{
  try {
    const {email,answer,newPassword} = req.body
    if(!email){
        res.status(400).send({message:"Email is required"})
    }
    if(!answer){
        res.status(400).send({message:"answer  is required"})
    }
    if(!newPassword){
        res.status(400).send({message:"new password is required"})
    }
    const user = await userModel.findOne({email,answer})
    if(!user){
        return res.status(404).send({
            success:false,
            message:"wrong Email or answer"
        })
    }
    const hashed = await hashPassword(newPassword)
    await userModel.findByIdAndUpdate(user._id,{password:hashed})
    res.status(200).send({
        success:true,
        message:"Password Reset Successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
        success:false,
        message:"Something went wrong",
        error
    })
  }
}
export const testController = (req,res) =>{
    try {
        res.send("Protected Routes")
    } catch (error) {
        console.log(error);
        res.send({error});
    }
}

export const updateProfileController = async(req,res) => {
    try {
        const {name,email,password,address,phone} = req.body;
        const user = await userModel.findById(req.user._id)
        if(!password && password.length<6){
             return res.json({error:"Password is required and 6 characters long"})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
            name:name || user.name,
            phone:phone || user.phone,
            email:email || user.email ,
            address: address || user.address
        },{new:true})
       res.status(200).send({
        success:true,
        message:'Profile Updated Successfully',
        updatedUser
       })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status:false,
            message:"Error while update profile",
            error
        })
    }
}

export const getOrdersController = async(req,res) =>{
    try {
        const orders = await orderModel.find({buyer:req.user._id})
        .populate('products','-photo')
        .populate("buyer","name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            error
        })
    }
}
export const getAllOrdersController = async(req,res) =>{
    try {
        const orders = await orderModel
        .find({})
        .populate('products','-photo')
        .populate("buyer","name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while getting orders',
            error
        })
    }
}

export const orderStatusController = async(req,res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Error while Updating Orders',
            error
        })
    }
}