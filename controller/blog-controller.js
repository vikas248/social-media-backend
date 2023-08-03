import mongoose from "mongoose";
import Blog from "../model/Blog";
import User from "../model/User";

//1
export const getAllBlogs = async(req,res,next)=>{
    let blogs;
    try{
        blogs = await Blog.find();
    }catch(err){
        return console.log(err);
    }
    if(!blogs){
        return res.status(404).json({message:"No Blogs Found"})
    }
    return res.status(200).json({blogs});
}

//2
export const addBlog = async(req, res, next)=>{
    const {title, description, image, user} = req.body;

    let existingUser;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(404).json({message:"Unable to find User by this id"})
    }

    const blog = new Blog({
        title,
        description,
        image,
        user: existingUser,
    });
    try{
        // await blog.save() we will not directly save the blog we will asign it "User" as well
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    }catch(err){
       console.log(err);
       return res.status(500).json({message: err});
    }
    return res.status(200).json({blog});
};

//3
export const updateBlog = async(req, res, next)=>{
    const {title,description} = req.body;  // ye vo values h jo update honi h
    const blogId = req.params.id; // yha se hme id pta lagegi
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description
        })
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(500).json({message:`Unable to update with id ${blogId}`})
    }
    return res.status(200).json({blog})
}


//4
export const getBlogById = async(req, res, next)=>{
    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(blogId);
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(404).json({message:`Unable to find any blog with id ${blogId}`})
    }
    return res.status(200).json({blog});
}


//5
export const deleteBlog = async(req, res, next)=>{
    const blogId = req.params.id;
    
    let blog;
    try{
        blog = await Blog.findByIdAndRemove(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    }catch(err){
        return console.log(err);
    }
    if(!blog){
        return res.status(500).json({message:`No Blog found with id: ${blogId}`})
    }
    return res.status(200).json({message:"Successfully Deleted"});
}


//6
export const getByUserId = async(req, res, next)=>{
    const userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blogs")
    }catch(err){
        return console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message:"no blogs found"})
    }
    return res.status(200).json({userBlogs});
}