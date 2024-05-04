import mongoose from "mongoose";

const tokySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
],
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Toky",
    },
  ],
});

const Toky = mongoose.models.Toky || mongoose.model("Toky", tokySchema);

export default Toky;