import { useEffect, useState } from "react";
import "./upload.scss"

function Upload() {
    const [queuedImages, setQueuedImages] = useState<File[]>([]);
    const [serverMessage, setServerMessage] = useState("");

    useEffect(() => console.log(queuedImages), [queuedImages]); //debug

    function updateImages(files: FileList) {
        for (let file of files) {
            if (!file.type.match("image")) continue;
            setQueuedImages(images => [...images, file]);
        }
    }

    function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        files && updateImages(files);
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
        sendImagesToServer();
    }

    async function sendImagesToServer() {
        const formData = new FormData();
        queuedImages.forEach(image => formData.append(image.name, image));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}api/upload/`, {
                method: "POST",
                body: formData,
            });
            if (response.status !== 200) throw Error(response.statusText);
        } catch (error) {
            if (typeof error === "string")
                setServerMessage(error);
            else
                setServerMessage(`${typeof error} error occurred.`);
        }
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
                    {queuedImages.map((image, index) => (
                        <div className="image" key={index}>
                            <img src={URL.createObjectURL(image)} />
                            <span onClick={() => deleteQueuedImages(index)}>&times;</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="saved">
                <div className="header">
                    <h2>Images on the server</h2>
                </div>
                <div className="saved-div"></div>
            </div>
        </div>
    );
}

export default Upload;