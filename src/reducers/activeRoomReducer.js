import initialState from './initialState'

export default function activeRoomReducer(state = initialState.activeRoom, action) {
  switch (action.type) {
    case 'JOIN_ROOM':
      let title = state.title
      if (action.payload) {
        title = action.payload.room
      }
      return Object.assign({}, state.activeRoom, {
        title: title,
        messages: action.payload.messages
      })
    case 'NEW_MESSAGE':
      return Object.assign({}, action.payload.room, {
        messages: [...action.payload.room.messages, action.payload.newMessage]
      })
    default:
      return state;
  }
}

