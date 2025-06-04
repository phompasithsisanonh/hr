import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  TableContainer,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  ModalFooter,
  Divider,
  Heading,
  Badge,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addDataEmplyee,
  DataEmplyee,
  messageClear,
} from "../store/Reducer/HRReducer/InformationEmplyee";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ViewIcon } from "lucide-react";
const DatabaseSalary = () => {
  const dispatch = useDispatch();
  const { getdatabase, errorMessage, successMessage } = useSelector(
    (state) => state.information
  );
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // State for commission
  const [commissionType, setCommissionType] = useState("");
  const [commissionRate, setCommissionRate] = useState("");

  // State for insurance types
  const [newInsuranceType, setNewInsuranceType] = useState("");
  const [newInsuranceRate, setNewInsuranceRate] = useState("");
  ///viewdata?
  const [viewdata, setViewdata] = useState("");
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = dateString;
      return date.split("T").toLocaleString();
    } catch (e) {
      return "Invalid date";
    }
  };
  const formatCurrency = (value) => {
    if (!value) return "0 ₭";
    const numValue = parseInt(value.$numberInt || value);
    return new Intl.NumberFormat("lo-LA", {
      style: "currency",
      currency: "LAK",
    }).format(numValue);
  };
  const handleOpenView = (item) => {
    onOpen();
    setViewdata(item);
  };
  // Main form data
  const [formData, setFormData] = useState({
    otTohour: 0,
    otminute: 0,

    typeCommission: {
      type: "",
      rate: "",
    },
    setAnnualHolidays: "",
    typeOfSecurity: [],
  });
 
  // Basic form field handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle commission input changes
  const handleCommissionTypeChange = (e) => {
    setCommissionType(e.target.value);
    setFormData({
      ...formData,
      typeCommission: {
        ...formData.typeCommission,
        type: e.target.value,
      },
    });
  };

  const handleCommissionRateChange = (e) => {
    setCommissionRate(e.target.value);
    setFormData({
      ...formData,
      typeCommission: {
        ...formData.typeCommission,
        rate: e.target.value,
      },
    });
  };

  // Add insurance to form data
  const handleAddInsurance = () => {
    if (newInsuranceType && newInsuranceRate) {
      setFormData({
        ...formData,
        typeOfSecurity: [
          ...formData.typeOfSecurity,
          {
            type: newInsuranceType,
            rate: newInsuranceRate,
          },
        ],
      });

      // Clear inputs after adding
      setNewInsuranceType("");
      setNewInsuranceRate("");
    } else {
      toast({
        title: "ຂໍ້ມູນບໍ່ຄົບຖ້ວນ",
        description: "ກະລຸນາຕື່ມປະເພດ ແລະ ອັດຕາປະກັນສັງຄົມ",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Remove insurance
  const handleRemoveInsurance = (index) => {
    const updatedTypes = [...formData.typeOfSecurity];
    updatedTypes.splice(index, 1);
    setFormData({
      ...formData,
      typeOfSecurity: updatedTypes,
    });
  };

  // Save data to backend
  const saveEmployeeData = async () => {
    // Validate required fields
    if (!formData.otTohour || !formData.setAnnualHolidays) {
      toast({
        title: "ຂໍ້ມູນບໍ່ຄົບຖ້ວນ",
        description: "ກະລຸນາຕື່ມຂໍ້ມູນທີ່ຈຳເປັນ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Ensure commission has values
    if (!formData.typeCommission.type || !formData.typeCommission.rate) {
      toast({
        title: "ຂໍ້ມູນບໍ່ຄົບຖ້ວນ",
        description: "ກະລຸນາຕື່ມຂໍ້ມູນຄຳຄອມມິຊັ່ນ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Format data to match backend expectations
      const dataToSubmit = {
        otTohour: Number(formData.otTohour),
        otminute: Number(formData.otminute),
        typeCommission: formData.typeCommission,
        setAnnualHolidays: Number(formData.setAnnualHolidays),
        typeOfSecurity: formData.typeOfSecurity,
      };

      dispatch(addDataEmplyee(dataToSubmit));

      // Reset form after successful save
      setFormData({
        otTohour: "",
        typeCommission: {
          type: "",
          rate: "",
        },
        setAnnualHolidays: "",
        typeOfSecurity: [],
      });
      setCommissionType("");
      setCommissionRate("");
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.response?.data?.message || "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error saving data:", error);
    }
  };

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

  useEffect(() => {
    dispatch(DataEmplyee());
  });
  return (
    <Container maxW="container.lg" py={8}>
      {getdatabase.length > 0 ? (
        <Box>
          <Box mt={6} overflowX="auto">
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              ລາຍການຈັດການ
            </Text>
            <TableContainer
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Table bg="gray.50" variant="simple">
                <Thead bg="gray.50">
                  <Tr>
                    <Th fontFamily="Noto Sans Lao, serif">ລະດັບ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ຈຳນວນຕຳແໜ່ງ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ກຳນົດວັນພັກປະຈຳປິ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ຄອມມິຊັ່ນ</Th>
                    <Th fontFamily="Noto Sans Lao, serif" width="80px">
                      ຈັດການ
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {getdatabase.map((edu, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{edu.department.length}</Td>
                      <Td>{edu.setAnnualHolidays}</Td>
                      <Td>
                        {edu.typeCommission.type}-{edu.rate}%
                      </Td>

                      <Td>
                        <HStack>
                          <IconButton
                            aria-label="Edit"
                            icon={<ViewIcon />}
                            onClick={() => handleOpenView(edu)}
                            colorScheme="orange"
                          />
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            onClick={() =>
                              navigate(`/editdatabaseEmplyee/${edu._id}`)
                            }
                            colorScheme="blue"
                          />
                          <IconButton
                            aria-label="Delete education"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      ) : (
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            ຂໍ້ມູນ
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>ກຳນົດເງິນລ່ວງເວລາຊົ່ວໂມງ</FormLabel>
                <Input
                  name="otTohour"
                  value={formData.otTohour}
                  onChange={handleInputChange}
                  placeholder="ເງິນຄ່າຊົ່ວໂມງ"
                  type="number"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ກຳນົດເງິນລ່ວງເວລາເປັນ30ນາທີ</FormLabel>
                <Input
                  name="otminute"
                  value={formData.otminute}
                  onChange={handleInputChange}
                  placeholder="ອັດຕາເງິນລ່ວງເວລາ"
                  type="number"
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <Flex gap={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel>ປະເພດຄຳຄອມມິຊັ່ນ</FormLabel>
                  <Input
                    value={commissionType}
                    onChange={handleCommissionTypeChange}
                    placeholder="ປະເພດຄຳຄອມມິຊັ່ນ"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>ອັດຕາໄດ້</FormLabel>
                  <Input
                    value={commissionRate}
                    onChange={handleCommissionRateChange}
                    placeholder="rate"
                    type="number"
                  />
                </FormControl>
              </Flex>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>ກຳນົດວັນພັກປະຈຳປິ</FormLabel>
                <Input
                  name="setAnnualHolidays"
                  value={formData.setAnnualHolidays}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="ຈັກມື້"
                />
              </FormControl>
            </GridItem>
          </Grid>

          <Box mt={8}>
            <Text fontSize="lg" fontWeight="medium" mb={4}>
              ຂໍ້ມູນປະກັນສັງຄົມ
            </Text>

            <Flex gap={4} mb={4}>
              <FormControl>
                <FormLabel>ປະເພດປະກັນສັງຄົມ</FormLabel>
                <Input
                  placeholder="ປະເພດປະກັນສັງຄົມ"
                  value={newInsuranceType}
                  onChange={(e) => setNewInsuranceType(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>ອັດຕາຫັກປະກັນສັງຄົມ</FormLabel>
                <Input
                  type="number"
                  placeholder="%"
                  value={newInsuranceRate}
                  onChange={(e) => setNewInsuranceRate(e.target.value)}
                />
              </FormControl>

              <Box alignSelf="flex-end" mb={1}>
                <Button colorScheme="blue" onClick={handleAddInsurance}>
                  ເພີ່ມ
                </Button>
              </Box>
            </Flex>

            {/* Table to display insurance types */}
            {formData.typeOfSecurity.length > 0 && (
              <Table variant="simple" mt={4}>
                <Thead>
                  <Tr>
                    <Th>ປະເພດປະກັນສັງຄົມ</Th>
                    <Th>ອັດຕາຫັກ (%)</Th>
                    <Th width="100px">ຈັດການ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {formData.typeOfSecurity.map((insurance, index) => (
                    <Tr key={index}>
                      <Td>{insurance.type}</Td>
                      <Td>{insurance.rate}%</Td>
                      <Td>
                        <IconButton
                          aria-label="Delete insurance"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRemoveInsurance(index)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>

          <Flex justifyContent="flex-end" mt={8}>
            <Button onClick={saveEmployeeData} colorScheme="green" size="lg">
              ບັນທຶກ
            </Button>
          </Flex>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent
          borderRadius="lg"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
          bg="white"
          maxW="container.lg"
          mx="auto"
          p={4}
        >
          <ModalHeader
            fontFamily="Noto Sans Lao, serif"
            fontSize="2xl"
            fontWeight="bold"
            color="gray.800"
            pb={2}
          >
            ລາຍລະອຽດ
          </ModalHeader>
          <ModalCloseButton
            size="lg"
            color="gray.500"
            _hover={{ color: "gray.700", bg: "gray.100" }}
            borderRadius="full"
          />
          <ModalBody fontSize="sm" color="gray.700">
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={6}
            >
              <GridItem colSpan={2}>
                <Heading
                  fontFamily="Noto Sans Lao, serif"
                  size="sm"
                  mb={3}
                  color="gray.700"
                  fontWeight="semibold"
                >
                  ຂໍ້ມູນທົ່ວໄປ
                </Heading>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  HR Admin ID
                </Text>
                <Text fontWeight="normal">{viewdata?.hrAdminId || "N/A"}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ການເລີ່ມເຮັດວຽກ
                </Text>
                <Text fontWeight="normal">{viewdata?.startWorkTime}</Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ຊົ່ວໂມງເຮັດວຽກມາດຕະຖານ
                </Text>
                <Text fontWeight="normal">
                  {viewdata?.standardTimeWorkHour} ຊົ່ວໂມງ
                </Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ມື້ພັກປະຈຳປີ
                </Text>
                <Text fontWeight="normal">
                  {viewdata?.setAnnualHolidays} ມື້
                </Text>
              </GridItem>

              <GridItem colSpan={2}>
                <Divider my={4} borderColor="gray.200" />
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={2}>
                  ພະແນກ
                </Text>
                {viewdata?.department?.map((i, index) => (
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
                    key={index}
                    mb={3}
                  >
                    <Text fontWeight="semibold" color="gray.700">
                      {i.type}
                    </Text>
                    {i.position.map((d, idx) => (
                      <Text
                        key={idx}
                        fontWeight="normal"
                        color="gray.600"
                        ml={4}
                        mt={1}
                      >
                        - {d.type}
                      </Text>
                    ))}
                  </Grid>
                ))}
              </GridItem>

              <GridItem colSpan={2}>
                <Divider my={4} borderColor="gray.200" />
                <Heading
                  fontFamily="Noto Sans Lao, serif"
                  size="sm"
                  mb={3}
                  color="gray.700"
                  fontWeight="semibold"
                >
                  ຄ່າຕອບແທນ
                </Heading>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ອັດຕາຄ່າຈ້າງຊົ່ວໂມງ OT
                </Text>
                <Text fontWeight="normal">
                  {formatCurrency(viewdata?.otTohour)}
                </Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ອັດຕາຄ່າຈ້າງນາທີ OT
                </Text>
                <Text fontWeight="normal">
                  {formatCurrency(viewdata?.otminute)}
                </Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ອັດຕາຫັກຄ່າຈ້າງຊົ່ວໂມງ (ມາຊ້າ)
                </Text>
                <Text fontWeight="normal">
                  {formatCurrency(viewdata?.latTohour)}
                </Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ອັດຕາຫັກຄ່າຈ້າງນາທີ (ມາຊ້າ)
                </Text>
                <Text fontWeight="normal">
                  {formatCurrency(viewdata?.latminute)}
                </Text>
              </GridItem>

              <GridItem colSpan={2}>
                <Divider my={4} borderColor="gray.200" />
                <Heading
                  fontFamily="Noto Sans Lao, serif"
                  size="sm"
                  mb={3}
                  color="gray.700"
                  fontWeight="semibold"
                >
                  commission fee & social security
                </Heading>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={2}>
                  ປະເພດ commission
                </Text>
                <Badge
                  colorScheme="purple"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="md"
                  mb={2}
                >
                  ປະເພດ {viewdata?.typeCommission?.type}
                </Badge>
                <Text fontWeight="normal">
                  ອັດຕາ: {viewdata?.typeCommission?.rate}%
                </Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={2}>
                  ປະເພດປະກັນສັງຄົມ
                </Text>
                {viewdata?.typeOfSecurity?.map((security, index) => (
                  <Box key={index} mb={3}>
                    <Badge
                      colorScheme="green"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                      mb={2}
                    >
                      ປະເພດ {security?.type}
                    </Badge>
                    <Text fontWeight="normal">ອັດຕາ: {security?.rate} %</Text>
                  </Box>
                ))}
              </GridItem>

              <GridItem colSpan={2}>
                <Divider my={4} borderColor="gray.200" />
                <Heading
                  fontFamily="Noto Sans Lao, serif"
                  size="sm"
                  mb={3}
                  color="gray.700"
                  fontWeight="semibold"
                >
                  ຂໍ້ມູນເພີ່ມເຕີມ
                </Heading>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ວັນທີສ້າງ
                </Text>
                <Text fontWeight="normal">
                  {formatDate(viewdata?.createdAt)}
                </Text>
              </GridItem>

              <GridItem>
                <Text fontWeight="medium" fontSize="sm" color="gray.600" mb={1}>
                  ວັນທີອັບເດດລ່າສຸດ
                </Text>
                <Text fontWeight="normal">
                  {formatDate(viewdata?.updatedAt)}
                </Text>
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              size="md"
              borderRadius="md"
              fontFamily="Noto Sans Lao, serif"
              onClick={onClose}
              _hover={{ bg: "blue.600" }}
            >
              ປິດ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default DatabaseSalary;
