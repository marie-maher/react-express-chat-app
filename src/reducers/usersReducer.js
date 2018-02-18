export default function user(state = '', action) {
  switch (action.type) {
    case 'NEW_USER':
      return action.payload.data.username || state
    default:
      return state
  }
}
