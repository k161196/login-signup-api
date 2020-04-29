const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistScgema = new Schema({});

const Artist = mongoose.Schema("Artist", artistScgema);
module.exports = Artist;
