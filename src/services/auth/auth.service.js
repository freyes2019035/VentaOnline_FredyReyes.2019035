'use strict'
const jwt = require('jwt-simple')
const moment = require('moment')
const secret = 'ventaOnline_2019035'

exports.createToken = (user) => {
    let payload = {
        sub: user._id,
        name: user.name,
        usuario: user.user,
        rol: user.rol,
        cursos: user.cart,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }
    return jwt.encode(payload, secret)
}

