import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../webpack.config.dev';
import open from 'open';
import favicon from 'serve-favicon';
import socket from 'socket.io'
import { Server } from 'http'
import bodyParser from 'body-parser'
import fs from 'fs'
import mongoose from 'mongoose'
import Message from '../models/Message'
import Room from '../models/Room'
import User from '../models/User'
import { Binary } from 'mongodb'
import serveStatic from 'serve-static'
import imageDecoder from './imageDecoder'


const port = 3000;
const app = express();
const server = Server(app)
const compiler = webpack(config);
const io = socket(server)
const staticPath = path.join(__dirname, '..', '/public')

var room;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(serveStatic(staticPath))

app.get('/messages', (req, res) => {
  Message.find({ room: req.query.room }, (err, docs) => {
    res.json({ room: req.query.room, messages: docs })
  })
})

app.get('/rooms', (req, res) => {
  let user = req.query.user;
  Room.find({ private: false, participants: { $in: [user] } }, (err, docs) => {
    res.json(docs)
  })
})

app.get('/privateChat', (req, res) => {
  let sender = req.query.sender;
  let receiver = req.query.receiver
  let title = sender < receiver ? sender + "-" + receiver : receiver + "-" + sender
  Room.find({ title: title, private: true }, (err, docs) => {
    let privateChatRoom
    if (docs.length == 0) {
      let room = new Room({ title: title, private: true, participants: [sender, receiver] })
      room.save((err) => {
        if (err) return err
      })
      privateChatRoom = room
    } else {
      privateChatRoom = docs[0]

    }
    Message.find({ room: privateChatRoom.title }, (err, docs) => {
      res.json({ room: privateChatRoom.title, messages: docs })
    })
  })
})

app.post('/rooms', (req, res) => {
  Room.find({ title: req.body.title }, (err, docs) => {
    if (docs.length == 0) {
      let room = new Room({ title: req.body.title, private: false, participants: [req.body.user] })
      room.save((err) => {
        if (err) return err
      })
      res.json({ title: room.title, private: false, messages: [] })
    }
    else {
      let room = docs[0]
      if (room.participants.indexOf(req.body.user) === -1) {
        room.participants.push(req.body.user)
        room.save((err) => {
          if (err) return err
        })
        res.json({ title: room.title, private: false, messages: [] })
      }      
    }
  })
})

app.post('/signUp', (req, res) => {
  let user = new User({ username: req.body.username });
  User.find({ username: user.username }, (err, docs) => {
    if (docs.length == 0) {
      user.save((err) => {
        if (err) return err
      })
      const defaultChannel='Default Channel'
      Room.find({title:defaultChannel}, (err, docs) => {
        if (docs.length == 0) {
          let room = new Room({ title: defaultChannel, private: false, participants: [user.username] })
          room.save((err) => {
            if (err) return err
          }) 
        }else{
          let room = docs[0]
           room.participants.push(user.username)
          room.save((err) => {
            if (err) return err
          })
        }
      })
      
      res.json(user)
    } else {
      res.json(docs[0])
    }
  })
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

io.on('connection', function (socket) {
  socket.on('subscribe', (data) => {
    room = data.room
    socket.join(room)
  }
  )
  socket.on('unsubscribe', () => {
    socket.leave(room)
  })

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

  socket.on('chat message', function (msg) {
    let message = new Message({ user: msg.user, content: msg.message, room: msg.room, time: msg.time })
    message.save((err) => {
      if (err) return err
    })

    io.to(msg.room).emit('chat message', JSON.stringify(msg))
  })

  socket.on('file_upload', (data, buffer) => {
    const user = data.user
    const fileName = path.join(__dirname, '../public/images', data.file)
    const tmpFileName = path.join('/images', data.file)
    const imageBuffer = imageDecoder(buffer)
    const time = data.time

    fs.open(fileName, 'a+', (err, fd) => {
      if (err) throw err;

      fs.writeFile(fileName, imageBuffer.data, { encoding: 'base64' }, (err) => {
        fs.close(fd, () => {
          let message = Message({ user: user, room: room, image: tmpFileName, time: time })

          message.save((err) => {
            if (err) return err
          })
        });
      })
    })

    io.to(room).emit('file_upload_success', { file: tmpFileName, user: user, time: time })
  })
});

mongoose.connect('mongodb://localhost:27017/react-chat')
const db = mongoose.connection;

db.once('open', () => {
  server.listen(port, function (err) {
    if (err) {
      console.log(err);
    } else {
      open(`http://localhost:${port}`);
    }
  });
})

