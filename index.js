const express = require ('express')
const pool = require("./db")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const app = express() 
app.use(express.json())

app.post('/signup', async(req,res) => {
   try {
        const { username, email, password}  = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const exitingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1", [email]
        );
        if(exitingUser.rows.length > 0) {
            return res.status(409).json({
                message: "user already exists with this email",
            })
        }

        await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [
                username,
                email,
                hashedPassword
            ]
        );
        res.status(201).json({
            message: "SignUp successful"
        })
   } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
   }
})
app.post('/signin', async(req,res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if(existingUser.rows.length === 0){
            return res.status(404).json({
                message: "User not found"
            })
        }
        const user = existingUser.rows[0]
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_SECRET,{expiresIn: "1d"})

        res.status(200).json({
            message: "signin",
            token
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
})
app.listen(3000, () => {
    console.log('server is running on port 3000')
})