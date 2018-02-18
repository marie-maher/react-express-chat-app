import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import * as messageActions from '../../actions/messagesActions'
import * as roomActions from '../../actions/roomActions'
import { bindActionCreators } from 'redux'
import ChatRoom from '../ChatRoom'
import FileUploader from '../FileUploader'
import moment from 'moment'
import { Image, Glyphicon, InputGroup, PageHeader, Col, Button, FormGroup, FormControl } from 'react-bootstrap'


class ChatContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      input: '',
      imagePreviewUrl: '',
      messages: props.messages,
      connected: false,
      scrollToBottom: false
    }

    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnSubmit = this.handleOnSubmit.bind(this)
    this._handleMessageEvent = this._handleMessageEvent.bind(this)
    this._handleFileUpload = this._handleFileUpload.bind(this)
    this.handleClickOnUser = this.handleClickOnUser.bind(this)
    this._init = this._init.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }


  componentWillMount() {
    this._init()
  }

  scrollToBottom() {
    ReactDOM.findDOMNode(this.refs.messagesEnd).scrollIntoView();
  }

  componentDidMount() {
    this._handleFileUpload()
    this._handleMessageEvent()
  }

  handleOnChange(ev) {
    this.setState({ input: ev.target.value })
  }

  handleOnSubmit(ev) {
    ev.preventDefault()
    socket.emit('chat message', {
      message: this.state.input, room: this.props.room.title,
      user: this.props.user, time: moment.utc().local().format('lll')
    })
    this.setState({ input: '' })
  }

  _handleMessageEvent() {
    socket.on('chat message', (inboundMessage) => {
      this.props.createMessage({
        room: this.props.room, newMessage: {
          user: JSON.parse(inboundMessage).user, message: JSON.parse(inboundMessage).message
          , time: JSON.parse(inboundMessage).time
        }
      })
      this.scrollToBottom()
    })
  }

  _handleFileUpload() {
    socket.on('file_upload_success', (data) => {
      this.props.createMessage({
        room: this.props.room, newMessage: {
          user: data.user, image: data.file
          , time: data.time
        }
      })
      this.scrollToBottom()
    })
  }

  _init() {
    if (!(this.state.connected)) {
      this.props.fetchRoom(this.props.room.title)
      socket.emit('subscribe', { room: this.props.room.title })
      this.setState({ connected: true })
    }
  }

  handleClickOnUser(user) {
    const sender = this.props.user
    const receiver = user
    if (sender == receiver) {
      return
    }
    this.props.privateChat(sender, receiver)
    let title = sender < receiver ? sender + "-" + receiver : receiver + "-" + sender
    socket.emit('subscribe', { room: title })
  }


  render() {

    return (
      <div>
        <PageHeader> Welcome, {this.props.user} </PageHeader>
        <ChatRoom messages={this.props.messages} image={''} room={this.props.room} handleClickOnUser={this.handleClickOnUser} />
        <div style={{ float: "left", clear: "both" }}
          ref="messagesEnd">
        </div>
        <div style={{ position: 'fixed', bottom: '0px', width: '100%', backgroundColor: '#fff' }}>

          <form>
            <FormGroup>
              <InputGroup>
                <FormControl onChange={this.handleOnChange} value={this.state.input} />
                <InputGroup.Addon >
                  <Glyphicon glyph="music" />
                </InputGroup.Addon>
                <InputGroup.Button>
                  <Button bsStyle="primary" type="submit" onClick={this.handleOnSubmit}> Send </Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </form>
          <FileUploader />
        </div>

      </div>
    )
  }

}

function mapStateToProps(state, ownProps) {
  return { messages: state.activeRoom.messages, room: state.activeRoom, user: state.user }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createMessage: messageActions.addMessage, fetchRoom: roomActions.fetchRoomData,
    privateChat: roomActions.privateChat
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer)
