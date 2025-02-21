import React from "react";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";

interface DeleteDomainAlertProps {
  isOpen: boolean;
  onClose: () => void;
  handleDeleteDomain: () => void;
  cancelRef: React.RefObject<HTMLButtonElement>;
}

const DeleteDomainAlert: React.FC<DeleteDomainAlertProps> = ({
  isOpen,
  onClose,
  handleDeleteDomain,
  cancelRef,
}) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Delete Domain</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure to delete this Domain?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteDomain} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteDomainAlert;
