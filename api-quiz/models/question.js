const mongoose=require("mongoose");

const questionSchema = new mongoose.Schema({
    category: String,
    island: String,
    question: String,
    options: [String]
});

module.exports = mongoose.model("Question", questionSchema);