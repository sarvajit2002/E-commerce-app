import express from 'express';
const router = express.Router();
import { isAdmin,requireSignIn } from '../middleware/authMiddleware.js';
import {createProductController,getAllProductsController,getsingleproductController,productPhotoController,deleteProductController,
     updateProductController,productFilterController, productcountController,productListController, searchProductController,
     relatedProductController,productCategoryController,brainTreeTokenController,brainTreePaymentController} 
from '../controllers/productController.js';
import formidable from 'express-formidable';
router.post('/create-products',requireSignIn,isAdmin,formidable(),createProductController);
router.put('/update-products/:pid',requireSignIn,isAdmin,formidable(),updateProductController);
router.get('/get-products',getAllProductsController)
router.get('/get-product/:slug', getsingleproductController);
router.get('/product-photo/:pid',productPhotoController);
router.delete('/delete-products/:pid',deleteProductController)
router.post('/product-filters',productFilterController)
router.get('/product-count',productcountController)
router.get('/product-list/:page',productListController)
router.get('/search/:keyword',searchProductController)
router.get('/related-product/:pid/:cid',relatedProductController);
router.get('/product-category/:slug',productCategoryController);
router.get('/braintree/token',brainTreeTokenController);
router.post('/braintree/payment',requireSignIn,brainTreePaymentController)

export default router;
