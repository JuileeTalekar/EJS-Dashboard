

const express = require('express');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path= require('path');

const User = require('./models/user');


const app = express();
const port = 3006;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());




app.get('/', function (req, res) {
  res.render('index');
});




app.get("/login", function (req, res) {
  res.render('login');
});

// Create user route
app.post('/create', async (req, res) => {
  try {
    const { username, email, age, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      username,
      email,
      age,
      password: hash
    });
    await user.save();

    let token = jwt.sign({ email }, "shhhhhhhhhhh");
    res.cookie("token", token); // httpOnly: false lets you see it in browser DevTools
    res.send("User created successfully");
    // res.render('dashboard', { user: { username, email, age } });
    console.log("created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});



 app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
    const user = await User.findOne({ email :req.body.email });
    console.log(user);

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if(result){
            let token = jwt.sign({ email }, "shhhhhhhhhhh");
    res.cookie("token", token); // httpOnly: false lets you see it in browser DevTools
        res.send("Login successful");

        }
        else {
            res.status(401).send('Invalid email or password');
        }
    });
});

 
app.get("/logout", function(req,res){
    res.cookie("token","")
    res.redirect("/");

})



app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
