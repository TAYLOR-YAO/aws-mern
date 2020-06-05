const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articlesSchema = new mongoose.Schema(
    {
      article: {
      type: String,
      required: true
      },
      nomUnique:{
        type:String,
        trim: true,
        required: true,
      },
      slug: {
        type: String,
        lowercase: true,
        unique: true,
        index: true
    },
      adresse: {
        type: String,
        required: true
      },
      descriptions: {
        type: {},
        min: 20,
        max: 2000000
      },
      images:{
        type: []
      },
      dealeur: {
        type: String,
        required: true
      },
      quartier: {
        type: String,
        required: true
      }
      ,
      prix: {
        type: String,
        required: true
      },
      region: {
        type: String,
        required: true
      },
      ville: {
        type: String,
        required: true
      },
      categorie: {
        type: String,
        required: true
      },
      rapportSocial: {
        type: String,
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      deal: {
        type: String,
        required: true
      },
      documentNecessaire: {
        type: []
      },
      postePar:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model('Houses', articlesSchema);