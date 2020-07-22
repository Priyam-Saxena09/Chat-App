const users = [];

const adduser = ({id,username,room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    if(!username || !room)
    {
        return{
            error:"Username and room are required"
        }
    }

    const exist = users.find((user) => {
        return user.room === room && user.username === username;
    })

    if(exist)
    {
        return{
            error:"User already online"
        }
    }

    const user = {id,username,room};
    users.push(user);
    return {user};
}

const removeuser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1)
    {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    const user = users.find((use) => {
        return use.id === id;
    })

    if(!user)
    {
        return undefined;
    }
    else
    {
        return user;
    }
}

const getUserinRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => 
        user.room === room
    )
}

module.exports = {
    adduser,
    removeuser,
    getUser,
    getUserinRoom
}