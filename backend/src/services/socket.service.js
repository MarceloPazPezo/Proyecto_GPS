let rooms = [];
let users = [];

export function socketEvents(socket) {
    //console.log("Usuario conectado");
    //console.log(socket.id);
    //console.log(socket)
    //crear sala
    socket.on("create", (body) => {
        if (users.indexOf(socket.id) < 0) {
            if (rooms.indexOf(body.codigo) < 0) {
                socket.join(body.codigo);
                rooms.push(body.codigo);
                users.push(socket.id);
                socket.to(body.codigo).emit("message", { id: body.codigo });
                //console.log(rooms);
            } else {
                socket.emit("message", { body: "Ese nombre de sala ya existe" });
                //console.log(rooms);
            }
        } else {
            socket.emit("message", { body: "Ya se encuentra en una sala" });
        }
        console.log(users);
        console.log(rooms);
    });

    //entrar a sala
    socket.on("join", (data) => {
        if (rooms.indexOf(data.codigo) > -1) {
            if (users.indexOf(socket.id) < 0) {
                socket.join(data.codigo);
                socket.to(data.codigo).emit("message", { id: data.codigo });
                users.push(socket.id);
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
        socket.leave(body.codigo);
    });

    //mensajes
    socket.on("message", (body) => {
        socket.broadcast.emit("message", {
            body: body.body,
            from: body.from
        });
    });

    socket.on("timer",(body)=>{
        console.log(body);
        socket.broadcast.emit("timer",{time:body.time})
    })

    //desconexion
    socket.on('disconnect', (reason) => {
        console.log("Usuario desconectado");
        console.log(reason);
        users.splice(users.indexOf(socket.id));
        console.log(users);
    })
}