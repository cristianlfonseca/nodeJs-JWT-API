const router = require('express').Router();
const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation,loginValidation} = require('../validation');


router.post('/register', async (req, res) => {

  // Validate data before user register
  const {error} = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message)

  //Check if user is already in database
  const emailExist = await User.findOne({email: req.body.email})
  if (emailExist) return res.status(400).send("Email já existe")

  //Hash password
  const salt  = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password,salt)
  
  //Create a new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    console.log("Usuário Registrado");
    console.log(savedUser)
    res.send({user:user._id});
  } catch (erro) {
    console.log(erro);
    res.status(400).send(erro);
  }
})

//LOGIN
router.post('/login', async(req,res) => {

  // Validate data before user register
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message)

  //Check if email exists
  const user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send("Email ou senha errados");

  //TODO separate password validation

  //Create a a valid User token 
  const token = jwt.sign({_id: user._id},process.env.TOKEN);
  res.header('auth-token',token).send(token);

  //Set an activeToken
  const activeToken = new Token({
    user_id:user._id,
    token:token,
  })
  
  //Check if exists token
  const oldToken = await Token.findOne({user_id: user._id});
  console.log(oldToken)
  
  if(oldToken) {
    const up = await Token.updateOne({user_id:user._id},{$set:{token:token}})
    console.log(up);
  }else{
  
    try {
      const savedToken = await activeToken.save();
      console.log("Token salvo");
      console.log(savedToken)
      // res.send(activeToken);
    } catch (erro) {
      console.log(erro);
      res.status(400).send(erro);
    }

  }  



})

// LOGOUT insert verify?
router.post('/logout',async(req,res) => {

  // const jwt=require("jsonwebtoken"); 
  // const User=require("../models/usersModel"); 
  // const auth=async(req,res,next)=>{ 
  //   try{ 
  //     const token = req.headers.authorization.replace("Bearer ",""); 
  //     const decode = jwt.verify(token,"secret"); 
  //     const user=await User.findOne({ _id:decode._id }); 
      
  //     if(!user){ 
  //       throw new Error() } req.token=token; req.user=user; next() }
  //     catch(error){ return res.status(401).json('Unauthorized access'); } } 
  //     module.exports=auth
})

module.exports = router;
