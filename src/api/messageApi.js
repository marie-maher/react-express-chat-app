import axios from 'axios'

class MessageApi {

  static fetchRoom(room) {
    return axios.get('/messages', {
      params: {
        room: room
      }
  })
}

  static createRoom(roomData) {
    return axios.post('/rooms', roomData)
  }

  static fetchRoomList(user) {
    return axios.get('/rooms', {
      params: {
        user: user
      }
    })
  }

  static signUp(username) {
    return axios.post('/signUp', username)
  }

  static privateChat(sender, receiver) {
    return axios.get('/privateChat', {
      params: {
        sender: sender,
        receiver: receiver
      }
    })
  }
}


export default MessageApi
