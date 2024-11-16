import mongoose from "mongoose";

const uri = "mongodb+srv://neoGStudent:neoGStudent@neog.nxppkiu.mongodb.net/hiropsy?retryWrites=true&w=majority&appName=neoG";


const connectDB = async () => {
    try {
        await mongoose.connect(uri); 
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connectDB;