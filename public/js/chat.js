const socket = io()

/*socket.on("countUpdated",(count) => {
    console.log("Count has been updated",count);
})

document.querySelector("#incr").addEventListener("click",() => {
    console.log("Clicked");
    socket.emit("incr");
})*/
const messageform = document.querySelector("#chat-message");
const input = document.querySelector("input");
const button = document.querySelector("#incr");
const locbutton = document.querySelector("#location");
const messages = document.querySelector("#messages");
const messagetemplate = document.querySelector("#message-template").innerHTML;
const locmessagetemplate = document.querySelector("#locmessage-template").innerHTML;
const sidetemplate = document.querySelector("#sidebar-template").innerHTML;
const{ username, room } = Qs.parse(location.search,{ignoreQueryPrefix:true})


const autoscroll = () => {
const newmess = messages.lastElementChild;
const messagestyle = getComputedStyle(newmess);
const margin = parseInt(messagestyle.marginBottom);
const height = newmess.offsetHeight + margin;

const visibleheight = messages.offsetHeight;
const containerheight = messages.scrollHeight;
const scrollOffset = messages.scrollTop + visibleheight
if(containerheight - height <= scrollOffset)
{
    messages.scrollTop = messages.scrollHeight
}
}

socket.on("message",(message) => {
    console.log(message);
    const html = Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format("h:mm A")
    });
    messages.insertAdjacentHTML("beforeend",html);
    autoscroll();
    
    
})

socket.on("locationmessage",(url) => {
    console.log(url);
    const html1 = Mustache.render(locmessagetemplate,{
        username:url.username,
        url:url.text,
        createdAt:moment(url.createdAt).format("h:mm A")
    });
    messages.insertAdjacentHTML("beforeend",html1);
    autoscroll();
})

socket.on("roomdet",({room,users}) => {
    
    const html2 = Mustache.render(sidetemplate,{
        room,
        users
    });
    document.querySelector("#sidebar").innerHTML = html2;
    
})

messageform.addEventListener("submit",(e) => {
    e.preventDefault();
    button.setAttribute("disabled","disabled");
    const mes = document.getElementById("message").value;
    socket.emit("mess",mes,(error) => {
        button.removeAttribute("disabled");
        input.value = "";
        input.focus();
        if(error)
        {
        console.log(error);
        }
        else
        {
            console.log("Message is delivered");
        }
    })
})

document.getElementById("location").addEventListener("click",() => {
    if(!navigator.geolocation)
    {
        return alert("Can't find location");
    }
    locbutton.setAttribute("disabled","disabled");
    navigator.geolocation.getCurrentPosition((position) => {
           
           socket.emit("location",{
               latitude:position.coords.latitude,
               longitude:position.coords.longitude
           },() => {
               console.log("Location sent successfully");
               locbutton.removeAttribute("disabled");
           })
    })
})

socket.emit("join",{username,room},(error) => {
    if(error)
    {
        alert(error)
        location.herf = "/";
    }
});