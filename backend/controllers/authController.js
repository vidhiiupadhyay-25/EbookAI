const jwt = require("jsonwebtoken")
const User = require("../models/User")

//helper: generate jwt
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

};

//@desc register new user 
// @route POST /api/auth/register
// @access public
exports.registerUser = async (req,res) => {
    const {name,email,password} = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" })
        }
        
        // check if user exists
        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        //create user
        const user = await User.create({ name,email,password })

        if (user) {
            res.status(201).json({
                message: "User registered successfully",
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data "})
        }
    }catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error "})
    }
};

//@desc login user
// @route POST/api/auth/login
// @access public
exports.loginUser = async (req,res) => {
    const { email,password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password")

        if(user&&(await user.matchPassword(password))) {
            res.json({
                message: "Login successful",
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid credential "});
        }
    }catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error "})
    }
};

// @desc GET current logged in user
// @route GET /api/auth/profile
// @access private
exports.getProfile = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isPro: user.isPro
        });
    }catch (error) {
        res.status(500).json({ message: "Server error "})
    }
};

// @desc update user profile
//@route PUT /api/auth/me
// @access Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }

    } catch (error) {
        console.log(error);   // always log errors while debugging
        res.status(500).json({ message: error.message });
    }
};