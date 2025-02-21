import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Button,
} from "@chakra-ui/react";

interface EditDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  newDomainName: string;
  setNewDomainName: (name: string) => void;
  handleUpdateDomain: () => void;
}

const EditDomainModal: React.FC<EditDomainModalProps> = ({
  isOpen,
  onClose,
  newDomainName,
  setNewDomainName,
  handleUpdateDomain,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Domain</ModalHeader>
        <ModalBody>
          <Input
            placeholder="New domain name"
            value={newDomainName}
            onChange={(e) => setNewDomainName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleUpdateDomain}>
            Save
          </Button>
          <Button onClick={onClose} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditDomainModal;
