require('dotenv').config();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const axios = require('axios');
const channelModel = require('../models/Channel');
const userModel = require('../models/User')



const channel = async(req, res) =>{
    console.log("[Channel Function]Get channel Detail");
    let filter = req.params.id;
    let result = await channelModel.find({id:filter}).lean();
    res.send(result);
};

const joinChannel = async(req, res) => {
    console.log("[Channel Function] joinChannel");
    //authorize user

    // query database
    let userDoc = await userModel.findOne({email:req.body.email});
    if(!userDoc){
        return res.status(404).json({message:"Can't find User"});
    }
    let subscribedArray = userDoc.channel.toObject();

    let newChannel = req.body.channelId;
    
    for(let i = 0; i < subscribedArray.length; i++){
        if(subscribedArray[i] == newChannel){
            return res.status(409).json({message:"Already Joined"});
        }
    }
    
    userDoc.channel.push(newChannel);
    await userDoc.save(function(){});
    
    return res.status(200).json({message:"Done"});
}; 

const leaveChannel = async(req, res) =>{
    console.log("[Channel Function] leave Channel");
    //authorize user

    // query database
    let userDoc = await userModel.findOne({email:req.body.email});
    if(!userDoc){
        return res.status(404).json({message:"Can't find User"});
    }
    let subscribedArray = userDoc.channel.toObject();
    let newArray = [];

    let newChannel = req.body.channelId;
    let modfied = false;
    for(let i = 0; i < subscribedArray.length; i++){
        if(subscribedArray[i] == newChannel){
            modified = true;
        }else{
            newArray.push(subscribedArray[i]);
        }
    }
    
    if(modified){
        userDoc.channel = newArray;
        await userDoc.save(function(){});
        return res.status(200).json({message:"Done"});
    }else{
        return res.status(409).json({message:"Not Joined"});
    }
}

module.exports = {
    channel,
    joinChannel,
    leaveChannel
};