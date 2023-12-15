// Función para rotar la imagen en incrementos de 90 grados
function rotateImage(event) {
    const object = event.target;
    const currentRotation = parseFloat(object.getAttribute('data-rotation')) || 0;
    const newRotation = currentRotation + 90;

    object.style.transform = `translate(${object.getAttribute('data-x')}px, ${object.getAttribute('data-y')}px) rotate(${newRotation}deg)`;
    object.setAttribute('data-rotation', newRotation);
}

// Asociar la función rotateImage al evento "dblclick" de los objetos arrastrables
const draggableObjects = document.querySelectorAll('.draggable-object');
draggableObjects.forEach(object => {
    object.addEventListener('dblclick', rotateImage);
});

// Usamos interact.js para hacer los objetos arrastrables
interact('.draggable-object')
    .draggable({
        // enable inertial throwing
        inertia: true,

        modifiers: [
            interact.modifiers.restrictRect({
                restriction: '.board',
                endOnly: true
            })
        ],
        // enable autoScrol
        autoScroll: true,

        listeners: {
            move(event) {
                const target = event.target;
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                const rotation = parseFloat(target.getAttribute('data-rotation')) || 0;

                // Conservar la rotación al mover el objeto
                target.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        }
    });


// Función para restablecer la posición de los objetos arrastrables
function resetDraggableObjects() {
    const draggableObjects = document.querySelectorAll('.draggable-object');

    draggableObjects.forEach(object => {
        object.style.transform = 'translate(0px, 0px)';
        object.setAttribute('data-x', 0);
        object.setAttribute('data-y', 0);
    });
}

// Asociar la función resetDraggableObjects al evento "click" del botón de "reset"
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', resetDraggableObjects);

// Función para guardar la posición de los objetos arrastrables en un archivo y descargarlo
function saveDraggableObjects() {
    const draggableObjects = document.querySelectorAll('.draggable-object');
    const data = [];

    draggableObjects.forEach(object => {
        data.push({
            id: object.id,
            x: parseFloat(object.getAttribute('data-x')) || 0,
            y: parseFloat(object.getAttribute('data-y')) || 0,
            rotation: parseFloat(object.getAttribute('data-rotation')) || 0
        });
    });

    const dataString = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataString);
    const exportFileDefaultName = 'data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}
// Asociar la función saveDraggableObjects al evento "click" del botón de "guardar"
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', saveDraggableObjects);

function loadDraggableObjects(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const fileReader = new FileReader();

    fileReader.onload = function (fileLoadedEvent) {
        const data = JSON.parse(fileLoadedEvent.target.result);

        data.forEach(item => {
            const object = document.getElementById(item.id);

            if (object) {
                object.style.transform = `translate(${item.x}px, ${item.y}px) rotate(${item.rotation}deg)`;
                object.setAttribute('data-x', item.x);
                object.setAttribute('data-y', item.y);
                object.setAttribute('data-rotation', item.rotation);
            }
        });
    };

    fileReader.readAsText(file);
}

// Asociar la función loadDraggableObjects al evento "change" del input "load-file"
const loadFileInput = document.getElementById('load-file');
loadFileInput.addEventListener('change', loadDraggableObjects);


function captureBoard() {
    const board = document.querySelector('.board');

    domtoimage.toPng(board)
        .then(function (dataUrl) {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'board_capture.png';
            link.click();
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
}

// Asociar la función printBoard al evento "click" del botón de "Imprimir"
const printButton = document.getElementById('print-button');
printButton.addEventListener('click', captureBoard);