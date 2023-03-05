const User = require('../models/user')

exports.user_get = (req, res) =>{
    res.status(200).json({user: req.user});
}

exports.user_update_put = async (req, res, next)=>{
    const secret = process.env.MEMBERSHIP_SECRET;

    try{
        if(req.body.secret === secret){
            const updateDoc = await User.findOneAndUpdate(
                {_id: req.params.id},
                {is_member: true},
                {new: true}
            ).select('-password');
            if(!updateDoc){
                return res.status(400).end();
            }
            return res.status(200).json({user: updateDoc})
        }
        return res.status(400).json({message: 'Invalid secret'})
    }catch(err){
        console.log(err)
        res.status(500);
        return next(err);
    }
}