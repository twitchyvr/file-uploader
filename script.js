document.getElementById('uploadButton').addEventListener('click', uploadFiles);

function uploadFiles() {
    let files = document.getElementById('fileInput').files;
    const storageAccountUrl = "https://tagpublicfilesupload.blob.core.windows.net/uploadedfiles";

    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        let blobUrl = `${storageAccountUrl}/${file.name}`;
        
        uploadFileToBlob(file, blobUrl);
    }
}

function uploadFileToBlob(file, blobUrl) {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function (e) {
        const percentComplete = (e.loaded / e.total) * 100;
        updateProgressBar(percentComplete);
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log("File uploaded successfully");
        } else {
            console.error("Upload failed: " + xhr.status);
        }
        resetProgressBar();
    };

    xhr.onerror = function () {
        console.error("Upload failed:" + xhr.status);
        resetProgressBar();
    };

    xhr.open('PUT', blobUrl, true);
    xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
    xhr.send(file);
}

function updateProgressBar(percent) {
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('progressBar').style.width = percent + '%';
}

function resetProgressBar() {
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('progressContainer').style.display = 'none';
}
