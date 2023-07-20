import mongoose from "mongoose"

const counterSchema = new mongoose.Schema({
  day: {
    type: Date,
    required: true,
  },
  saves: {
    type: Number,
    default: 0,
  },
})

const BardSaves = mongoose.model("BardSaves", counterSchema)
export default BardSaves
