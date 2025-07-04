import express, { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { AuthRequest } from "../models/AuthRequest";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { verifyAndRefreshToken } from "../middleware/refreshToken";

const router: Router = express.Router();

//change usernmae
router.patch('/nickname', protect, async(req:AuthRequest, res):Promise<void> =>{
    const {nickname} = req.body;

    if(!nickname) {
        res.status(400).json({message: "nickname is required"});
        return;
    }
    try{
        const user = await User.findByIdAndUpdate(req.user.id, {nickname}, {new:true});
        res.json({message: "Nickname updated", nickname:user?.nickname});
    }
    catch(err){ 
        res.status(500).json({message: 'server error'})
    }

})

//change password
router.patch('/password', protect, async(req:AuthRequest, res):Promise<void> =>{
    const {currentPassword, newPassword} = req.body;

    if(!currentPassword || !newPassword){
        res.status(400).json({message: "Old and New passwords are required"});
        return;
    }

    try{
        const user = await User.findById(req.user.id);
        if(!user) {
            res.status(404).json({message:"User not found"});
            return;
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if(!isMatch){
            res.status(401).json({message:"incorrect password"});
            return;
        }

        user.password=await bcrypt.hashSync(newPassword, 10);
        await user.save();
        res.json({message: "password updated"});
    }catch(err){
        res.status(500).json({message: 'server error'})
    }
})

//add/change profile picture, im gonna try to do it with cloudinary + multer 
router.patch("/profile-picture", protect, async (req: AuthRequest, res):Promise<void> => {
  const { profilePicture } = req.body;

  if (!profilePicture || typeof profilePicture !== "string") {
    res.status(400).json({ message: "Invalid or missing URL" });
    return;
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      message: "Profile picture URL saved",
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error("Error saving profile picture URL:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/addBalance', protect, verifyAndRefreshToken, async(req:AuthRequest, res):Promise<void> =>{
  try{
    const userId = req.user.id;

    const user = await User.findById(userId);

    if(!user){
      res.status(404).json({message: "User not found"});
      return;
    }
    user.balance = (user.balance ?? 0) + 10;
    await user.save();

    res.status(200).json({message: "Balance updated", balance: user.balance})
  }catch(err){
    console.error(err);
    res.status(500).json({message: "Server error"})
  }
})

export default router;