import messageApi from '../api/messageApi';

export function newUser(username) {
  return (dispatch) => {
    const newUser = { username: username }
    return messageApi.signUp(newUser)
      .then((response) => {
        dispatch(signUp(response))
      })
    return response
  }
}

export function signUp(payload) {
  return { type: 'NEW_USER', payload }
}
