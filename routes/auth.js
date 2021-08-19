const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation,loginValidation} = require('../validation');


router.post('/registrar', async (req, res) => {

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
    nome: req.body.nome,
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
  const emailExist = await User.findOne({email: req.body.email})
  if (!emailExist) return res.status(400).send("Email ou senha errados");

  //TODO separate password validation

  //Create an assign token 
  const token = jwt.sign({_id: User._id},process.env.TOKEN);
  res.header('auth-token',token).send(token);


})

module.exports = router;
