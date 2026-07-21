const express = require ('express')
const pool = require("./db")
const app = express() 
app.use(express.json())

app.post('/signup', async(req,res) => {
   try {
        const { username, email, password}  = req.body;
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
                password
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
app.post('/signin', (req,res) => {

})
app.listen(3000, () => {
    console.log('server is running on port 3000')
})