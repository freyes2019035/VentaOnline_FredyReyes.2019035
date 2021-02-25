const bcrypt = require('bcrypt-nodejs')
const jwt = require('../../services/auth/auth.service');
const userModel = require('../../models/users.model')
exports.login = (req, res) => {
    var params = req.body;
    userModel.findOne({userName: params.usuario}, (err, user) => {
        (err) 
            ? 
            res.status(500).send({"message": "error getting the data"}) 
            :
            (user) 
            ? 
            bcrypt.compare(params.password, user.password, (err, accessGranted) => {
                if(accessGranted){
                    if(params.getToken === 'true'){
                        return res.status(200).send({
                            token: jwt.createToken(user),
                        })
                    }else{
                        user.password = undefined;
                        return res.status(200).send({user})
                    }
                }else{
                    return res.status(401).send({"message": "access denied user not found"})
                }
            })
            :
            res.status(404).send({"message": "acces denind user inacesible"})
    });
}