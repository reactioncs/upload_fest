import "./imageSection.scss";

interface ImageSectionProp {
    url: string;
    onClose: () => void;
}

function ImageSection({ url: url, onClose }: ImageSectionProp) {
    return (
        <div className="image">
            <img src={url} />
            <span onClick={onClose}>&times;</span>
        </div>
    );
}

export default ImageSection;