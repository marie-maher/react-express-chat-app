import messageApi from '../api/messageApi'

export function addMessage(data) {
  let payload;
  // debugger
  if (!data.newMessage.image) {
    payload = {
      room: data.room, newMessage: {
        user: data.newMessage.user, content: data.newMessage.message
        , time: data.newMessage.time
      }
    }
  } else {
    payload = {
      room: data.room, newMessage: {
        user: data.newMessage.user, image: data.newMessage.image
        , time: data.newMessage.time
      }
    }
  }

  return { type: 'NEW_MESSAGE', payload }
}