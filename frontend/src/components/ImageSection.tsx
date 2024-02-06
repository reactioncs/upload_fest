import "./imageSection.scss";

interface ImageSectionProp {
    file: string;
    onClose: () => void;
}

function ImageSection({ file: url, onClose }: ImageSectionProp) {
    return (
        <div className="image">
            <img src={url} />
            <span onClick={onClose}>&times;</span>
        </div>
    );
}

export default ImageSection;