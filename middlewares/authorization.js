const { request, response } = require("express");
let jwt = require("jsonwebtoken")
exports.authorization = (request, response, next) => {
    // token dikirimkan melalui header
    let header = request.headers.authorization
    let token = header && header.split(" ")[1]

    if (token == null) { // jika kosong
        return response.json({
            message: `Unauthorized` //tidak diizinkan
        })
    } else {
        let secretKey = `Sequelize itu sangat menyenangkan`
        jwt.verify(token, secretKey, (error, user) => {
            if (error) {
                return response.json({
                    message: `Invalid Token`
                })
            }
            else{
                next()
            }
        })
    }
}