const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main().then(() => {
    console.log("connected DB");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({...obj, owner: "676e904ab74fe45f9986b6e7"}));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    } finally {
        mongoose.connection.close();
    }
};

initDB();