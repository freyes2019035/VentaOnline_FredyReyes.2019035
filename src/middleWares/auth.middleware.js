'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const secret = 'ventaOnline_2019035'


exports.ensureAuth = (req, res, next) => {
    if(!req.headers.authorization){
        res.status(401).send({'status': 'Missing Authorization Header'})
    }
    var token = req.headers.authorization.replace(/['"]+/g, '')
            
    try{
        var payload = jwt.decode(token, secret);
        // expiracion de token
        (payload.exp <= moment().unix()) ? res.status(401).send({"message": "token expired"}) : null
    }catch(error){
        console.log(error)
        return res.status(404).send({"message": "token invalid"})
    }


    req.user = payload;
    next()
}
