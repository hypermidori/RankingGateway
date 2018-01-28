
const fs = require("fs");
const server = require("http").createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    var output = fs.readFileSync("./index.html", "utf-8");
    res.end(output);
}).listen(37564);
const io = require("socket.io").listen(server);

let users = {};     // 接続中ユーザ

// ユーザイベント用リスナ
io.sockets.on("connection", (socket) => {

    // ユーザが接続
    socket.on("connected", (userData) => {
        users[socket.id] = userData;
    });

    // 接続終了
    socket.on("disconnect", (socket) => {
        if (users[socket.id]) {
            delete users[socket.id];
        }
    });
});

// テスト用
const rankingInfo = [
    {
        rank: 1,
        name: "Kinoko"
    },
    {
        rank: 2,
        name: "Takenoko"
    },
    {
        rank: 3,
        name: "Kikori"
    }
]

// 順位サーバーへのポーリング、ユーザへの通知
// TODO 現状は固定の値(rankingInfo)
setInterval(() => {
    io.sockets.emit("ranking_update", rankingInfo);
}, 1000);

