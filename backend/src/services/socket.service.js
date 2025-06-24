let rooms = [];
let users = [];

export function socketEvents(socket) {
    console.log("Usuario conectado: ", socket.id);
    socket.on("create", (body) => {
        console.log(body)
        if (users.indexOf(socket.id) < 0) {
            if (rooms.indexOf(body.sala) < 0) {
                socket.join(body.sala);
                socket.room = body.sala;
                socket.host = true;
                //console.log(socket.room);
                rooms.push(body.sala);
                users.push(socket.id);
                socket.emit("message", { sala: body.sala });
                //console.log(rooms);
            } else {
                socket.emit("message", { body: "Ese nombre de sala ya existe" });
                //console.log(rooms);
            }
        } else {
            socket.emit("message", { body: "Ya se encuentra en una sala" });
        }
    });

    //entrar a sala
    socket.on("join", (data) => {
        if (rooms.indexOf(data.sala) > -1) {
            if (users.indexOf(socket.id) < 0) {
                socket.join(data.sala);
                socket.room = data.sala;
                socket.emit("message", data);
                users.push(socket.id);
                socket.to(data.sala).emit("join", { nickname: data.nickname })
            } else {
                socket.emit("message", { body: "ya esta conectado a la sala" });
            }
        } else {
            socket.emit("message", {
                body: "La sala ingresada no existe"
            })
        }
    });

    socket.on("start", (data) => {
        console.log(data);

        socket.to(socket.room).emit("start", data);
    });

    //finalizar sesion
    socket.on("finnish", (body) => {
        socket.to(socket.room).emit("finnish");
        socket.leave(body.sala);
        rooms.splice(rooms.indexOf(body.sala));
        //console.log(rooms);
    });

    socket.on("answer", (data) => {
        socket.to(socket.room).emit("answer", data);
    });

    //reiniciarPizarraIdeas
    socket.on("reiniciar",() =>{
        socket.to(socket.room).emit("reiniciar","¿Confirmas?")
    })


    socket.on("timer", (body) => {
        //console.log(body);
        socket.to(socket.room).emit("timer", { time: body.time })
    })

    //desconexion
    socket.on('disconnect', (reason) => {
        if(socket.host){
            socket.to(socket.room).emit("finnish");
        }
        console.log("Usuario desconectado: ", socket.id);
        users.splice(users.indexOf(socket.id));
    })
}