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
  Divider,
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
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Center,
  Spinner,
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
  const { userInfo } = useSelector((state) => state.auth);
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

  // Form data for new or edited bracket
  const [formData, setFormData] = useState({
    id: Date.now(),
    minAmount: 0,
    maxAmount: 0,
    rate: 0,
  });
console.log(formData)
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
      setFormError("ຄ່າສູງສຸດດຫ້າມສູງກວ່າຄ່າຕໍ່າສຸດ");
      return false;
    }

    // Check for valid rate
    const prevTax = getTaxeis
      .filter((item) => item.maxAmount <= formData.minAmount) /// 10.000.000 <= 10.000.000 true
      .sort((a, b) => b.maxAmount - a.maxAmount)[0]; //  sort
    if (prevTax) {
      if (formData.rate <= prevTax.rate) {
        ///3<10  ຫ້າມຕຳກວ່າ ຕ້ອງສູງກວ່າ
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

  return (
    <Box p={6} borderRadius="lg" boxShadow="md" bg="white">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontFamily="Noto Sans Lao, serif">
          ການຈັດການຖານຄິດໄລ່ອາກອນລາຍໄດ້
        </Heading>
        <Tooltip label="ເພີ່ມຊ່ວງອາກອນໃໝ່">
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={openAddModal}
            size="md"
          >
            ເພີ່ມຊ່ວງອາກອນ
          </Button>
        </Tooltip>
      </Flex>

      {/* Main content */}
      <Card variant="outline" mb={6}>
        <CardHeader bg="gray.50" py={3}>
          <Heading size="md" fontFamily="Noto Sans Lao, serif">
            ຕາຕະລາງອາກອນລາຍໄດ້
          </Heading>
        </CardHeader>
        <CardBody p={0}>
          {loader ? (
            <Flex justify="center" align="center" height="100vh">
              <Center>
                <Spinner size="xl" thickness="4px" speed="0.65s" />
                <Text ml={4} fontSize="lg">
                  ກຳລັງໂຫຼດຂໍ້ມູນ...
                </Text>
              </Center>
            </Flex>
          ) : getTaxeis.length === 0 ? (
            <Alert status="info" variant="subtle">
              <AlertIcon />
              <AlertTitle>ບໍ່ມີຂໍ້ມູນ</AlertTitle>
              <AlertDescription>
                ກະລຸນາເພີ່ມຊ່ວງອາກອນໃໝ່ເພື່ອເລີ່ມຕົ້ນ
              </AlertDescription>
            </Alert>
          ) : (
            <Table variant="simple">
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
                    <Td>
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
          )}
        </CardBody>
      </Card>

      {/* Tax Example Card */}
      {getTaxeis.length > 0 && (
        <Card variant="outline" mb={6}>
          <CardHeader bg="blue.50" py={3}>
            <Heading size="md" fontFamily="Noto Sans Lao, serif">
              <Flex align="center">
                <InfoIcon mr={2} />
                ຕົວຢ່າງການຄິດໄລ່
              </Flex>
            </Heading>
          </CardHeader>
          <CardBody>
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
              <Box flex={1} p={4} borderWidth="1px" borderRadius="md">
                <Heading size="sm" mb={2} fontFamily="Noto Sans Lao, serif">
                  ລາຍໄດ້ 2,000,000 ກີບ
                </Heading>
                <Text>
                  ອາກອນທີ່ຕ້ອງຈ່າຍ: {formatNumber(calculateTaxExample(2000000))}{" "}
                  ກີບ
                </Text>
              </Box>
              <Box flex={1} p={4} borderWidth="1px" borderRadius="md">
                <Heading size="sm" mb={2} fontFamily="Noto Sans Lao, serif">
                  ລາຍໄດ້ 5,000,000 ກີບ
                </Heading>
                <Text>
                  ອາກອນທີ່ຕ້ອງຈ່າຍ: {formatNumber(calculateTaxExample(5000000))}{" "}
                  ກີບ
                </Text>
              </Box>
              <Box flex={1} p={4} borderWidth="1px" borderRadius="md">
                <Heading size="sm" mb={2} fontFamily="Noto Sans Lao, serif">
                  ລາຍໄດ້ 10,000,000 ກີບ
                </Heading>
                <Text>
                  ອາກອນທີ່ຕ້ອງຈ່າຍ:{" "}
                  {formatNumber(calculateTaxExample(10000000))} ກີບ
                </Text>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="Noto Sans Lao, serif">
            {isNewBracketMode ? "ເພີ່ມຊ່ວງອາກອນໃໝ່" : "ແກ້ໄຂຊ່ວງອາກອນ"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                <FormLabel fontFamily="Noto Sans Lao, serif">
                  ຄ່າຕໍ່າສຸດ (ກີບ)
                </FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleInputChange}
                    disabled={isNewBracketMode && getTaxeis.length > 0}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Noto Sans Lao, serif">
                  ຄ່າສູງສຸດ (ກີບ)
                </FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel fontFamily="Noto Sans Lao, serif">
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
                  />
                  <InputLeftAddon children="%" />
                </InputGroup>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              ຍົກເລີກ
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              {isNewBracketMode ? "ເພີ່ມ" : "ບັນທຶກການປ່ຽນແປງ"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="Noto Sans Lao, serif">
            ຢືນຢັນການລົບ
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" variant="subtle" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle mb={1} fontFamily="Noto Sans Lao, serif">
                  ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລົບຊ່ວງອາກອນນີ້?
                </AlertTitle>
                <AlertDescription fontFamily="Noto Sans Lao, serif">
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

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onDeleteClose}>
              ຍົກເລີກ
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              ລົບ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TaxIncomeEm;
