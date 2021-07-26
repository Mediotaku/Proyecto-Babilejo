const socket = io()

const chat = document.querySelector('.chat-form')
const chatInput = document.querySelector('.chat-input')

chat.addEventListener('submit', e => {
    e.preventDefault()
    // El value se manda aqui a traves del socket
    socket.emit('chat', chatInput.value)
    chatInput.value=''
})

const chatDump = document.querySelector('.chat-dump')

const render = ({message, id}) => {
    const div = document.createElement('div')
    //Cuando se añaden varias clases con classList.add, deben estar separadas por comas
    div.classList.add('chat-message', 'bg-white', 'shadow-md', 'rounded', 'mb-3', 'p-3', 'w-max', 'max-w-sm', 'break-words')
    if (id === socket.id) {
        div.classList.add('chat-message--user', 'bg-green-300', 'self-end')
    }
    div.innerText = message
    chatDump.appendChild(div)
    //Mantener barra de scroll abajo para ver los últimos mensajes
    chatDump.scrollTop = chatDump.scrollHeight;
}

socket.on('chat', data => {
    render(data)
})
