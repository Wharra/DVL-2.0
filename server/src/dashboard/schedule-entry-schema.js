import mongoose from 'mongoose'

const { Schema } = mongoose

const scheduleEntrySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  courseCode: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  startsAt: {
    type: Date,
    required: true,
  },
  timeLabel: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

export default mongoose.model('ScheduleEntry', scheduleEntrySchema)
