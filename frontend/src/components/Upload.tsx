import { useEffect, useState } from "react";
import ImageSection from "./ImageSection";
import "./upload.scss"

interface SavedImage {
    id: string;
    title: string;
    file: string;
    created: string;
}

function Upload() {
    const [queuedImages, setQueuedImages] = useState<File[]>([]);
    const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
    const [serverMessage, setServerMessage] = useState("");

    useEffect(() => {
        loadSavedImage();
    }, []);

    async function loadSavedImage() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/images/`);

            const images: SavedImage[] = await response.json();
            images.forEach(image => image.file = `${import.meta.env.VITE_API_URL}${image.file}`);

            setSavedImages(images);

            if (response.status !== 200)
                throw Error(`${response.status} ${response.statusText}`);
        } catch (error) {
            if (error instanceof Error)
                setServerMessage(error.message);
        }
    }

    function updateImages(files: FileList) {
        for (let file of files) {
            if (!file.type.match("image")) continue;
            setQueuedImages(images => [...images, file]);
        }
    }

    function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        files && updateImages(files);
        e.target.value = "";
    }

    function onFileDrop(e: React.DragEvent<HTMLInputElement>) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        updateImages(files);
    }

    function deleteQueuedImages(id: number) {
        setQueuedImages(images => images.filter((_, index) => index !== id));
    }

    function onClear(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault();
        setQueuedImages([]);
    }

    function onUpload(e: React.FormEvent<HTMLButtonElement>) {
        e.preventDefault();
        uploadImages();
    }

    async function uploadImages() {
        if (queuedImages.length === 0)
            return;

        const settledResult = await Promise.allSettled(queuedImages.map(uploadSingleImage));

        await loadSavedImage();
        setQueuedImages([]);

        const failedCount = settledResult.filter(r => r.status === "rejected").length;
        if (failedCount === 0)
            setServerMessage("");
        else
            setServerMessage(`${failedCount} uploads failed.`);
    }

    async function uploadSingleImage(image: File) {
        const formData = new FormData();
        formData.append("title", image.name)
        formData.append("file", image)

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload/`, {
            method: "POST",
            body: formData,
        });

        if (response.status !== 201)
            throw Error(`${response.status} ${response.statusText}`);
    }

    async function deleteImages(images: SavedImage[]) {
        if (images.length === 0)
            return;

        await Promise.allSettled(images.map(deleteSingleImage));
        
        await loadSavedImage();
        setServerMessage("");
    }

    async function deleteSingleImage(image: SavedImage) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete/${image.id}`, {
            method: "DELETE",
        });
        if (response.status !== 204)
            throw Error(`${response.status} ${response.statusText}`);
    }

    return (
        <div className="upload">
            <div className="header">
                <h2>Upload images</h2>
                <div className="server-message">{serverMessage}</div>
            </div>

            <div className="input-div">
                <p>Drop image here or <span className="browse">Browse</span></p>
                <input
                    type="file" className="file" accept="image/*" multiple
                    onChange={onFileInputChange} onDrop={onFileDrop}
                />
            </div>

            <div className="queued">
                <div className="header">
                    <h2>Queued in frontend</h2>
                    <div className="buttons">
                        <button type="submit" onClick={onClear}>Clear</button>
                        <button type="submit" onClick={onUpload}>Upload</button>
                    </div>
                </div>
                <div className="queued-div">
                    {queuedImages.map((image, index) =>
                        <ImageSection key={index} url={URL.createObjectURL(image)} onClose={() => deleteQueuedImages(index)} />
                    )}
                </div>
            </div>

            <div className="saved">
                <div className="header">
                    <h2>Images on the server</h2>
                    <div className="buttons">
                        <button type="submit" onClick={() => deleteImages(savedImages)}>Delete All</button>
                        <button type="submit" onClick={() => loadSavedImage()}>Refresh</button>
                    </div>
                </div>
                <div className="saved-div">
                    {savedImages.map(image =>
                        <ImageSection key={image.id} url={image.file} onClose={() => deleteImages([image])} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Upload;