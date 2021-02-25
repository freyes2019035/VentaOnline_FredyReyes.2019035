'use strict';
const userModel = require('../models/users.model');
const bcrypt = require('bcrypt-nodejs')

exports.createDefault = async (config) => {
    const {name, email, usuario, password} = config;
    let user = userModel();
    if(name, email, usuario, password){
        user.name = name;
        user.email = email;
        user.user = usuario;
        user.password = await encryptPassword(password);
        user.rol = "ROL_ADMIN";

        userModel.find({
            name: user.name,
            email: user.email,
            user: user.user,
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