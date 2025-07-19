let rooms = [];
let users = [];

export function socketEvents(socket) {
    console.log("Usuario conectado: ", socket.id);
    
    socket.on("create", (body) => {
        //console.log(body)
        if (users.indexOf(socket.id) < 0) {
            if (rooms.indexOf(body.sala) < 0) {
                socket.join(body.sala);
                socket.room = body.sala;
                socket.host = true;
                rooms.push(body.sala);
                users.push(socket.id);
                socket.emit("message", { sala: body.sala });
            } else {
                socket.emit("message", { body: "Ese nombre de sala ya existe" });
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
                socket.to(data.sala).emit("join", { nickname: data.nickname ,socket:socket.id})
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
        socket.to(socket.room).emit("start", data);
    });

    //finalizar sesion
    socket.on("finnish", (body) => {
        socket.to(socket.room).emit("finnish");
        socket.leave(body.sala);
        rooms.splice(rooms.indexOf(body.sala));
        //console.log(rooms);
    });

    socket.on("opt",(data)=>{
        //console.log(data);
        socket.to(socket.room).emit("opt",data);
    });

    socket.on("answer", (data) => {
        socket.to(socket.room).emit("answer", { id:data.id,correcta:data.correcta,socket:socket.id });
    });

    //respuestaIdeas
    socket.on("respuesta",(data)=>{
        socket.to(socket.room).emit("respuesta",data);
    }); 

    //reiniciarPizarraIdeas
    socket.on("reiniciar", () => {
        socket.to(socket.room).emit("reiniciar", "¿Confirmas?")
    })

    //ComenzarEscribirIdeas
    socket.on("comenzar", () => {
        socket.to(socket.room).emit("comenzar", "comenzando")
    })

    socket.on("timer", (body) => {
        //console.log(body);
        socket.to(socket.room).emit("timer", { time: body.time })
    })

    socket.on("requestNotes", () => {
        socket.emit("getNotes");
        console.log("Pide las notas")
    });

    socket.on("updateNotes", (notes) => {
        socket.to(socket.room).emit("syncNotes", notes);
        console.log("Sincronizar todas", notes)
    });

    socket.on("addNote", (note) => {
        socket.to(socket.room).emit("addNote", note);
    });

    socket.on("addNoteWithId", (note) => {
        socket.to(socket.room).emit("addNoteWithId", note);
    });

    socket.on("updateNote", (note) => {
        socket.to(socket.room).emit("updateNote", note);
        console.log("actualizar una nota", note)
    });

    socket.on("deleteNote", (noteId) => {
        socket.to(socket.room).emit("deleteNote", noteId);
        console.log("borrar una nota", noteId);
    });

    socket.on("moveNote", (data) => {
        socket.to(socket.room).emit("moveNote", data);
        console.log("Mover la nota", data)
    });

    socket.on("broadcastNote", (note) => {
        socket.to(socket.room).emit("broadcastNote", note);
    });

    //desconexion
    socket.on('disconnect', (reason) => {
        console.log(reason);
        if (socket.host) {
            socket.to(socket.room).emit("finnish");
            rooms.splice(rooms.indexOf(socket.room));
        }
        console.log("Usuario desconectado: ", socket.id);
        users.splice(users.indexOf(socket.id));
    })
}