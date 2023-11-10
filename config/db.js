import mongoose from "mongoose";
import colors from "colors";
const connectDB = async () => {
 try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`Connected to Mongo Database`.bgMagenta.white);
 } catch (error) {
    console.log("Error while connecting to database".bgRed.white);
 }
}
export default connectDB;