'use strict';
const userModel = require('../../models/users.model');
const bcrypt = require('bcrypt-nodejs')
const warning = require('../../utils/warnings/warnings.message')


exports.createUser = async (req,res) => {
    const {name, email, userName, password, rol} = req.body;
    let user = userModel();
    if(req.user.rol === "ROL_ADMIN"){
        if(name, email, userName, password,rol){
            user.name = name;
            user.email = email;
            user.userName = userName;
            user.password = await encryptPassword(password);
            user.rol = rol;
    
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
    }else{
        warning.message_401(res)
    }
}
exports.updateUser = (req, res) => {
    let body = req.body;
    let userID = req.params.userID;

    if(req.user.rol === "ROL_ADMIN"){
        if(body && userID){
            userModel.find({_id: userID}, (err, docFound) => {
                if(err){
                    warning.message_500(res);
                }else if(docFound && docFound.length >=1){
                    if(docFound[0].rol == "ROL_CLIENT"){
                        delete body.password;
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
                        warning.message_custom(res, 'You can not update user that is not CLIENT, STATUS 401')
                    }
                }else{
                    warning.message_404(res, 'the user')
                }
            })
        }else{
            warning.message_400(res)
        }
    }else{
        warning.message_401(res)
    }
}
exports.deleteUser = (req, res) => {
    let userID = req.params.userID;
    if(req.user.rol === "ROL_ADMIN"){
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
                        warning.message_custom(res, 'You can not delete user that is not CLIENT, STATUS 401')
                    }
                }else{
                    warning.message_404(res, 'the user')
                }
            })
        }else{
            warning.message_400(res)
        }
    }else{
        warning.message_401(res)
    }
}

exports.createDefault = async (config) => {
    const {name, email, userName, password} = config;
    let user = userModel();
    if(name, email, userName, password){
        user.name = name;
        user.email = email;
        user.userName = userName;
        user.password = await encryptPassword(password);
        user.rol = "ROL_ADMIN";

        userModel.find({
            name: user.name,
            email: user.email,
            userName: user.userName,
            rol: user.rol
        }, (err, doc) => {
            if(err){
                console.error(new Error('Jmmmm... some error ocurrs'))
            }else if(doc && doc.length >=1){
                console.log({ status: "Admin already exists in Data Base" });
            }else{
                user.save((err, document) => {
                    if(err){
                        console.error(new Error('Jmmmm... some error ocurrs'))
                    }else{
                        console.log([{ status: "Admin Saved" }, { admin: document }]);
                    }
                })
            }
        })
    }else{
        console.error(new Error('Jmmm... ur missing parameters'))
    }
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