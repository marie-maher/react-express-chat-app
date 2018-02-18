import React from 'react'
import { Col, Grid, Row } from 'react-bootstrap'
import RoomMessage from './RoomMessage'
import RoomsContainer from './containers/RoomsContainer'

export default (props) => {
  const messages = props.messages.map((message) => {

    return (<RoomMessage user={message.user} message={message.content} time={message.time} image={message.image || ''}
      handleClickOnUser={props.handleClickOnUser}
      key={message.time+"-"+message.user+"-"+message.content}/>)
  })

  return (
    <div style={{
      wordWrap: 'break-word', margin: '0', overflowY: 'auto', padding: '0',
      paddingBottom: '110px', flexGrow: '1', order: '1', paddingTop: '20px'
    }} >
      <Grid>
        <Row className="show-grid">
          <RoomsContainer/>
          <Col xs={8} xs={8} style={{marginLeft:'10px'}}>
            <div>
              <h2>
                {props.room.title}
              </h2>
            </div>
            <div>
              {messages}
            </div>
          </Col>
        </Row>
      </Grid>

    </div>
  )
}


