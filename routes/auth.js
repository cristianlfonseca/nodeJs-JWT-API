const router = require('express').Router();
const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verify = require('./verifyToken')
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

  // Validate login data
  const {error} = loginValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message)

  //Check if email exists
  const user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send("Email ou senha errados");

  //Create a valid User token 
  const token = jwt.sign({_id: user._id},process.env.TOKEN);
  
  //Set an activeToken from created token
  const activeToken = new Token({
    user_id:user._id,
    token:token,
  })
  
  //Check if exists token into DB
  const oldToken = await Token.findOne({user_id: user._id});
  
  if(oldToken) {
    const up = await Token.updateOne({user_id:user._id},{$set:{token:token}})
    res.header('auth-token',token).status(200).send(token);
  }else{
    
    try {
      const savedToken = await activeToken.save();
      res.header('auth-token',token).status(200).send(token);
      console.log("Token salvo");
      console.log(savedToken)
    } catch (erro) {
      console.log(erro);
      res.status(400).send("Problema no Token de autenticação." + erro);
    }
  }  
})

// LOGOUT insert verify?
router.post('/logout', verify , async(req,res) => {
  //Front-end Logout must end cookies session
  //Back-end will finish active token saved
  const token = req.header('auth-token');

  try {
    await Token.deleteOne({token: token})
    res.status(200).send("Logout Completo")
  }catch (error) {
    res.status(400).send("Erro ao efeuar logout");
  }

})

module.exports = router;
