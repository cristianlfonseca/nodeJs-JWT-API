const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/', verify,(req,res) => {
    res.json({
        posts:{
            title:'post',
            description: 'dados do post'
        }
    })
})

module.exports = router;
