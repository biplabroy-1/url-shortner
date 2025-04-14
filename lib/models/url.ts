import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userId: {
    type: String,
    required: false,
    trim: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null, index: { expires: 0 } } // TTL index
});

const Url = mongoose.models.Url || mongoose.model('Url', urlSchema);

export default Url;