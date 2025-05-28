import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { genToken } from "../lib/genToken.js";
import fileService from "../lib/fileService.js";

export const signup = async (req, res) => {
  try {
    const userData = req.userData;

    const findUser = await User.findOne({ email: userData.email });
    if (findUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new User({
      fullName: userData.fullName,
      email: userData.email,
      password: hashedPassword
    });

    await newUser.save(); 
    genToken(newUser._id, res);

    console.log(newUser);
    return res.status(201).json({
      message: "User registered in DB"
    });

  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
export const login = async (req,res) =>{
  try{
    const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({
      message: "Wrong credentials"
    });
  }
  const isPasswordCorrect = await bcrypt.compare(password,user.password);
  if(!isPasswordCorrect){
    return res.status(400).json({
      message: "Wrong credentials"
    });
  }  genToken(user._id,res);
  res.status(200).json({
    id:user._id,
    fullName:user.fullName,
    email:user.email,
    profilePic:user.profilePic,
    role:user.role
  });

  }catch(error){
    console.error("Error in login controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
  
}
export const logout = async (req,res) =>{
  try{
    const origin = req.headers.origin || '';
    console.log('Logout request from origin:', origin);
    
    // Cookie options for clearing
    const cookieOptions = {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'none',
      secure: true
    };
    
    // Only set domain for actual domain names, not IP addresses
    if (origin.includes('nanotechchemical.com')) {
      cookieOptions.domain = '.nanotechchemical.com';
    }
    
    res.cookie("jwt", "", cookieOptions);
    return res.status(200).json({
      message: "Logout successfully"
    });
  }
  catch(error){
    console.log("Error in logout controller", error);
    return res.status(400).json({
      message: "Internal server error"
    });
  }

}
export const updateProfile = async(req,res)=>{
  try{
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }
    
    const userId = req.user._id;
    
    // Check if file was uploaded
    if(!req.file){
      return res.status(400).json({
        message:"Profile picture is required"
      });
    }
    
    console.log("Profile update requested by user:", userId, "File:", req.file.filename);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Delete old profile picture if exists
    if (user.profilePic) {
      try {
        fileService.deleteFileByUrl(user.profilePic);
      } catch (deleteError) {
        console.error("Error deleting old profile picture:", deleteError);
        // Continue even if deletion fails
      }
    }

    // Generate new profile picture URL
    const profilePicUrl = fileService.generateFileUrl(req, req.file.filename, 'profiles');
    
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {profilePic:profilePicUrl},
      {new:true}
    ).select("-password");
    
    console.log("Profile updated successfully for user:", userId);
    res.status(200).json(updateUser);
  } catch(error) {
    console.error("Error in update profile controller:", error);
    return res.status(500).json({
      message: "Failed to update profile: " + (error.message || "Unknown error")
    });
  }
}

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      profilePic: req.user.profilePic,
      role: req.user.role
    });
  } catch (error) {
    console.error("Error in checkAuth controller:", error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
  
