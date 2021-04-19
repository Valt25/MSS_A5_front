let socket;
const host = 'http://localhost:5000';

function connect() {
    if (socket) {
        socket.disconnect();
    }

    socket = io(host);

    socket.on('connect', function () {
        alert('connected')
    });

    socket.on('document', msg => {
        const newDocumentDiv = document.createElement('div');
        newDocumentDiv.id = msg.id;
        newDocumentDiv.textContent = msg.id;
        newDocumentDiv.addEventListener('click', () => selectDocumentForEditing(msg.id));
        document.getElementById('documents').appendChild(newDocumentDiv);
    })

    socket.on('edit', msg => {
        const currentDocumentId = document.getElementById('active-document-status').textContent;
        if (currentDocumentId === msg.id) {
            document.getElementById('active-document-content').value = msg.content;
        }
    });
}

function selectDocumentForEditing(documentId) {
    fetch(`${host}/document/${documentId}`)
        .then(res => res.json())
        .then(fetchedDocument => {
            document.getElementById('active-document-status').textContent = fetchedDocument.id;
            const textarea = document.getElementById('active-document-content');
            textarea.value = fetchedDocument.content;
            textarea.addEventListener('input', event => onLocalDocumentChange(documentId, event.target.value))
        });
}

function onLocalDocumentChange(documentId, newContent) {
    socket.emit('edit', `${documentId}`, `${newContent}`)
}

// Start callback
document.getElementById('start-button').addEventListener('click', () => {
    connect();
});

// Create callback
document.getElementById('create-button').addEventListener('click', () => {
    socket.emit('create', '');
});
