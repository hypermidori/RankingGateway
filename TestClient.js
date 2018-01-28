const socket = require('socket.io-client')('http://localhost:37564');

socket.on("ranking_update",(rankingInfo)=>{
    console.log("incoming ranking_update:");
    console.log(rankingInfo);
    console.log("\n");
});
