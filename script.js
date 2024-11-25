const projects = [
    {
        images: ["project2", "project1-2.jpg", "project1-3.jpg"],
        captions: ["Image 1 caption", "Image 2 caption", "Image 3 caption"]
    },
    {
        images: ["project2-1.jpg", "project2-2.jpg"],
        captions: ["First image caption", "Second image caption"]
    }
];

let currentProject = 0;
let currentImageIndex = 0;

function openLightbox(projectIndex) {
    currentProject = projectIndex;
    currentImageIndex = 0;
    updateLightbox();
    document.getElementById('lightbox').style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

function changeImage(direction) {
    currentImageIndex += direction;
    const project = projects[currentProject];
    if (currentImageIndex < 0) currentImageIndex = project.images.length - 1;
    if (currentImageIndex >= project.images.length) currentImageIndex = 0;
    updateLightbox();
}

function updateLightbox() {
    const project = projects[currentProject];
    document.getElementById('lightbox-image').src = project.images[currentImageIndex];
    document.getElementById('lightbox-caption').textContent = project.captions[currentImageIndex];
}
