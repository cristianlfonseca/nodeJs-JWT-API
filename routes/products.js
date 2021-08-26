const router = require('express').Router();
const verify = require('./verifyToken')
const Product = require('../models/Product')


router.post('/create', async (req, res) => {

    //Create a new Product
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
    });

    try {
        const savedProduct = await product.save();
        console.log("Produto salvo");
        console.log(savedProduct)
        res.send({product:product._id});
    } catch (erro) {
        console.log(erro);
        res.status(400).send(erro);
    }
})


router.get('/list', verify ,async (req,res) => {

    let filter  = {};
    for (const key in req.query) {
        { rank: { $regex: 'Commander' } }
        filter[key] = { $regex: req.query[key]}
    }
    
    //Get products considerig filters via GET
    const products = await Product.find(filter);
    res.send(products);
})

module.exports = router;
