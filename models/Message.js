import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
  user: String,
  content: String,
  room: String,
  image: String,
  time: String
})

export default mongoose.model('Message', messageSchema)
