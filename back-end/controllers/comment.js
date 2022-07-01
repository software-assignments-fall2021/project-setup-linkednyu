const Comment = require('../models/Comment');
const { commentValidation } = require('./validation')


const sendComment = async (req, res) => {
    const comment = req.body
    const error = commentValidation(comment).error;
    if (error) {
        console.log(error);
        return res.status(409).json({ errors: error.details[0].message })
    }

    const newComment = new Comment({
        userName: comment.userName,
        avatar: comment.avatar,
        content: comment.content,
        date: comment.date,
        post_id: comment.post_id
    })

    try {
        const savedComment = await newComment.save()
        res.status(200).json(savedComment)
    } catch (error) {
       
        res.status(409).json({ message: error.message })
    }
}

//function for comments
const viewComment = async (req, res) => {
    try {
        const commentMessages = await Comment.find({ post_id: req.params.id })
        
        res.status(200).json(commentMessages)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


module.exports = {
    viewComment,
    sendComment
}