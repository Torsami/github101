import pg from 'pg';
import bcrypt from 'bcryptjs';
import express from 'express';
import bodyParser from 'body-parser';
import user from './user';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'})); 

const pool = user.pool;


const signUp = (req, res) => {


let {email, username, password, verify} = req.body;
let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
username = username.replace(/[^0-9A-Za-z\,]/g, "").toLowerCase();

if(username === ''){
    return res.status(400).send({
        success: `false`,
        message: `All fields are required`,
        field: `username`
    })
}

if(!email.match(mailformat)){
    return res.status(400).send({
        success: `false`,
        message: `Enter a valid email`,
        field: `email`
    })
}

if(password === ''){
    return res.status(400).send({
        success: `false`,
        message: `All fields are required`,
        field: `password`
    })
}

if(verify === ''){
    return res.status(400).send({
        success: `false`,
        message: `All fields are required`,
        field: `verify`
    })
}

pool.query('SELECT * FROM users WHERE (email = $1 OR username = $2)', [email, username], (err, result) => {
   console.log(err);
    if(typeof(result.rows[0]) !== 'undefined'){
       
        const db = result.rows[0];

        if(db.username === username){
            return res.status(400).send({
                success: `false`,
                message: `Username already taken by another user`,
                field: `username`
            })
        }
  
        if(db.email === email){
            return res.status(400).send({
                success: 'false',     
                message: 'Email is associated with another user',
                field: `email`
            }); 
        }

    }else{
        if(password !== verify){
            return res.status(400).send({
                success: 'false',     
                message: 'Password does not match',
                field: `verify`
            }); 
        }


        bcrypt.hash(password, 10, (err, hash) => {
            if(err) {
                
                return res.status(400).send({
                   success: `false`,
                   message: err
                });
            }else{
                pool.query('INSERT INTO users (email, username, password, signupdate, answers) VALUES($1, $2, $3, $4, $5)', 
                [email, username, hash, new Date(), 0], (err, result) => {
                   
                        if(result){

                            return res.status(201).send({
                                success: `true`,
                                message: `Your Signed up was successful`
                            });
                        }else{
                            console.log(err);
                            return res.status(400).send({
                                success: `false`,
                                message: err
                            });
                        }
                });

                }
        })
    }

    })
};

export default signUp;
