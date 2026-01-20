import bcrypt from "bcryptjs";
import { User } from "../models/User.js";

// Controller function to handle parent registration
export async function registerParent(req, res) {
    try {
        // Extracts username, email, and password from request body
        const { username, email, password } = req.body;
        // If any field is missing, respond with 400 Bad Request
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All Fields are required" });
        }
        // Existing user check to prevent duplicate registrations
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            // If user with the same email exists, respond with 409 Conflict
            return res.status(409).json({ error: "Email already in use" });
        }
        // Password is hashed using bcrypt with 10 salt rounds for security
        const hashedPassword = await bcrypt.hash(password, 10);
        // New user is created in the database with entered details and the parent role assigned
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            role: "parent",
            password: hashedPassword
        });
        // When successful, respond with 201 Created and user details (excluding password), useful for client-side confirmation
        return res.status(201).json({ 
            message: "Parent registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        // Catch block to handle unexpected errors and respond with 500 Internal Server Error
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Controller function to handle teacher registration
export async function registerTeacher(req, res) {
    try {
        // Extracts username, email, password, and teacherCode from request body
        const { username, email, password, teacherCode } = req.body;
        // If any field is missing, respond with 400 Bad Request
        if (!username || !email || !password || !teacherCode) {
            return res.status(400).json({ error: "All Fields are required" });
        }
        if (teacherCode !== process.env.TEACHER_REGISTRATION_CODE) {
            return res.status(403).json({ error: "Invalid Teacher Code" });
        }
        // Existing user check to prevent duplicate registrations
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        // If user with the same email exists, respond with 409 Conflict
        if (existingUser) {
            return res.status(409).json({ error: "Email already in use" });
        }
        // Password is hashed using bcrypt with 10 salt rounds for security
        const hashedPassword = await bcrypt.hash(password, 10);
        // New user is created in the database with entered details and the teacher role assigned
        const user = await User.create({
            username,
            email: email.toLowerCase(),
            role: "teacher",
            password: hashedPassword
        });
        // When successful, respond with 201 Created and user details (excluding password), useful for client-side confirmation
        return res.status(201).json({ 
            message: "Teacher registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        // Catch block to handle unexpected errors and respond with 500 Internal Server Error
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are required" });
        }
        //+password field is excluded by default in User model for added security, so retrieve it here to be used for password comparison
        const user = await User.findOne({ email:email.toLowerCase() }).select("+password");
        if (!user) {
            // If user not found, respond with 401 Unauthorized
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        // Password comparison with password retieved from DB with the .select above
        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
            // If password does not match, respond with 401 Unauthorized
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        // Set session variables to maintain user authentication state
        req.session.userId = user._id.toString();
        req.session.role = user.role;
        // Successful login response with user details (excluding password) and status 200 OK
        res.status(200).json({ 
            message: "Login successful", 
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        // Catch block to handle unexpected errors and respond with 500 Internal Server Error
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function logout(req, res) {}

export async function me(req, res) {}