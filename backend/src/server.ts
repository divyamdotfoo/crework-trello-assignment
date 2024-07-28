import mongoose from "mongoose";
import App from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.port ?? 4000;

async function main() {
  const MONGO = process.env.MONGO_URI!;
  console.log(MONGO);
  await mongoose.connect(MONGO);

  App.listen(PORT, () => {
    console.log("backend is running");
  });
}
try {
  main();
} catch (e) {
  console.log(e);
}
