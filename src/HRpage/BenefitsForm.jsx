import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  Switch,
  Button,
  VStack,
  HStack,
  Heading,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Icon,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import {
  FiUser,
  FiFileText,
  FiTag,
  FiUsers,
  FiDollarSign,
  FiPaperclip,
  FiToggleLeft,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  benifits,
  messageClear,
} from "../store/Reducer/HRReducer/InformationEmplyee";
import toast from "react-hot-toast";

// Custom theme with blue and white primary colors
const theme = extendTheme({
  colors: {
    brand: {
      50: "#ebf8ff",
      100: "#bee3f8",
      500: "#3182ce",
      600: "#2c5aa0",
      700: "#2a69ac",
    },
  },
});

const BenefitsForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { errorMessage, successMessage } = useSelector(
    (state) => state.information
  );
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    benefitName: "",
    amount: 0,
    benefitDescription: "",
    benefitType: "",
    eligibilityConditions: "",
    benefitLimit: "",
    attachedDocument: null,
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({
      ...prev,
      attachedDocument: file,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.benefitName.trim()) {
      newErrors.benefitName = "Benefit name is required";
    }

    if (!formData.benefitDescription.trim()) {
      newErrors.benefitDescription = "Benefit description is required";
    }

    if (!formData.benefitType) {
      newErrors.benefitType = "Please select a benefit type";
    }

    if (!formData.eligibilityConditions.trim()) {
      newErrors.eligibilityConditions = "Eligibility conditions are required";
    }
    if (!formData.amount.trim()) {
      newErrors.amount = "amount are required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onOpen();
    } else {
      toast({
        title: "Form Validation Error",
        description: "Please fill in all required fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      benefitName: "",
      benefitDescription: "",
      benefitType: "",
      eligibilityConditions: "",
      benefitLimit: "",
      attachedDocument: null,
      isActive: true,
    });
    setErrors({});
    toast({
      title: "Form Reset",
      description: "All fields have been cleared",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const confirmSubmission = () => {
    const form = new FormData();
    form.append("name", formData.benefitName);
    form.append("amount", formData.amount);
    form.append("description", formData.benefitDescription);
    form.append("type", formData.benefitType);
    form.append("eligibility", formData.eligibilityConditions);
    form.append("limit", formData.benefitLimit);
    form.append("isActive", formData.isActive);
    form.append("attachedDocument", formData.attachedDocument);

    // Simulate API call
    dispatch(benifits({ formData: form }))
      .then(() => {
        onClose();
        setFormData({
          benefitName: "",
          amount: 0,
          benefitDescription: "",
          benefitType: "",
          eligibilityConditions: "",
          benefitLimit: "",
          attachedDocument: null,
          isActive: true,
        });
        setErrors({});
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };

  const benefitTypes = [
    "Health Insurance",
    "Bonus",
    "Leave",
    "Allowance",
    "Life Insurance",
    "Others",
  ];
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);
  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50" py={8} px={4}>
        <Box maxW="4xl" mx="auto">
          <Card
            shadow="xl"
            borderRadius="2xl"
            bg="white"
            border="1px"
            borderColor="gray.100"
          >
            <CardHeader bg="brand.500" borderTopRadius="2xl" py={6}>
              <Heading
                size="lg"
                color="white"
                 fontFamily="Noto Sans Lao, serif"
                textAlign="center"
                fontWeight="600"
              >
                ຈັດການສິດທິປະໂຫຍດ
              </Heading>
              <Text color="brand.50" textAlign="center" mt={2} fontSize="md">
                ສິດທິປະໂຫຍດໃຫ້ພະນັກງານ
              </Text>
            </CardHeader>

            <CardBody p={8}>
              <Box onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  {/* Benefit Name */}
                  <FormControl isRequired isInvalid={errors.benefitName}>
                    <FormLabel
                      display="flex"
                      alignItems="center"
                      gap={2}
                      fontWeight="600"
                      color="gray.700"
                    >
                      <Icon as={FiUser} color="brand.500" />
                      ຊື່ສິດທິປະໂຫຍດ
                    </FormLabel>
                    <Input
                      value={formData.benefitName}
                      onChange={(e) =>
                        handleInputChange("benefitName", e.target.value)
                      }
                      placeholder="Enter benefit name"
                      size="lg"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px #3182ce",
                      }}
                    />
                    {errors.benefitName && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.benefitName}
                      </Text>
                    )}
                  </FormControl>

                  {/* Benefit Description */}
                  <FormControl isRequired isInvalid={errors.benefitDescription}>
                    <FormLabel
                      display="flex"
                      alignItems="center"
                      gap={2}
                      fontWeight="600"
                      color="gray.700"
                    >
                      <Icon as={FiFileText} color="brand.500" />
                      ລາຍລະອຽດສິດທິ
                    </FormLabel>
                    <Textarea
                      value={formData.benefitDescription}
                      onChange={(e) =>
                        handleInputChange("benefitDescription", e.target.value)
                      }
                      placeholder="Describe the benefit in detail"
                      size="lg"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px #3182ce",
                      }}
                      rows={4}
                      resize="vertical"
                    />
                    {errors.benefitDescription && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.benefitDescription}
                      </Text>
                    )}
                  </FormControl>

                  {/* Benefit Type and Eligibility - Row layout on larger screens */}
                  <Flex direction={{ base: "column", md: "row" }} gap={6}>
                    <FormControl
                      isRequired
                      isInvalid={errors.benefitType}
                      flex="1"
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="600"
                        color="gray.700"
                      >
                        <Icon as={FiTag} color="brand.500" />
                        ປະເພດສິດທິ
                      </FormLabel>
                      <Select
                        value={formData.benefitType}
                        onChange={(e) =>
                          handleInputChange("benefitType", e.target.value)
                        }
                        placeholder="Select benefit type"
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: "brand.400" }}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                      >
                        {benefitTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </Select>
                      {errors.benefitType && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.benefitType}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={errors.eligibilityConditions}
                      flex="1"
                    >
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="600"
                        color="gray.700"
                      >
                        <Icon as={FiUsers} color="brand.500" />
                        ເງື່ອນໄຂໄດ້ຮັບ
                      </FormLabel>
                      <Input
                        value={formData.eligibilityConditions}
                        onChange={(e) =>
                          handleInputChange(
                            "eligibilityConditions",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Full-time employees with 1+ years"
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: "brand.400" }}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                      />
                      {errors.eligibilityConditions && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.eligibilityConditions}
                        </Text>
                      )}
                    </FormControl>
                  </Flex>

                  {/* Benefit Limit and File Upload - Row layout on larger screens */}
                  <Flex direction={{ base: "column", md: "row" }} gap={6}>
                    <FormControl flex="1">
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="600"
                        color="gray.700"
                      >
                        <Icon as={FiDollarSign} color="brand.500" />
                      ຈຳກັດຈຳນວນ (ຖ້າມີ)
                      </FormLabel>
                      <NumberInput
                        value={formData.benefitLimit}
                        onChange={(value) =>
                          handleInputChange("benefitLimit", value)
                        }
                        size="lg"
                      >
                        <NumberInputField
                          placeholder="Enter maximum limit"
                          borderRadius="lg"
                          borderColor="gray.300"
                          _hover={{ borderColor: "brand.400" }}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow: "0 0 0 1px #3182ce",
                          }}
                        />
                      </NumberInput>
                    </FormControl>

                    <FormControl flex="1">
                      <FormLabel
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontWeight="600"
                        color="gray.700"
                      >
                        <Icon as={FiPaperclip} color="brand.500" />
                        ເອກະສານສິດທິ
                      </FormLabel>
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        size="lg"
                        borderRadius="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: "brand.400" }}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                        p={2}
                        accept=".pdf,.doc,.docx,.txt"
                      />
                      {formData.attachedDocument && (
                        <Text fontSize="sm" color="brand.600" mt={1}>
                          Selected: {formData.attachedDocument.name}
                        </Text>
                      )}
                    </FormControl>
                  </Flex>
                  <FormControl flex="1">
                    <FormLabel
                      display="flex"
                      alignItems="center"
                      gap={2}
                      fontWeight="600"
                      color="gray.700"
                    >
                      ຈຳນວນເງິນ
                    </FormLabel>
                    <Input
                      value={formData.amount}
                      name="amount"
                      placeholder="Enter amount"
                      onChange={(e) =>
                        handleInputChange("amount", e.target.value)
                      }
                      type="number"
                      size="lg"
                      borderRadius="lg"
                      borderColor="gray.300"
                      _hover={{ borderColor: "brand.400" }}
                      _focus={{
                        borderColor: "brand.500",
                        boxShadow: "0 0 0 1px #3182ce",
                      }}
                      p={2}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </FormControl>
                  {/* Active Status Toggle */}
                  <FormControl>
                    <FormLabel
                      display="flex"
                      alignItems="center"
                      gap={2}
                      mb={3}
                      fontWeight="600"
                      color="gray.700"
                    >
                      <Icon as={FiToggleLeft} color="brand.500" />
                      ສະຖານະ
                    </FormLabel>
                    <HStack>
                      <Switch
                        isChecked={formData.isActive}
                        onChange={(e) =>
                          handleInputChange("isActive", e.target.checked)
                        }
                        colorScheme="brand"
                        size="lg"
                      />
                      <Text
                        color={formData.isActive ? "green.600" : "red.500"}
                        fontWeight="600"
                      >
                        {formData.isActive ? "Active" : "Inactive"}
                      </Text>
                    </HStack>
                  </FormControl>

                  {/* Action Buttons */}
                  <HStack
                    
                  >
                    <Button
                      type="button"
                      onClick={handleCancel}
                      variant="outline"
                      colorScheme="gray"
                      size="lg"
                      borderRadius="lg"
                      leftIcon={<FiX />}
                      flex={{ base: "1", md: "none" }}
                      minW="100px"
                    >
                      ຍົກເລີກ
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      colorScheme="brand"
                      size="lg"
                     
                      borderRadius="lg"
                      leftIcon={<FiCheck />}
                      flex={{ base: "1", md: "none" }}
                      minW="140px"
                      _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
                    >
                      ບັນທຶກ
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </CardBody>
          </Card>
        </Box>

        {/* Confirmation Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
          <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
          <ModalContent borderRadius="2xl" mx={4}>
            <ModalHeader borderTopRadius="2xl" bg="brand.500" color="white">
              <Icon as={FiCheck} mr={3} />
              Confirm Submission
            </ModalHeader>
            <ModalBody py={6}>
              <Alert
                status="info"
                borderRadius="lg"
                bg="blue.50"
                border="1px"
                borderColor="blue.200"
              >
                <AlertIcon color="brand.500" />
                <Box>
                  <AlertTitle color="brand.700">
                    Ready to add benefit!
                  </AlertTitle>
                  <AlertDescription color="gray.600">
                    Are you sure you want to add "{formData.benefitName}" as a
                    new employee benefit?
                  </AlertDescription>
                </Box>
              </Alert>
            </ModalBody>
            <ModalFooter gap={3}>
              <Button variant="outline" onClick={onClose} borderRadius="lg">
                Cancel
              </Button>
              <Button
                colorScheme="brand"
                onClick={confirmSubmission}
                borderRadius="lg"
                leftIcon={<FiCheck />}
              >
                Confirm & Add
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default BenefitsForm;
