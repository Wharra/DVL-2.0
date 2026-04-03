import mongoose from 'mongoose'

const { Schema } = mongoose

const enrollmentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  urgent: {
    type: Boolean,
    default: false,
  },
  deliverable: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export default mongoose.model('Enrollment', enrollmentSchema)
