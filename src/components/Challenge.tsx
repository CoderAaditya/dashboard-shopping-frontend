import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Text,
  Input,
  VStack,
  Box,
  HStack,
  List,
  ListItem,
  Tooltip,
  useDisclosure,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Container,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { Edit, Trash, Plus, Clipboard } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchDomains,
  addDomain,
  deleteDomain,
  updateDomain,
  isDomainAvailable,
  deleteAllDomains,
} from "../store/domainSlice";
import EditDomainModal from "./EditDomainModal";
import DeleteDomainAlert from "./DeleteDomainAlert";
import { debounce } from "lodash";

const Challenge: React.FC = () => {
  const [domainInput, setDomainInput] = useState("");
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const [newDomainName, setNewDomainName] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [domainError, setDomainError] = useState(false);
  const [invalidDomainError, setInvalidDomainError] = useState(false);
  const [maxDomainsError, setMaxDomainsError] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { domains } = useSelector((state: RootState) => state.domains);
  const numDomainsRequired = 5;
  const cancelRef = useRef<HTMLButtonElement>(null!);
  const canPurchase = domains.length === numDomainsRequired;

  useEffect(() => {
    dispatch(fetchDomains());
  }, [dispatch]);

  useEffect(() => {
    setMaxDomainsError(domains.length >= numDomainsRequired);
  }, [domains]);

  //Debounce for checking domain availability - 
  const debouncedCheck = useRef(
    debounce(async (value: string) => {
      const response = await dispatch(isDomainAvailable(value)).unwrap();
      setDomainError(response.available);
    }, 500)
  ).current;

  //Domain validation function
  const validateDomain = (domain: string) => {
    const domainRegex =
      /^(?!https?:\/\/)(?!www\.)[a-zA-Z0-9-]+\.(com|xyz|app)$/i;
    return domainRegex.test(domain);
  };

  //Domain Input Change handeling function 
  const handleDomainInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainError(false);
    setInvalidDomainError(false);
    setDomainInput(e.target.value);
    if (!validateDomain(e.target.value)) {
      setInvalidDomainError(true);
      return;
    }
    setInvalidDomainError(false);
    debouncedCheck(e.target.value);
  };

  //Add Domain handeling function
  const handleAddDomain = async () => {
    if (domainInput.trim() && !domainError && !maxDomainsError) {
      await dispatch(addDomain(domainInput));
      dispatch(fetchDomains());
      setDomainInput("");
      toast({ title: "Domain added", status: "success", duration: 2000 });
    }
  };

  //Open Model function fro edit - 
  const handleEditDomain = (domain: string) => {
    setEditingDomain(domain);
    setNewDomainName(domain);
    onOpen();
  };

  //Update domain name fucntion and API call
  const handleUpdateDomain = async () => {
    if (
      editingDomain &&
      newDomainName.trim() &&
      editingDomain !== newDomainName
    ) {
      await dispatch(
        updateDomain({ oldDomain: editingDomain, newDomain: newDomainName })
      );
      dispatch(fetchDomains());
      toast({ title: "Domain Updated", status: "success", duration: 2000 });
      onClose();
    }
  };

  //Delete Domain COnfirm function
  const confirmDeleteDomain = (domain: string) => {
    setSelectedDomain(domain);
    openDeleteDialog();
  };

  //Delete domain name fucntion and API call
  const handleDeleteDomain = async () => {
    if (selectedDomain) {
      await dispatch(deleteDomain(selectedDomain));
      dispatch(fetchDomains());
      closeDeleteDialog();
      toast({ title: "Domain deleted", status: "error", duration: 2000 });
    }
  };

  //Clear Cart function by Clearing all domains in DB
  const handleClearCart = async () => {
    await dispatch(deleteAllDomains()).unwrap();
    dispatch(fetchDomains());
    toast({ title: "All domains cleared", status: "info", duration: 2000 });
  };

  //Copy Domains to clipboard function
  const handleCopyDomains = () => {
    const domainList = domains.map((domain) => domain.name).join(", ");
    navigator.clipboard.writeText(domainList).then(() => {
      toast({
        title: "Domains copied to clipboard",
        status: "success",
        duration: 2000,
      });
    });
  };

  return (
    <Container
      maxW={{ base: "90%", md: "800px" }}
      mt={10}
      p={6}
      boxShadow="lg"
      borderRadius="lg"
      bg="gray.50"
    >
      <Heading size="lg" textAlign="center" mb={4} color="teal.600">
        {" "}
        Domain Management Dashboard
      </Heading>
      <Divider mb={4} />
      <VStack spacing={4}>
        <FormControl isInvalid={domainError || invalidDomainError}>
          <Input
            placeholder="Enter domain name (example.com)"
            value={domainInput}
            onChange={handleDomainInputChange}
            size="lg"
            borderColor="teal.400" 
            _hover={{ borderColor: "teal.600" }} 
            _focus={{
              borderColor: "teal.600",
              boxShadow: "0 0 0 1px teal.600",
            }} 
          />
          {domainError && (
            <FormErrorMessage>Domain already exists.</FormErrorMessage>
          )}
          {invalidDomainError && (
            <FormErrorMessage>Invalid domain format.</FormErrorMessage>
          )}
        </FormControl>
        <Button
          leftIcon={<Plus />}
          colorScheme="teal"
          onClick={handleAddDomain}
          isDisabled={maxDomainsError || domainError}
          w="full"
          _hover={{ bg: "teal.600" }}
        >
          Add Domain
        </Button>
        {maxDomainsError && (
          <Text color="red.500">
            You must delete a domain before adding a new one.
          </Text>
        )}
        <HStack spacing={4} w="full">
          <Button
            colorScheme="red"
            onClick={handleClearCart}
            isDisabled={domains.length === 0}
            w="full"
            _hover={{ bg: "red.600" }}
          >
            Clear Cart
          </Button>
          <Button
            leftIcon={<Clipboard />}
            colorScheme="teal"
            onClick={handleCopyDomains}
            isDisabled={domains.length === 0}
            w="full"
            _hover={{ bg: "teal.600" }} 
          >
            Copy Domains
          </Button>
        </HStack>
      </VStack>
      <Box mt={5} p={4} borderRadius="lg" boxShadow="md" bg="white">
        <Text fontWeight="bold" mb={2} color="teal.600">
          {" "}
          Domains:
        </Text>
        <List spacing={3}>
          {domains.map((domain, index) => (
            <ListItem
              key={index}
              p={2}
              borderRadius="md"
              bg="gray.100" 
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              boxShadow="sm"
              _hover={{ bg: "gray.200" }}
            >
              <Text color="teal.700">{domain.name}</Text>{" "}
              <HStack>
                <Tooltip label="Edit" hasArrow>
                  <IconButton
                    aria-label="Edit Domain"
                    icon={<Edit />}
                    colorScheme="yellow"
                    onClick={() => handleEditDomain(domain.name)}
                  />
                </Tooltip>
                <Tooltip label="Delete" hasArrow>
                  <IconButton
                    aria-label="Delete Domain"
                    icon={<Trash />}
                    colorScheme="red"
                    onClick={() => confirmDeleteDomain(domain.name)}
                  />
                </Tooltip>
              </HStack>
            </ListItem>
          ))}
        </List>
      </Box>
      <Button
        colorScheme="green"
        onClick={() =>
          toast({
            title: "Domains purchased!",
            status: "success",
            duration: 2000,
          })
        }
        isDisabled={!canPurchase}
        w="full"
        _hover={{ bg: "green.600" }}
      >
        Purchase Domains
      </Button>
      <EditDomainModal
        isOpen={isOpen}
        onClose={onClose}
        newDomainName={newDomainName}
        setNewDomainName={setNewDomainName}
        handleUpdateDomain={handleUpdateDomain}
      />
      <DeleteDomainAlert
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        handleDeleteDomain={handleDeleteDomain}
        cancelRef={cancelRef}
      />
    </Container>
  );
};

export default Challenge;
