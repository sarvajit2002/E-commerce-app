import express from "express";
const router=express.Router();
import {requireSignIn,isAdmin} from '../middleware/authMiddleware.js'
import { createcategoryController,updatecategoryController,categoryController,singlecategoryController,deletecategoryController } from "../controllers/categoryController.js";
router.post('/create-category',requireSignIn,isAdmin,createcategoryController)
router.put('/update-category/:id',requireSignIn,isAdmin,updatecategoryController)
router.get('/get-category',categoryController)
router.get('/single-category/:slug',singlecategoryController)
router.delete('/delete-category/:id',requireSignIn,isAdmin,deletecategoryController)
export default router;