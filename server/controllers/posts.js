import  mongoose  from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPostsBySearch = async (req,res)=> {
    const {searchQuery, tags} = req.query;
    console.log(searchQuery);

    try {
        const  title  = new RegExp(searchQuery,'i')
        const posts = await PostMessage.find({ $or: [ { title }, {tags: { $in:tags.split(',') }} ] });
        res.status(200).json({data:posts} );    
    } catch (error) {
        res.status(400).json({mesaage: error.mesaage})
    }
}

export const getPosts = async (req,res)=> {
    const { page } = req.query;
    console.log(page)
    try {
        const LIMIT = 8;
        const StartIndex = (Number(page) - 1) * LIMIT; // for getting starting index of page
        const total = await PostMessage.countDocuments({});

        const post = await PostMessage.find().sort({ _id: -1}).limit(LIMIT).skip(StartIndex);
       console.log(post);
        res.status(200).json({ data:post, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT) });    
    } catch (error) {
        res.status(400).json({mesaage: error.mesaage})
    }
}

export const getPost = async (req,res)=> {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json({ post });    
    } catch (error) {
        res.status(400).json({mesaage: error.mesaage})
    }
}

export const createPost = async (req,res)=> {
    const post = req.body;
    console.log(post)
    const newPost = new PostMessage({ ...post, creator:req.userId, createdAt: new Date().toISOString() });
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({mesaage: error.mesaage})
    }
}

export const updatePost = async (req,res) =>{
   const { id: _id } = req.params;
   const post = req.body;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

   const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id}, {new:true}); 

   res.json(updatedPost);
}

export const deletePost = async(req,res) => {
   const { id: _id } = req.params;
   if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

   await PostMessage.findByIdAndRemove(_id);
   res.json({mesaage: 'Post Deleted Successfully'});
}

export const likePost = async(req,res) =>{
    const { id: _id } = req.params;

    if(!req.userId) return res.json({ mesaage: 'Unauthenticated' });

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1){
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new:true});

    res.json(updatedPost);
}

export const commentPost = async(req,res) => {
    const { id } = req.params;

    const {value} = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new:true});

    res.json(updatedPost);
} 