const express = require('express')
const app = express()
const port = 3000

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("./key.json");

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

app.set("view engine", "ejs");

app.get('/', (req, res) => {
  res.render('start')
})


app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/loginsubmit', (req, res) => {
    const email = req.query.email
    const password = req.query.password

    db.collection("users").where("email", "==", email).where("password","==",password).get().then((docs) =>{
        if(docs.size>0) {
            res.render('home')
        }
        else{
            res.send("Account not found")
        }
    })
})

app.get('/signupsubmit',(req,res)=>{
  const full_name= req.query.full_name
  const email = req.query.email
  const password = req.query.password
  const date = req.query.date

  db.collection('users').add({
    name: full_name,
    email: email,
    password: password,
    DOB: date
  }).then(() => {
    res.send("Signed up sucessfully")
  })

})
app.get('/signup', (req, res) => {
    res.render('signup')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})