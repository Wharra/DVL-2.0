import mongoose from 'mongoose'

const { Schema } = mongoose

const messageSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sender: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  preview: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'info',
  },
  unread: {
    type: Boolean,
    default: true,
  },
  receivedAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
})

export default mongoose.model('Message', messageSchema)
