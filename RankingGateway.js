
'use strict'
const http = require('http');
const fs = require("fs");
const server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var output = fs.readFileSync("./index.html", "utf-8");
    res.end(output);
}).listen(37564);
const io = require("socket.io").listen(server);

let users = {};     // 接続中ユーザ
let topics = {};    // 現在購読されているトピック

// ユーザイベント用リスナ
io.sockets.on("connection", (socket) => {

    // ユーザ情報更新
    socket.on("user_data_update", (userData) => {
        console.log("user_data_update");
        console.log(userData);

        users[socket.id] = userData;

        // topicに購読ユーザ追加
        const topic = userData.topic;
        if (topic) {
            if (!topics[topic]) {
                topics[topic] = {};
            }

            topics[topic][socket.id] = userData;
        }
    });

    // 接続終了
    socket.on("disconnect", (socket) => {
        if (users[socket.id]) {
            userData = users[socket.id];

            // 購読中トピックから接続終了したユーザ情報を削除
            if (topics[userData.topic]) {
                if (topics[topic][socket.id]) {
                    delete topics[topic][socket.id];
                }
            }

            // 接続中ユーザからユーザ削除
            delete users[socket.id];
        }
    });
});


// トピック毎のユーザにaccデータをプッシュ
const pushAcc = (topicName) => {
    let url = "http://acchub.net:8080/" + topicName;
    console.log("getAccData: " + url);

    // トピックのaccデータを取得
    http.get(url, (res) => {
        let body = '';
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            body += chunk;
        });

        res.on('end', (res) => {
            let accData = JSON.parse(body);
            io.sockets.emit("ranking_update", accData);

            // topic購読ユーザーのみにpush
            Object.keys(topics[topicName]).forEach((socketId)=> {
                io.to(socketId).emit("ranking_update", accData);
            });
        });
    }).on('error', (e) => {
        console.log(e.message); //エラー時
    });
}

// 順位サーバーへのポーリング、ユーザへの通知
setInterval(() => {
    Object.keys(topics).forEach((topicName) => {
        pushAcc(topicName);
    })
}, 1000);

