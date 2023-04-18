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

interact('.draggable-object')
    .draggable({
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: '.board img',
                endOnly: true
            })
        ],
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