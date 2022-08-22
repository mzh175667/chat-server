const express = require('express');
const router = express.Router();

router.get('/zulki', (req,res,next)=>{
    res.status(200).json({
        msg: "hello guys here is faculty(get) route"
    })
}),

router.post('/', (req,res,next)=>{
    res.status(200).json({
        msg: "hello guys here is faculty(post) route"
    })
})
module.exports = router
