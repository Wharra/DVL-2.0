import mongoose from 'mongoose'

const { Schema } = mongoose

const gradeEntrySchema = new Schema({
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
  type: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: null,
  },
  outOf: {
    type: Number,
    required: true,
  },
  coefficient: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    required: true,
  },
  returnedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
})

export default mongoose.model('GradeEntry', gradeEntrySchema)
