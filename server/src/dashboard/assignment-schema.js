import mongoose from 'mongoose'

const { Schema } = mongoose

const assignmentSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    default: 'medium',
  },
  dueAt: {
    type: Date,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
})

export default mongoose.model('Assignment', assignmentSchema)
