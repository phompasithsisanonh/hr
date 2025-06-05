import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Badge,
  Text,
  Flex,
  Button,
  HStack,
  VStack,
  useColorModeValue,
  Tooltip,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  FormLabel,
  FormControl,
  Textarea,
  Input,
  Divider,
  Switch,
  Wrap,
  Spacer,
} from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import {
  addBenifitEmplyee,
  deleteBenefit,
  editBenefit,
  getBenifits,
  getBenifitsId,
  messageClear,
} from "../store/Reducer/HRReducer/InformationEmplyee";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { get_all_user } from "../store/Reducer/Auth/auth";
import { CloseIcon } from "@chakra-ui/icons";

const ListBenifis = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: addOpen, onOpen: onP, onClose: onCl } = useDisclosure();
  const [formData, setFormData] = useState(null);
  const [data, setData] = useState([]);
  const itemsPerPage = 8;
  const {
    getBenifitsData,
    getBenifitsIds,
    errorMessage,
    successMessage,
  } = useSelector((state) => state.information);
  const { get_all_user_em } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBenifits());
    dispatch(get_all_user());
  }, [dispatch]);

  // Sample data based on the provided structure
  useEffect(() => {
    setFormData({
      id: getBenifitsIds?._id,
      name: getBenifitsIds?.name,
      description: getBenifitsIds?.description,
      type: getBenifitsIds?.type,
      amount: getBenifitsIds?.amount,
      eligibility: getBenifitsIds?.eligibility,
      attachedDocument: getBenifitsIds?.attachedDocument,
      isActive: getBenifitsIds?.isActive,
      createdAt: getBenifitsIds?.createdAt,
    });
  }, [
    getBenifitsIds?._id,
    getBenifitsIds?.name,
    getBenifitsIds?.description,
    getBenifitsIds?.type,
    getBenifitsIds?.amount,
    getBenifitsIds?.eligibility,
    getBenifitsIds?.attachedDocument,
    getBenifitsIds?.isActive,
    getBenifitsIds?.createdAt,
  ]);
  // Color scheme
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");
  const labelColor = useColorModeValue("gray.700", "gray.200");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const focusBorderColor = useColorModeValue("blue.500", "blue.300");
  /// filter code

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get type color
  const getTypeColor = (type) => {
    const colors = {
      Bonus: "green",
      Insurance: "blue",
      Allowance: "purple",
      Development: "orange",
      Benefit: "teal",
      Incentive: "pink",
    };
    return colors[type] || "gray";
  };

  // Pagination logic
  const totalPages = Math.ceil(getBenifitsData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = getBenifitsData?.slice(startIndex, endIndex);

  const handleEdit = (id) => {
    onOpen();
    dispatch(getBenifitsId(id));
  };
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        attachedDocument: file,
      }));
    }
  };
  const handleSummit = (id) => {
    const data = new FormData();
    data.append("name", formData?.name);
    data.append("description", formData?.description);
    data.append("type", formData?.type);
    data.append("amount", formData?.amount);
    data.append("eligibility", formData?.eligibility);
    data.append("attachedDocument", formData?.attachedDocument);
    data.append("isActive", formData?.isActive);
    data.append("createdAt", formData?.createdAt);

    dispatch(editBenefit({ id, formData: data })).then(() =>
      dispatch(getBenifits())
    );
  };
  const handleDelete = (id) => {
    dispatch(deleteBenefit(id)).then(() => dispatch(getBenifits()));
  };
  const handleEm = () => {
    onP();
  };
  const handleSummitAdd = (e) => {
    if (!data.item || !data.selectedEmployee) {
      toast.error("ກະລຸນາເພີ່ມຂໍ້ມູນ", {
        duration: 3000,
        position: "top",
      });
    }
    dispatch(
      addBenifitEmplyee({
        items: data,
      })
    );
  };

  const SendData = (item) => {
    const checkItem = data?.item?.some((items) => items?._id === item?._id);
    if (checkItem) {
      toast.error("ມີໃນຕົວເລືອກແລ້ວ", {
        duration: 3000,
        position: "top",
      });
      return;
    }
    if(!item){
  toast.error("ກະລຸນາປ້ອນຕົວເລືອກ", {
        duration: 3000,
        position: "top",
      });
      return;
    }
    setData((prev) => ({
      ...prev,
      item: [...(prev.item || []), item],
    }));
  };
  const handleSelectEmployee = (e) => {
    setData((prev) => ({
      ...prev,
      selectedEmployee: e.target.value, // เก็บ _id ของคนที่เลือก
    }));
  };
  const handleRemoveItem = (index) => {
    setData((prev) => ({
      ...prev,
      item: prev.item.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        duration: 3000,
        position: "top",
      });
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast.error(errorMessage, {
        duration: 3000,
        position: "top",
      });
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);
  return (
    <Box maxW="full" mx="auto" p={6}>
      <Modal isOpen={addOpen} onClose={onCl}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ເລືອກສິດທິໃຫ້ແກ່ພະນັກງານ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* เลือกพนักงาน */}
              <Box>
                <Text fontWeight="bold">ເລືອກພະນັກງານ</Text>
                <Select
                  placeholder="ເລືອກພະນັກງານ"
                  onChange={handleSelectEmployee}
                >
                  {get_all_user_em?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.emplyeebarCode} - {item.personalInfo.fullName}
                    </option>
                  ))}
                </Select>
              </Box>

              {/* ปุ่มสิทธิประโยชน์ */}
              <Box>
                <Text fontWeight="bold">ເລືອກສິດທິປະໂຫຍດ</Text>
                <Wrap spacing={3}>
                  {getBenifitsData.map((item, index) => (
                    <Button
                      key={index}
                      size="sm"
                      colorScheme="teal"
                      onClick={() => SendData(item)}
                    >
                      {item.name}
                    </Button>
                  ))}
                </Wrap>
              </Box>

              {/* ข้อมูลที่เลือก */}
              <Box>
                <Text fontWeight="bold" mb={2}>
                  ລາຍການທີ່ເລືອກ
                </Text>
                {data.item?.length > 0 ? (
                  <VStack align="stretch" spacing={2}>
                    {data.item.map((i, index) => (
                      <HStack key={index} spacing={2}>
                        <Badge colorScheme="green">{i?.name}</Badge>
                        <Spacer />
                        <IconButton
                          aria-label="ลบ"
                          icon={<CloseIcon />}
                          size="xs"
                          colorScheme="red"
                          onClick={() => handleRemoveItem(index)}
                        />
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text fontStyle="italic" color="gray.500">
                    ບໍ່ມີຂໍ້ມູນ
                  </Text>
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCl}>
              Close
            </Button>
            <Button onClick={() => handleSummitAdd()} variant="ghost">
              ບັນທຶກ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Header */}
      <VStack align="stretch" spacing={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={2}>
            ຈັດການສິດທິຜົນປະໂຫຍດຂອງພະນັກງານ
          </Text>
          <Text color={mutedTextColor} fontSize="md">
            ລາຍການສິດທິຜົນປະໂຫຍດ ແລະ ການແກ້ໄຂ
          </Text>

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button onClick={() => handleEm()}>ເພີ່ມສິດທິໃຫ້ພະນັກງານ</Button>
          </Box>
        </Box>

        {/* Table Container */}
        <Box
          bg={bgColor}
          borderRadius="xl"
          boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
        >
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg={useColorModeValue("gray.50", "gray.900")}>
                <Tr>
                  <Th
                    fontFamily="Noto Sans Lao, serif"
                    color={mutedTextColor}
                    fontWeight="600"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    py={4}
                  >
                    ລາຍລະອຽດສິດທິ
                  </Th>
                  <Th
                    fontFamily="Noto Sans Lao, serif"
                    color={mutedTextColor}
                    fontWeight="600"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    py={4}
                  >
                    ປະເພດ & ຈຳນວນ
                  </Th>
                  <Th
                    fontFamily="Noto Sans Lao, serif"
                    color={mutedTextColor}
                    fontWeight="600"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    py={4}
                  >
                    Eligibility
                  </Th>
                  <Th
                    fontFamily="Noto Sans Lao, serif"
                    color={mutedTextColor}
                    fontWeight="600"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    py={4}
                  >
                    ສະຖານະ
                  </Th>
                  <Th
                    fontFamily="Noto Sans Lao, serif"
                    color={mutedTextColor}
                    fontWeight="600"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    py={4}
                  >
                    ວັນທີເພີ່ມ
                  </Th>
                  <Th
                    fontFamily="Noto Sans Lao, serif"
                    color={mutedTextColor}
                    fontWeight="600"
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    py={4}
                    textAlign="center"
                  >
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentData?.map((item, index) => (
                  <Tr
                    key={item.id}
                    _hover={{
                      bg: hoverBg,
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                    }}
                    transition="all 0.2s ease"
                    borderBottom="1px solid"
                    borderColor={borderColor}
                  >
                    {/* Benefit Details */}
                    <Td py={5} maxW="300px">
                      <VStack align="start" spacing={1}>
                        <Text
                          fontWeight="600"
                          color={textColor}
                          fontSize="sm"
                          noOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text
                          color={mutedTextColor}
                          fontSize="xs"
                          noOfLines={2}
                        >
                          {item.description}
                        </Text>
                        {item.attachedDocument && (
                          <Link
                            href={item.attachedDocument}
                            isExternal
                            color="blue.500"
                            fontSize="xs"
                            display="flex"
                            alignItems="center"
                            gap={1}
                            _hover={{ color: "blue.600" }}
                          >
                            View Document
                          </Link>
                        )}
                      </VStack>
                    </Td>

                    {/* Type & Amount */}
                    <Td py={5}>
                      <VStack align="start" spacing={2}>
                        <Badge
                          colorScheme={getTypeColor(item.type)}
                          variant="subtle"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="xs"
                          fontWeight="600"
                        >
                          {item.type}
                        </Badge>
                        <Text fontWeight="700" color={textColor} fontSize="sm">
                          {formatCurrency(item.amount)}
                        </Text>
                      </VStack>
                    </Td>

                    {/* Eligibility */}
                    <Td py={5}>
                      <Text color={textColor} fontSize="sm" fontWeight="500">
                        {item.eligibility}
                      </Text>
                    </Td>

                    {/* Status */}
                    <Td py={5}>
                      <Badge
                        colorScheme={item.isActive ? "green" : "red"}
                        variant="subtle"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="600"
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </Td>

                    {/* Created Date */}
                    <Td py={5}>
                      <Text color={mutedTextColor} fontSize="sm">
                        {formatDate(item.createdAt)}
                      </Text>
                    </Td>

                    {/* Actions */}
                    <Td py={5}>
                      <HStack spacing={2} justify="center">
                        <Tooltip label="Edit benefit" placement="top">
                          <IconButton
                            aria-label="Edit"
                            icon={<Edit size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            borderRadius="lg"
                            _hover={{
                              bg: "blue.50",
                              transform: "scale(1.05)",
                              boxShadow: "0 2px 8px rgba(59, 130, 246, 0.15)",
                            }}
                            transition="all 0.2s ease"
                            onClick={() => handleEdit(item._id)}
                          />
                        </Tooltip>
                        <Tooltip label="Delete benefit" placement="top">
                          <IconButton
                            aria-label="Delete"
                            icon={<Trash2 size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            borderRadius="lg"
                            _hover={{
                              bg: "red.50",
                              transform: "scale(1.05)",
                              boxShadow: "0 2px 8px rgba(239, 68, 68, 0.15)",
                            }}
                            transition="all 0.2s ease"
                            onClick={() => handleDelete(item._id)}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box
            px={6}
            py={4}
            borderTop="1px solid"
            borderColor={borderColor}
            bg={useColorModeValue("gray.50", "gray.900")}
          >
            <Flex justify="space-between" align="center">
              <Text color={mutedTextColor} fontSize="sm">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, getBenifitsData?.length)} of{" "}
                {getBenifitsData?.length} results
              </Text>

              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  isDisabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  borderRadius="lg"
                  _hover={{
                    bg: "gray.100",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s ease"
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={currentPage === page ? "solid" : "ghost"}
                      colorScheme={currentPage === page ? "blue" : "gray"}
                      onClick={() => setCurrentPage(page)}
                      borderRadius="lg"
                      minW="40px"
                      _hover={{
                        transform: "translateY(-1px)",
                        boxShadow:
                          currentPage === page
                            ? "0 4px 12px rgba(59, 130, 246, 0.25)"
                            : "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                      transition="all 0.2s ease"
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  isDisabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  borderRadius="lg"
                  _hover={{
                    bg: "gray.100",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.2s ease"
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Box>
      </VStack>

      {/* ///edit Model */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(8px)" />
        <ModalContent
          borderRadius="2xl"
          boxShadow="0 25px 50px rgba(0, 0, 0, 0.15)"
          border="1px solid"
          borderColor={borderColor}
          bg={bgColor}
          mx={4}
          overflow="hidden"
        >
          {/* Header */}
          <ModalHeader
            pb={4}
            pt={6}
            px={8}
            bg={useColorModeValue("gray.50", "gray.900")}
          >
            <HStack spacing={3}>
              <Box
                p={2}
                borderRadius="lg"
                bg={useColorModeValue("blue.100", "blue.900")}
                color={useColorModeValue("blue.600", "blue.300")}
              ></Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="xl" fontWeight="700" color={labelColor}>
                  Edit Employee Benefit
                </Text>
                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.500", "gray.400")}
                >
                  Update benefit information and settings
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>

          <ModalCloseButton
            size="lg"
            borderRadius="full"
            _hover={{
              bg: useColorModeValue("gray.100", "gray.700"),
              transform: "scale(1.1)",
            }}
            transition="all 0.2s ease"
            top={6}
            right={6}
          />

          {/* Body */}
          <ModalBody px={8} py={6}>
            <VStack spacing={6} align="stretch">
              {/* Benefit Name */}
              <FormControl>
                <FormLabel
                  color={labelColor}
                  fontWeight="600"
                  fontSize="sm"
                  mb={3}
                >
                  <HStack spacing={2}>
                    <Text>Benefit Name</Text>
                  </HStack>
                </FormLabel>
                <Input
                  value={formData?.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter benefit name"
                  size="lg"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  bg={inputBg}
                  _hover={{
                    borderColor: useColorModeValue("gray.300", "gray.500"),
                  }}
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: `0 0 0 1px ${focusBorderColor}`,
                    bg: bgColor,
                  }}
                  transition="all 0.2s ease"
                />
              </FormControl>

              {/* Description */}
              <FormControl>
                <FormLabel
                  color={labelColor}
                  fontWeight="600"
                  fontSize="sm"
                  mb={3}
                >
                  <HStack spacing={2}>
                    <Text>Description</Text>
                  </HStack>
                </FormLabel>
                <Textarea
                  value={formData?.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe the benefit details..."
                  size="lg"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  bg={inputBg}
                  rows={4}
                  _hover={{
                    borderColor: useColorModeValue("gray.300", "gray.500"),
                  }}
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: `0 0 0 1px ${focusBorderColor}`,
                    bg: bgColor,
                  }}
                  transition="all 0.2s ease"
                  resize="vertical"
                />
              </FormControl>

              {/* Type and Amount Row */}
              <HStack spacing={6} align="end">
                <FormControl>
                  <FormLabel
                    color={labelColor}
                    fontWeight="600"
                    fontSize="sm"
                    mb={3}
                  >
                    <HStack spacing={2}>
                      <Text>Benefit Type</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    value={formData?.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={useColorModeValue("gray.200", "gray.600")}
                    bg={inputBg}
                    _hover={{
                      borderColor: useColorModeValue("gray.300", "gray.500"),
                    }}
                    _focus={{
                      borderColor: focusBorderColor,
                      boxShadow: `0 0 0 1px ${focusBorderColor}`,
                      bg: bgColor,
                    }}
                    transition="all 0.2s ease"
                  >
                    <option value="Bonus">Bonus</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Allowance">Allowance</option>
                    <option value="Development">Development</option>
                    <option value="Benefit">Benefit</option>
                    <option value="Incentive">Incentive</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel
                    color={labelColor}
                    fontWeight="600"
                    fontSize="sm"
                    mb={3}
                  >
                    <HStack spacing={2}>
                      <Text>Amount (USD)</Text>
                    </HStack>
                  </FormLabel>
                  <NumberInput
                    value={formData?.amount}
                    onChange={(valueString, valueNumber) =>
                      handleInputChange("amount", valueNumber)
                    }
                    min={0}
                    max={10000000}
                    size="lg"
                  >
                    <NumberInputField
                      borderRadius="xl"
                      border="2px solid"
                      borderColor={useColorModeValue("gray.200", "gray.600")}
                      bg={inputBg}
                      _hover={{
                        borderColor: useColorModeValue("gray.300", "gray.500"),
                      }}
                      _focus={{
                        borderColor: focusBorderColor,
                        boxShadow: `0 0 0 1px ${focusBorderColor}`,
                        bg: bgColor,
                      }}
                      transition="all 0.2s ease"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper
                        border="none"
                        _hover={{
                          bg: useColorModeValue("gray.100", "gray.600"),
                        }}
                      />
                      <NumberDecrementStepper
                        border="none"
                        _hover={{
                          bg: useColorModeValue("gray.100", "gray.600"),
                        }}
                      />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>

              {/* Eligibility */}
              <FormControl>
                <FormLabel
                  color={labelColor}
                  fontWeight="600"
                  fontSize="sm"
                  mb={3}
                >
                  <HStack spacing={2}>
                    <Text>Eligibility Criteria</Text>
                  </HStack>
                </FormLabel>
                <Select
                  value={formData?.eligibility}
                  onChange={(e) =>
                    handleInputChange("eligibility", e.target.value)
                  }
                  size="lg"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  bg={inputBg}
                  _hover={{
                    borderColor: useColorModeValue("gray.300", "gray.500"),
                  }}
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: `0 0 0 1px ${focusBorderColor}`,
                    bg: bgColor,
                  }}
                  transition="all 0.2s ease"
                >
                  <option value="All Employees">All Employees</option>
                  <option value="All Full-time">All Full-time</option>
                  <option value="Permanent Staff">Permanent Staff</option>
                  <option value="Remote Workers">Remote Workers</option>
                  <option value="On-site Staff">On-site Staff</option>
                  <option value="Office Workers">Office Workers</option>
                  <option value="Sales Team">Sales Team</option>
                  <option value="Female Employees">Female Employees</option>
                </Select>
              </FormControl>

              <Divider />

              {/* Document Upload Section */}
              <Box>
                <FormLabel
                  color={labelColor}
                  fontWeight="600"
                  fontSize="sm"
                  mb={4}
                >
                  <HStack spacing={2}>
                    <Text>Attached Document</Text>
                  </HStack>
                </FormLabel>

                <VStack spacing={3}>
                  {/* Current Document */}
                  <Box
                    w="full"
                    p={4}
                    border="2px dashed"
                    borderColor={useColorModeValue("blue.200", "blue.600")}
                    borderRadius="xl"
                    bg={useColorModeValue("blue.50", "blue.900")}
                    _hover={{
                      borderColor: useColorModeValue("blue.300", "blue.500"),
                      bg: useColorModeValue("blue.100", "blue.800"),
                    }}
                    transition="all 0.2s ease"
                    cursor="pointer"
                  >
                    <HStack spacing={3}>
                      <VStack align="start" spacing={1} flex={1}>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          name="attachedDocument"
                          onChange={handleFileChange}
                          id="file-upload"
                        />
                        <Text
                          fontSize="xs"
                          color={useColorModeValue("blue.500", "blue.400")}
                        >
                          Click to replace or drag new file here
                        </Text>
                      </VStack>
                      <Link
                        href="#"
                        color={useColorModeValue("blue.500", "blue.300")}
                        _hover={{
                          color: useColorModeValue("blue.600", "blue.200"),
                        }}
                      ></Link>
                    </HStack>
                  </Box>
                </VStack>
              </Box>

              <Divider />

              {/* Status Toggle */}
              <FormControl>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <FormLabel
                      color={labelColor}
                      fontWeight="600"
                      fontSize="sm"
                      mb={0}
                    >
                      Benefit Status
                    </FormLabel>
                    <Text
                      fontSize="xs"
                      color={useColorModeValue("gray.500", "gray.400")}
                    >
                      {formData?.isActive
                        ? "Currently active and available"
                        : "Currently inactive"}
                    </Text>
                  </VStack>

                  <HStack spacing={3}>
                    <Badge
                      colorScheme={formData?.isActive ? "green" : "red"}
                      variant="subtle"
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="600"
                    >
                      {formData?.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      isChecked={formData?.isActive}
                      onChange={(e) =>
                        handleInputChange("isActive", e.target.checked)
                      }
                      colorScheme="green"
                      size="lg"
                    />
                  </HStack>
                </HStack>
              </FormControl>
            </VStack>
          </ModalBody>

          {/* Footer */}
          <ModalFooter
            px={8}
            py={6}
            bg={useColorModeValue("gray.50", "gray.900")}
            borderTop="1px solid"
            borderColor={borderColor}
          >
            <HStack spacing={3} w="full" justify="end">
              <Button
                variant="ghost"
                onClick={onClose}
                size="lg"
                borderRadius="xl"
                _hover={{
                  bg: useColorModeValue("gray.100", "gray.700"),
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s ease"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                size="lg"
                borderRadius="xl"
                boxShadow="0 4px 20px rgba(59, 130, 246, 0.25)"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(59, 130, 246, 0.35)",
                }}
                transition="all 0.3s ease"
                px={8}
                onClick={() => handleSummit(formData?.id)}
              >
                ບັນທຶກການແກ້ໄຂ
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ListBenifis;
