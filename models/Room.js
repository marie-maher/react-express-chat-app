import mongoose from 'mongoose'

const roomSchema = mongoose.Schema({
  title: { type: String, unique: true },
  participants: Array,
  private: Boolean
})

export default mongoose.model('Room', roomSchema)
