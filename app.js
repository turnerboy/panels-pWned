document.addEventListener('DOMContentLoaded', async () => {
    const imageGrid = document.getElementById('image-grid');

    // Fetch data from the API
    const images = await fetchImages();

    // Populate the grid with image cards
    images.forEach(image => {
        const card = document.createElement('div');
        card.className = 'card';

        const imgElement = document.createElement('img');
        imgElement.src = image.previewUrl; // Low-res image for preview
        imgElement.alt = 'Wallpaper';
        imgElement.style.width = '100%';
        imgElement.style.height = 'auto';
        imgElement.addEventListener('click', () => downloadImage(image.dhd)); // Download high-res on click

        const downloadButton = document.createElement('button');
        downloadButton.className = 'download-button';
        downloadButton.innerHTML = '<i class="fas fa-download"></i> Download';
        downloadButton.addEventListener('click', () => downloadImage(image.dhd));

        card.appendChild(imgElement);
        card.appendChild(downloadButton);
        imageGrid.appendChild(card);
    });

    // Download all images as zip when the button is clicked
    document.getElementById('download-all').addEventListener('click', downloadAllImages);
});

// Fetch images from API
async function fetchImages() {
    try {
        const response = await fetch('https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s');
        const data = await response.json();
        return Object.values(data.data).map(item => ({
            previewUrl: item['preview'] || 'default-preview-url.jpg', // Assuming 'preview' key exists
            dhd: item['dhd'] // High-res download URL
        }));
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

// Download an individual image
function downloadImage(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg'; // Customize filename as needed
    link.click();
}

// Download all images
async function downloadAllImages() {
    const zip = new JSZip(); // Use JSZip library for creating zip files
    const images = await fetchImages();

    images.forEach(image => {
        const filename = image.dhd.split('/').pop(); // Extract filename
        zip.file(filename, fetch(image.dhd).then(res => res.blob())); // Add each image to the zip
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'wallpapers.zip';
        link.click();
    });
}
