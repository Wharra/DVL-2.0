import mongoose from 'mongoose'

const { Schema } = mongoose

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  accent: {
    type: String,
    required: true,
  },
  glow: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

export default mongoose.model('Course', courseSchema)
