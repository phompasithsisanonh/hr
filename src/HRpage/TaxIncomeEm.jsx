import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  IconButton,
  Text,
  useToast,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Flex,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputLeftAddon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Center,
  Spinner,
  Stack,
  SimpleGrid,
  useBreakpointValue,
  Container,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon, InfoIcon } from "@chakra-ui/icons";
import {
  deleteTax,
  getTax,
  messageClear,
  saveTax,
  updateTax,
} from "../store/Reducer/HRReducer/salaryReducer";
import { useDispatch, useSelector } from "react-redux";

const TaxIncomeEm = () => {
  const { errorMessage, successMessage, getTaxeis, loader } = useSelector(
    (state) => state.salary
  );

  const [selectedBracket, setSelectedBracket] = useState(null);
  const [isNewBracketMode, setIsNewBracketMode] = useState(true);
  const [formError, setFormError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const dispatch = useDispatch();
  const toast = useToast();

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const modalSize = useBreakpointValue({ base: "full", md: "lg" });
  const tableSize = useBreakpointValue({ base: "sm", md: "md" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });

  // Form data for new or edited bracket
  const [formData, setFormData] = useState({
    id: Date.now(),
    minAmount: 0,
    maxAmount: 0,
    rate: 0,
  });

  console.log(formData);

  // Handle notifications
  useEffect(() => {
    if (successMessage) {
      toast({
        title: "ສຳເລັດ",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, toast]);

  // Load tax brackets on component mount
  useEffect(() => {
    dispatch(getTax());
  }, [dispatch]);

  // Format number with thousand separator
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rate" ? parseFloat(value) : parseInt(value, 10) || 0,
    });
    setFormError("");
  };

  // Validate tax bracket before saving
  const validateTaxBracket = () => {
    // Check for empty values
    if (formData.minAmount === 0) {
      setFormError("ກະລຸນາປ້ອນຂໍ້ມູນຄ່າຕໍ່າສຸດ");
      return false;
    }
    if (formData.maxAmount === 0) {
      setFormError("ກະລຸນາປ້ອນຂໍ້ມູນຄ່າສູງສຸດ");
      return false;
    }
    // Check for negative values
    if (formData.minAmount < 0 || formData.maxAmount < 0 || formData.rate < 0) {
      setFormError("ຄ່າບໍ່ສາມາດຕິດລົບໄດ້");
      return false;
    }

    // Check if min is greater than max
    if (formData.minAmount >= formData.maxAmount && formData.maxAmount !== 0) {
      setFormError("ຄ່າສູງສຸດຕ້ອງສູງກວ່າຄ່າຕໍ່າສຸດ");
      return false;
    }

    // Check for valid rate
    const prevTax = getTaxeis
      .filter((item) => item.maxAmount <= formData.minAmount)
      .sort((a, b) => b.maxAmount - a.maxAmount)[0];
    if (prevTax) {
      if (formData.rate <= prevTax.rate) {
        setFormError(`ອັດຕາອາກອນໃໝ່ຕ້ອງສູງກວ່າ ${prevTax.rate}`);
        return false;
      }
    }

    return true;
  };

  // Handle save button click
  const handleSave = () => {
    if (validateTaxBracket()) {
      if (isNewBracketMode) {
        // Save new tax bracket
        dispatch(saveTax([formData])).then(() => {
          dispatch(getTax());
          resetForm();
          onClose();
        });
      } else {
        // Update existing tax bracket
        dispatch(updateTax(formData)).then(() => {
          dispatch(getTax());
          resetForm();
          onClose();
        });
      }
    }
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (selectedBracket) {
      dispatch(deleteTax(selectedBracket.id)).then(() => {
        dispatch(getTax());
        onDeleteClose();
      });
    }
  };

  // Reset form to default state
  const resetForm = () => {
    setFormData({
      id: Date.now(),
      minAmount: 0,
      maxAmount: 0,
      rate: 0,
    });
    setFormError("");
  };

  // Open edit modal
  const openEditModal = (bracket) => {
    setIsNewBracketMode(false);
    setSelectedBracket(bracket);
    setFormData({
      id: bracket.id,
      minAmount: bracket.minAmount,
      maxAmount: bracket.maxAmount,
      rate: bracket.rate,
    });
    onOpen();
  };

  // Open add modal
  const openAddModal = () => {
    setIsNewBracketMode(true);
    // Set min amount to max of last bracket if exists
    if (getTaxeis.length > 0) {
      const lastBracket = getTaxeis[getTaxeis.length - 1];
      setFormData({
        id: Date.now(),
        minAmount: lastBracket.maxAmount,
        maxAmount: 0,
        rate: 0,
      });
    }
    onOpen();
  };

  // Open delete confirmation modal
  const openDeleteModal = (bracket) => {
    setSelectedBracket(bracket);
    onDeleteOpen();
  };

  // Calculate tax for a given amount (for demonstration)
  const calculateTaxExample = (amount) => {
    let tax = 0;
    let remainingAmount = amount;

    for (const bracket of getTaxeis) {
      if (remainingAmount <= 0) break;

      const taxableAmount = Math.min(
        remainingAmount,
        bracket.maxAmount - bracket.minAmount
      );

      tax += taxableAmount * (bracket.rate / 100);
      remainingAmount -= taxableAmount;
    }

    return tax;
  };

  // Mobile table row component
  const MobileTableRow = ({ bracket, index }) => (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      mb={3}
      bg="white"
      _hover={{ bg: "gray.50" }}
    >
      <VStack align="stretch" spacing={3}>
        <Flex justify="space-between" align="center">
          <Badge colorScheme="blue" borderRadius="full" px={2}>
            ລະດັບ {index + 1}
          </Badge>
          <HStack spacing={2}>
            <Tooltip label="ແກ້ໄຂ">
              <IconButton
                colorScheme="blue"
                variant="outline"
                size="sm"
                icon={<EditIcon />}
                onClick={() => openEditModal(bracket)}
              />
            </Tooltip>
            <Tooltip label="ລົບ">
              <IconButton
                colorScheme="red"
                variant="outline"
                size="sm"
                icon={<DeleteIcon />}
                onClick={() => openDeleteModal(bracket)}
              />
            </Tooltip>
          </HStack>
        </Flex>
        
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            ຊ່ວງລາຍໄດ້
          </Text>
          <Text fontWeight="medium">
            {formatNumber(bracket.minAmount)} - {formatNumber(bracket.maxAmount)} ກີບ
          </Text>
        </Box>
        
        <Box>
          <Text fontSize="sm" color="gray.600" mb={1}>
            ອັດຕາ
          </Text>
          <Badge colorScheme="green" fontSize="0.9em">
            {bracket.rate}%
          </Badge>
        </Box>
      </VStack>
    </Box>
  );

  return (
    <Container maxW="7xl" px={{ base: 4, md: 6 }}>
      <Box p={{ base: 4, md: 6 }} borderRadius="lg" boxShadow="md" bg="white">
        {/* Header */}
        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          mb={6}
          spacing={4}
        >
          <Heading 
            size={headingSize} 
            fontFamily="Noto Sans Lao, serif"
            textAlign={{ base: "center", md: "left" }}
          >
            ການຈັດການຖານຄິດໄລ່ອາກອນລາຍໄດ້
          </Heading>
          <Tooltip label="ເພີ່ມຊ່ວງອາກອນໃໝ່">
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={openAddModal}
              size={buttonSize}
              width={{ base: "full", md: "auto" }}
            >
              ເພີ່ມຊ່ວງອາກອນ
            </Button>
          </Tooltip>
        </Stack>

        {/* Main content */}
        <Card variant="outline" mb={6}>
          <CardHeader bg="gray.50" py={3}>
            <Heading 
              size={{ base: "sm", md: "md" }} 
              fontFamily="Noto Sans Lao, serif"
              textAlign={{ base: "center", md: "left" }}
            >
              ຕາຕະລາງອາກອນລາຍໄດ້
            </Heading>
          </CardHeader>
          <CardBody p={{ base: 2, md: 4 }}>
            {loader ? (
              <Flex justify="center" align="center" height="200px">
                <Center>
                  <VStack spacing={4}>
                    <Spinner size="xl" thickness="4px" speed="0.65s" />
                    <Text fontSize={{ base: "md", md: "lg" }}>
                      ກຳລັງໂຫຼດຂໍ້ມູນ...
                    </Text>
                  </VStack>
                </Center>
              </Flex>
            ) : getTaxeis.length === 0 ? (
              <Alert status="info" variant="subtle" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle fontFamily="Noto Sans Lao, serif">ບໍ່ມີຂໍ້ມູນ</AlertTitle>
                  <AlertDescription fontFamily="Noto Sans Lao, serif">
                    ກະລຸນາເພີ່ມຊ່ວງອາກອນໃໝ່ເພື່ອເລີ່ມຕົ້ນ
                  </AlertDescription>
                </Box>
              </Alert>
            ) : isMobile ? (
              // Mobile layout with cards
              <VStack spacing={3} align="stretch">
                {getTaxeis.map((bracket, index) => (
                  <MobileTableRow 
                    key={index} 
                    bracket={bracket} 
                    index={index} 
                  />
                ))}
              </VStack>
            ) : (
              // Desktop table layout
              <Box overflowX="auto">
                <Table variant="simple" size={tableSize}>
                  <Thead bg="gray.50">
                    <Tr>
                      <Th fontFamily="Noto Sans Lao, serif" width="10%">
                        ລະດັບ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" width="40%">
                        ຊ່ວງລາຍໄດ້ (ກີບ)
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" width="20%">
                        ອັດຕາ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" width="30%">
                        ຈັດການ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {getTaxeis.map((bracket, index) => (
                      <Tr key={index} _hover={{ bg: "gray.50" }}>
                        <Td>
                          <Badge colorScheme="blue" borderRadius="full" px={2}>
                            {index + 1}
                          </Badge>
                        </Td>
                        <Td fontSize={{ base: "sm", md: "md" }}>
                          {formatNumber(bracket.minAmount)} -{" "}
                          {formatNumber(bracket.maxAmount)}
                        </Td>
                        <Td>
                          <Badge colorScheme="green" fontSize="0.9em">
                            {bracket.rate}%
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Tooltip label="ແກ້ໄຂ">
                              <IconButton
                                colorScheme="blue"
                                variant="outline"
                                size="sm"
                                icon={<EditIcon />}
                                onClick={() => openEditModal(bracket)}
                              />
                            </Tooltip>
                            <Tooltip label="ລົບ">
                              <IconButton
                                colorScheme="red"
                                variant="outline"
                                size="sm"
                                icon={<DeleteIcon />}
                                onClick={() => openDeleteModal(bracket)}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Tax Example Card */}
        {getTaxeis.length > 0 && (
          <Card variant="outline" mb={6}>
            <CardHeader bg="blue.50" py={3}>
              <Heading 
                size={{ base: "sm", md: "md" }} 
                fontFamily="Noto Sans Lao, serif"
                textAlign={{ base: "center", md: "left" }}
              >
                <Flex align="center" justify={{ base: "center", md: "flex-start" }}>
                  <InfoIcon mr={2} />
                  ຕົວຢ່າງການຄິດໄລ່
                </Flex>
              </Heading>
            </CardHeader>
            <CardBody p={{ base: 3, md: 4 }}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
                  <Heading 
                    size="sm" 
                    mb={2} 
                    fontFamily="Noto Sans Lao, serif"
                    textAlign={{ base: "center", md: "left" }}
                  >
                    ລາຍໄດ້ 2,000,000 ກີບ
                  </Heading>
                  <Text 
                    fontSize={{ base: "sm", md: "md" }}
                    textAlign={{ base: "center", md: "left" }}
                  >
                    ອາກອນທີ່ຕ້ອງຈ່າຍ: {formatNumber(calculateTaxExample(2000000))}{" "}
                    ກີບ
                  </Text>
                </Box>
                <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
                  <Heading 
                    size="sm" 
                    mb={2} 
                    fontFamily="Noto Sans Lao, serif"
                    textAlign={{ base: "center", md: "left" }}
                  >
                    ລາຍໄດ້ 5,000,000 ກີບ
                  </Heading>
                  <Text 
                    fontSize={{ base: "sm", md: "md" }}
                    textAlign={{ base: "center", md: "left" }}
                  >
                    ອາກອນທີ່ຕ້ອງຈ່າຍ: {formatNumber(calculateTaxExample(5000000))}{" "}
                    ກີບ
                  </Text>
                </Box>
                <Box p={4} borderWidth="1px" borderRadius="md" bg="white">
                  <Heading 
                    size="sm" 
                    mb={2} 
                    fontFamily="Noto Sans Lao, serif"
                    textAlign={{ base: "center", md: "left" }}
                  >
                    ລາຍໄດ້ 10,000,000 ກີບ
                  </Heading>
                  <Text 
                    fontSize={{ base: "sm", md: "md" }}
                    textAlign={{ base: "center", md: "left" }}
                  >
                    ອາກອນທີ່ຕ້ອງຈ່າຍ:{" "}
                    {formatNumber(calculateTaxExample(10000000))} ກີບ
                  </Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        )}

        {/* Add/Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
          <ModalOverlay />
          <ModalContent mx={{ base: 4, md: 0 }}>
            <ModalHeader fontFamily="Noto Sans Lao, serif" fontSize={{ base: "lg", md: "xl" }}>
              {isNewBracketMode ? "ເພີ່ມຊ່ວງອາກອນໃໝ່" : "ແກ້ໄຂຊ່ວງອາກອນ"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody px={{ base: 4, md: 6 }}>
              {formError && (
                <Alert status="error" mb={4} borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{formError}</AlertDescription>
                  <CloseButton
                    position="absolute"
                    right="8px"
                    top="8px"
                    onClick={() => setFormError("")}
                  />
                </Alert>
              )}

              <VStack spacing={4}>
                <FormControl>
                  <FormLabel fontFamily="Noto Sans Lao, serif" fontSize={{ base: "sm", md: "md" }}>
                    ຄ່າຕໍ່າສຸດ (ກີບ)
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      name="minAmount"
                      value={formData.minAmount}
                      onChange={handleInputChange}
                      disabled={isNewBracketMode && getTaxeis.length > 0}
                      size={{ base: "md", md: "lg" }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel fontFamily="Noto Sans Lao, serif" fontSize={{ base: "sm", md: "md" }}>
                    ຄ່າສູງສຸດ (ກີບ)
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      name="maxAmount"
                      value={formData.maxAmount}
                      onChange={handleInputChange}
                      size={{ base: "md", md: "lg" }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel fontFamily="Noto Sans Lao, serif" fontSize={{ base: "sm", md: "md" }}>
                    ອັດຕາອາກອນ (%)
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleInputChange}
                      step="0.01"
                      max="100"
                      size={{ base: "md", md: "lg" }}
                    />
                    <InputLeftAddon children="%" />
                  </InputGroup>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter px={{ base: 4, md: 6 }}>
              <Stack direction={{ base: "column", md: "row" }} spacing={3} width="full">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  width={{ base: "full", md: "auto" }}
                  order={{ base: 2, md: 1 }}
                >
                  ຍົກເລີກ
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={handleSave}
                  width={{ base: "full", md: "auto" }}
                  order={{ base: 1, md: 2 }}
                >
                  {isNewBracketMode ? "ເພີ່ມ" : "ບັນທຶກການປ່ຽນແປງ"}
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered size={modalSize}>
          <ModalOverlay />
          <ModalContent mx={{ base: 4, md: 0 }}>
            <ModalHeader fontFamily="Noto Sans Lao, serif" fontSize={{ base: "lg", md: "xl" }}>
              ຢືນຢັນການລົບ
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody px={{ base: 4, md: 6 }}>
              <Alert status="warning" variant="subtle" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle mb={1} fontFamily="Noto Sans Lao, serif">
                    ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບຊ່ວງອາກອນນີ້?
                  </AlertTitle>
                  <AlertDescription fontFamily="Noto Sans Lao, serif" fontSize={{ base: "sm", md: "md" }}>
                    {selectedBracket && (
                      <>
                        ຊ່ວງ {formatNumber(selectedBracket.minAmount)} -{" "}
                        {formatNumber(selectedBracket.maxAmount)} ກີບ (ອັດຕາ{" "}
                        {selectedBracket.rate}%)
                      </>
                    )}
                  </AlertDescription>
                </Box>
              </Alert>
            </ModalBody>

            <ModalFooter px={{ base: 4, md: 6 }}>
              <Stack direction={{ base: "column", md: "row" }} spacing={3} width="full">
                <Button 
                  variant="outline" 
                  onClick={onDeleteClose}
                  width={{ base: "full", md: "auto" }}
                  order={{ base: 2, md: 1 }}
                >
                  ຍົກເລີກ
                </Button>
                <Button 
                  colorScheme="red" 
                  onClick={handleDelete}
                  width={{ base: "full", md: "auto" }}
                  order={{ base: 1, md: 2 }}
                >
                  ລົບ
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
};

export default TaxIncomeEm;