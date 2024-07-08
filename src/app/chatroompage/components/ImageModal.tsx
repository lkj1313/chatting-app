import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ImageModalProps {
  show: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ show, imageUrl, onClose }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Body>
        {imageUrl && (
          <img src={imageUrl} alt="Modal" style={{ width: "100%" }} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;
