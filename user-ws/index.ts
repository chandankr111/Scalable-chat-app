import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface Room {
    sockets : WebSocket[]
}

// Records 
const rooms : Record<string , Room> = {};

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data : string) {
    // console.log('received: %s', data);
    const parsedData = JSON.parse(data);
    if(parsedData.type == "join-room"){
      const room = parsedData.room;
      if(!rooms[room]){
        rooms[room] = {
          sockets : []
        }
      } 
      rooms[room].sockets.push(ws);
    }
    if(parsedData.type == "chat" ){
      const room = parsedData.room;
      rooms[room].sockets.map(socket => socket.send(data) )
      console.log(parsedData.message);
    }
  });


});