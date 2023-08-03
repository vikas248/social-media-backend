import User from '../model/User';
import bcrypt from 'bcryptjs';

//1
export const getAllUser = async(req,res,next)=>{
    let users;
    try{
        users = await User.find();
    }catch(err){
        console.log(err);
    }
    if(!users){
        return res.status(404).json({message:"No Users Found"})
    }
    return res.status(200).json({users});
}

//2
export const signup = async(req, res, next)=>{
    const {name, email, password} = req.body;

    //checking user exist or not
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
       return console.log(err);
    }
    if(existingUser){
        return res.status(400).json({message:"User Already Exists Login Instead!!"});
    }
    
    //If found user not exists then add user to database
    const hashedPassword = bcrypt.hashSync(password);
    const addUser = new User({
        name,
        email,
        password: hashedPassword,
        blogs:[]
    })
    try{
        addUser.save();
    }catch(err){
       return console.log(err);
    }
    res.status(201).json({addUser});
}

//3
export const login = async(req,res,next)=>{
    const {email, password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
       return console.log(err);
    }
    if(!existingUser){
        return res
                .status(404)
                .json({message:"User I'D Not Exist Please Signup"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect){
        return res
                .status(400)
                .json({message:"InCorrect Password"})
    }
    return res
            .status(200)
            .json({message:"Logged In Successfully"})
}
