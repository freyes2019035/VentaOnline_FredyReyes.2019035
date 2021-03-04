'use strict';
const userModel = require('../../models/users.model');
const productModel = require('../../models/products.model')
const bcrypt = require('bcrypt-nodejs')
const warning = require('../../utils/warnings/warnings.message')


exports.createUser = async (req,res) => {
    const {name, email, userName, password} = req.body;
    let user = userModel();
    if(name, email, userName, password){
        user.name = name;
        user.email = email;
        user.userName = userName;
        user.password = await encryptPassword(password);
        user.rol = "ROL_CLIENT";

        userModel.find({
            name: user.name,
            email: user.email,
            userName: user.userName,
            rol: user.rol
        }, (err, doc) => {
            if(err){
                warning.message_500(res)
            }else if(doc && doc.length >=1){
                warning.message_alreadyExists(res, 'user')
            }else{
                user.save((err, document) => {
                    if(err){
                        warning.message_500(res)
                    }else{
                        res.status(200).send([{ status: "User Saved" }, { user: document }]);
                    }
                })
            }
        })
    }else{
        warning.message_400(res)
    }
}
exports.updateUser = (req, res) => {
    let body = req.body;
    let userID = req.user.sub;
    if(body && userID){
        userModel.find({_id: userID}, (err, docFound) => {
            if(err){
                warning.message_500(res);
            }else if(docFound && docFound.length >=1){
                if(docFound[0].rol == "ROL_CLIENT"){
                    delete body.password;
                    delete body.rol
                    userModel.findByIdAndUpdate(userID, body,{new: true},(err, docUpdate) => {
                        if(err){
                            warning.message_500(res)
                        }else if(!docUpdate){
                            warning.message_404(res, 'user')
                        }else{
                            res.status(200).send([{status: 200}, {userUpdated: docUpdate}])
                        }
                    });
                }else{
                    warning.message_custom(res, 'You can not update a user that is not yours, STATUS 401')
                }
            }else{
                warning.message_404(res, 'the user')
            }
        })
    }else{
        warning.message_400(res)
    }
}
exports.deleteUser = (req, res) => {
    let userID = req.user.sub;
    if(userID){
        userModel.find({_id: userID}, (err, docFound) => {
            if(err){
                warning.message_500(res);
            }else if(docFound && docFound.length >=1){
                if(docFound[0].rol == "ROL_CLIENT"){
                    userModel.findByIdAndRemove(userID, (err, docRemoved) => {
                        if(err){
                            warning.message_500(res)
                        }else if(!docRemoved){
                            warning.message_404(res, 'user')
                        }else{
                            res.status(200).send([{status: 200}, {userRemoved: docRemoved}])
                        }
                    });
                }else{
                    warning.message_custom(res, 'You can not delete a user that is not yours, STATUS 401')
                }
            }else{
                warning.message_404(res, 'the user')
            }
        })
    }else{
        warning.message_400(res)
    }
}
exports.addToCart = (req, res) => {
    const { product, quantity } = req.body;
    const user = req.user;
    productModel.find({_id: product}, (err, productFound) => {
        if(err){
            warning.message_500(res)
        }else if(productFound && productFound.length >= 1){
            const price = productFound[0].price;
            const subtotal = parseFloat(quantity * price).toFixed(2);
            const productStock = productFound[0].quantity;
            if(quantity >= productStock){
                warning.message_custom(res, 'Hmmm... sorry we do not have so many products in stock, try Later or add less product :(')
            }else{
                userModel.findByIdAndUpdate(user.sub, {
                    $push: {
                        cart: {
                            product: product,
                            quantity: quantity,
                            subTotal: subtotal
                        }
                    } 
                }, {new: true}, (err, docUpdated) => {
                    if(err){
                        warning.message_500(res)
                    }else if(!docUpdated){
                        warning.message_404(res)
                    }else{
                        res.status(200).send(docUpdated)
                    }
                });
            }
            
        }else{
            warning.message_404(res, 'product')
        }
    })
}

const encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, null, null, (errors, passwordEncrypted) => {
        if (errors) {
          reject(new Error("Some error ocurrss encrypting the password"));
        } else {
          resolve(passwordEncrypted);
        }
      });
    });
};