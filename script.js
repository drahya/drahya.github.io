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
// Lightbox functionality
document.querySelectorAll('.gallery-img').forEach((img) => {
    img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';

        const enlargedImg = document.createElement('img');
        enlargedImg.src = img.src;
        enlargedImg.style.maxWidth = '90%';
        enlargedImg.style.maxHeight = '90%';
        enlargedImg.style.borderRadius = '8px';

        overlay.appendChild(enlargedImg);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    });
});
