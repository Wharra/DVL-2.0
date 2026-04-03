import mongoose from 'mongoose'

const { Schema } = mongoose

const announcementSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    default: 'info',
  },
  publishedAt: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
})

export default mongoose.model('Announcement', announcementSchema)
