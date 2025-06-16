let rooms = [];
let users = [];

export function socketEvents(socket) {
    //console.log("Usuario conectado");
    //console.log(socket.id);
    //console.log(socket)
    //crear sala
    socket.on("create", (body) => {
        if (users.indexOf(socket.id) < 0) {
            if (rooms.indexOf(body.sala) < 0) {
                socket.join(body.sala);
                socket.room = body.sala;
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
        //console.log(users);
        //console.log(rooms);
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
        console.log(users);
        console.log(rooms);
    });

    //finalizar sesion
    socket.on("finnish", (body) => {
        socket.leave(body.sala);
        rooms.splice(rooms.indexOf(body.sala));
        //console.log(rooms);
    });

    socket.on("answer", (data) => {

    });

    //mensajes
    socket.on("message", (body) => {
        socket.broadcast.emit("message", {
            body: body.body,
            from: body.from
        });
    });

    socket.on("timer", (body) => {
        console.log(body);
        socket.to(socket.room).emit("timer", { time: body.time })
    })

    //desconexion
    socket.on('disconnect', (reason) => {
        //console.log(socket.id);
        console.log("Usuario desconectado");
        //console.log(reason);
        users.splice(users.indexOf(socket.id));
        // console.log(users);
    })
}