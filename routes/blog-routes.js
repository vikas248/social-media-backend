import express from "express";
import {addBlog, deleteBlog, getAllBlogs, getBlogById, getByUserId, updateBlog} from "../controller/blog-controller";

const blogRouter = express.Router();

blogRouter.get("/", getAllBlogs);
blogRouter.post("/add", addBlog);
blogRouter.put("/update/:id", updateBlog);
blogRouter.get("/:id", getBlogById);
blogRouter.delete("/delete/:id", deleteBlog);
blogRouter.get("/user/:id", getByUserId)  //getting the blogs of the user

export default blogRouter;

