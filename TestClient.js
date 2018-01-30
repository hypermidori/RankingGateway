const io = require('socket.io-client')

const socket = io(
    'http://localhost:37564',
    {autoConnect: false}
);
socket.on("ranking_update",(rankingInfo)=>{
    console.log("incoming ranking_update:");
    console.log(rankingInfo);
    console.log("\n");
});

socket.on("connect", ()=>{
    console.log("connect");
    const userData = {
        "name":"testUser",
        "topic":"testTopic"
    }
    socket.emit("user_data_update", userData);
});

socket.open();

