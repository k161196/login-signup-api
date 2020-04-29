const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  category: {
    type: String,
    enum: ["painting"],
    require: true,
  },
  status: {
    type: String,
    enum: ["started", "inProgress", "finish"],
    require: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    require: true,
  },
  managerId: {
    type: Schema.Types.ObjectId,
    ref: "Manager",
  },
  artists: [
    {
      artist: {
        type: Schema.Types.ObjectId,
        ref: "Artist",
      },
    },
  ],
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
