import messageApi from '../api/messageApi';

export function joinRoom(roomData) {
  const payload = roomData.data
  return { type: 'JOIN_ROOM', payload }
}

export function newRoom(room, user) {
  const newRoom = { title: room, user: user, messages: [] }
  return (dispatch) => {
    return messageApi.createRoom(newRoom)
      .then((response) => {
        dispatch(newRoomSuccess(response))
      })
    return response
  }
}

export function privateChat(sender, receiver) {
  return (dispatch) => {
    return messageApi.privateChat(sender, receiver)
      .then((response) => {
        dispatch(joinRoom(response))
      })
    return response
  }
}

export function newRoomSuccess(payload) {
  return { type: 'NEW_ROOM', payload }
}

export function updateRoomList(payload) {
  return { type: 'UPDATE_ROOM_LIST', payload }
}

export function fetchRoomData(room) {
  return (dispatch) => {
    return messageApi.fetchRoom(room)
      .then((response) => {
        dispatch(joinRoom(response))
      })
    return response
  }

}

export function fetchRoomList(user) {
  return (dispatch) => {
    return messageApi.fetchRoomList(user)
      .then((response) => {
        dispatch(updateRoomList(response))
      })
    return response

  }
}
