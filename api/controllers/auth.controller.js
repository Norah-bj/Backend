import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {

    //Hash password

    const hashedPassword =  await bcrypt.hash(password, 10);

    //create a new user and save it to the database

    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    // console.log("BODY: ", req.body);
    // console.log("HASHED PASSWORD: ", hashedPassword);

    console.log(newUser);

    res.status(201).json({
        message: "User created successfully",
        user: newUser,
    });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "User creation failed",
            error: error.message,
        });
    }
    // res.send("Registration successful!");
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        //check if user exists
        const user = await prisma.user.findUnique({
            where: {username},
        });

        if (!user) {
            console.log("User not found");
            
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        //check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            console.log("Password is incorrect");
            
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        console.log("Login successful");

        //generate a token and send it to the user

        res.setHeader("Set-Cookie", "test=" + "myValue")

        res.status(200).json({
            message: "Login successful",
            user: user,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Login failed",
            error: err.message,
    });
   }
};

export const logout = (req, res) => {
    res.send("Logout successful!");
};