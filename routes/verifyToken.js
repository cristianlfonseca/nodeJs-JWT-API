const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

module.exports = async function (req,res,next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send("Acesso negado")

    const activeToken = await Token.findOne({token: token})
    
    if (!activeToken) return res.status(401).send("Sem token Ativo")

    try {
        const verified = jwt.verify(token,process.env.TOKEN);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Token Inválido");
    }
        
}