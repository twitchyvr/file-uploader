document.getElementById('uploadButton').addEventListener('click', uploadFiles);

function uploadFiles() {
    let files = document.getElementById('fileInput').files;
    const sasToken = "?sv=2023-01-03&st=2023-12-14T05%3A43%3A10Z&se=2123-12-15T05%3A43%3A00Z&sr=c&sp=racwlf&sig=Dx4U4UBMK%2BqY0kMBQIWpKwbZZRENrpxei4ulu%2F%2Fb9Ic%3D"; // Replace with your SAS token
    const storageAccountUrl = "https://tagpublicfilesupload.blob.core.windows.net/uploadedfiles";

    for (let file of files) {
        let blobUrl = `${storageAccountUrl}/${file.name}?${sasToken}`;
        uploadFileToBlob(file, blobUrl);
    }
}

function uploadFileToBlob(file, blobUrl) {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            updateProgressBar(percentComplete);
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            console.log("File uploaded successfully");
        } else {
            console.error("Upload failed with status: " + xhr.status);
            displayError("Upload failed with status: " + xhr.status);
        }
        resetProgressBar();
    };

    xhr.onerror = function () {
        console.error("Upload failed with status: " + xhr.status);
        displayError("Network error or CORS misconfiguration");
        resetProgressBar();
    };

    xhr.open('PUT', blobUrl, true);
    xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
    xhr.send(file);
}

function updateProgressBar(percent) {
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.style.display = 'block';
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';
}

function resetProgressBar() {
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = '0%';
    progressBar.textContent = '';
    const progressContainer = document.getElementById('progressContainer');
    progressContainer.style.display = 'none';
}

function displayError(message) {
    // Implement UI feedback for errors
    alert(message); // Placeholder, consider a more user-friendly approach
}
