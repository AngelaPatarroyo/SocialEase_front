import mongoose from "mongoose";

const uri = "mongodb+srv://angelamelynrojo:Angel%4086@cluster0.bohugoc.mongodb.net/socialease?retryWrites=true&w=majority";

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connection successful!");
    process.exit(0);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
})();
