import mongoose from "mongoose";

const { Schema } = mongoose;

//User roles to be used in role field enum and to check permissions
const USER_ROLES = ["teacher", "parent", "student"];

//Validation enforced by Mongoose schema below

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            //Ensure email is unique across users
            unique: true,
            //Convert to lowercase for consistency
            lowercase: true,
            //trim whitespace
            trim: true
        },
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        role: {
            type: String,
            //Restrict role to predefined USER_ROLES
            enum: USER_ROLES,
            required: true
        },
        passwordHash: {
            type: String,
            required: true,
            //bcrypt uses long hashes, 20 prevents bad values
            minlength: 20,
            //Added security by excluding password from query results by default
            select: false
        }
    },
    { timestamps: true }
)

//Exports the User model and USER_ROLES list
export const User = mongoose.model("User", userSchema);
export { USER_ROLES };