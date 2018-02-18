import React from 'react'
import { Col, Alert, Panel, Image } from 'react-bootstrap'

export default class RoomMessage extends React.Component {
  handleOnClick(user) {
    this.props.handleClickOnUser(user);
  }
  render() {
    const currentMessage = this.props;
    let imageView;
    if (currentMessage.image) {
      imageView = (
        <div>
          <Col xs={6} md={4}>
            <img className="image-rounded" src={currentMessage.image} style={{maxWidth:'300px'}}/>
          </Col>
        </div>
      )
    }
    return (
      <div>
        <Panel bsStyle="info">
          <span>
            <b style={{ color: '#66c' }}>
              <button style={{
                background: 'Transparent', backgroundRepeat: 'noRepeat',
                border: 'none', cursor: 'pointer', overflow: 'hidden', outline: 'none', color: '#66c'
              }}
                onClick={this.handleOnClick.bind(this, currentMessage.user)}>{currentMessage.user}</button></b>
            <i style={{ color: '#aad', opacity: '0.8' }}>{currentMessage.time}</i>
          </span>
          <div style={{ clear: 'both', paddingTop: '0.1em', marginTop: '-1px', paddingBottom: '0.3em' }}>
            {currentMessage.message}
            {imageView || ''}
          </div>
        </Panel>

      </div>
    )
  }
}
