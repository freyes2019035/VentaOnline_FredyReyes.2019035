const recipeModel = require('../../models/recipe.model')
const userModel = require('../../models/users.model')
const productModel = require('../../models/products.model');
const warnings = require('../../utils/warnings/warnings.message')

exports.finishPurchase = async (req, res) => {
    const user = req.user;
    const recipe = new recipeModel();
    if(user.rol === "ROL_CLIENT"){
        await userModel.find({_id: user.sub}, (err, userFound) => {
            if(err){
                warnings.message_500(res)
            }else if(userFound && userFound.length >= 1){
                if(userFound[0].cart.length === 0){
                    warnings.message_custom(res, 'Sorry we can not finish your purchase because you dont have products')
                }else{
                    userFound[0].cart.forEach(async cart => {
                        const product = await productModel.findById(cart.product);
                        await productModel.findByIdAndUpdate(cart.product, {
                            quantity: product.quantity - cart.quantity,
                            quantity_sold: product.quantity_sold + 1,
                        })
                    });
                    recipe.emision_date = new Date();
                    recipe.user = user.sub;
                    recipe.purchase = userFound[0].cart;
                    recipe.total = calcTotal(userFound[0].cart)
                    recipe.save((err, docSaved) => {
                        if(err){
                            warnings.message_500(res)
                        }else if(!docSaved){
                            warnings.message_404(res,'cart')
                        }else{
                            userModel.findByIdAndUpdate(user.sub, {cart: []}, (err, userUpdated) => {
                                if(err){
                                    warnings.message_500(res)
                                }else if(!userUpdated){
                                    warnings.message_404(res, 'user')
                                }else{
                                    res.status(200).send([
                                        {status: 200},
                                        {recipe: docSaved},
                                        {cartItems: 0}
                                    ])
                                }
                            })
                        }
                    })
                }
            }else{
                warnings.message_404(res, 'user')
            }
        })
    }else{
        warnings.message_401(res)
    }
}
exports.getAllRecipes = (req, res) => {
    if(req.user.rol === "ROL_ADMIN"){
        recipeModel.find({}, (err, recipesFound) => {
            if(err){
                warnings.message_500(res)
            }else if(recipesFound && recipesFound.length >= 1){
                res.status(200).send({recipes: recipesFound})
            }else{
                warnings.message_404(res, 'recipes')
            }
        })
    }else{
        warnings.message_401(res)
    }
}
exports.getRecipe = async (req, res) => {
    const recipeId = req.params.id;
    if(req.user.rol === "ROL_ADMIN"){
        recipeModel.find({_id: recipeId}).populate('purchase.product').exec((err, recipesFound) => {
            if(err){
                warnings.message_500(res)
            }else if(recipesFound && recipesFound.length >= 1){
                res.status(200).send(recipesFound)
            }else{
                warnings.message_404(res, 'recipes')
            }
        })
    }else{
        warnings.message_401(res)
    }
}
const calcTotal = (cart) => {
    let total = 0;
    cart.map(obj => {
        total += Number(obj.subTotal);
    })
    return total.toFixed(2);
}