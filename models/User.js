import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
})

export default mongoose.model('User', userSchema)
