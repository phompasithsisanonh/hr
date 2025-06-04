import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  ModalFooter,
  Select,
  Text,
  useDisclosure,
  VStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  FormErrorMessage,
  useToast,
  Spinner,
  Flex,
  Center,
  Heading,
  Container,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Grid,
  GridItem,
  Tooltip,
  useColorModeValue,
  Tag,
  Td,
  Tr,
  Thead,
  Table,
  Th,
  Tbody,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  addfileInOutWork,
  addFormData,
  addFormDataEdit,
  getAllot,
  getSalary,
  messageClear,
} from "../store/Reducer/HRReducer/salaryReducer";
import {
  PiAirplaneFill,
  PiMicrosoftExcelLogoFill,
  PiClockCountdownFill,
  PiUploadSimpleBold,
  PiUserCirclePlusFill,
} from "react-icons/pi";
import { DataEmplyee } from "../store/Reducer/HRReducer/InformationEmplyee";
import { get_all_user } from "../store/Reducer/Auth/auth";
import { IoRefreshCircle } from "react-icons/io5";
import { Edit2Icon, Clock, UserPlus } from "lucide-react";

const AddFileWorkTime = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState("");

  const {
    dataOt,
    loader,
    getSalaries,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.salary);
  const { getdatabase } = useSelector((state) => state.information);
  const { get_all_user_em } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    emplyeebarCode: "",
    fullName: "",
    filtercheckIdcode: "",
    date: new Date().toISOString().split("T")[0],
    inTime: "",
    outTime: "",
  });
  const [formEdit, setFormEdit] = useState({
    _id: "",
    fullName: "",
    filtercheckIdcode: "",
    date: new Date().toISOString().split("T")[0],
    inTime: "",
    outTime: "",
  });
  const [montheris, setMontheris] = useState(0);
  const [yearseris, setYearseris] = useState(0);
  ///addFormData date
  const covert = new Date(formData.date);
  const monthryCover = covert?.getMonth() + 1;
  ////monthryCoverEdit
  const covertedit = new Date(formEdit.date);
  const monthryCoverEdit = covertedit?.getMonth() + 1;
  // Background colors and gradient
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.100, purple.100)",
    "linear(to-r, gray.700, purple.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const groupedSummaries = dataOt.reduce((acc, item) => {
    const monthYear = item?.date.slice(4, 15); // เอาแค่ 'YYYY-MM'
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {});
  const result = Object.entries(groupedSummaries).flatMap(([year, items]) => {
    const date = new Date(year);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const years = date.getFullYear();
    return items
      .filter((i, { personalInfo }) => {
        const matchFullName =
          !Number(selectedEmployeeCode) ||
          i.emplyeecode === Number(selectedEmployeeCode);
        const matchMonth = !montheris || month === Number(montheris);
        const matchYear = !yearseris || years === Number(yearseris);
        return matchFullName && matchMonth && matchYear;
      })
      .map((item) => ({ ...item, day, month, year: years }));
  });
  const [errors, setErrors] = useState({});
  const [errorsEdit, setErrorsEdit] = useState({});
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: eidtIsOpen,
    onOpen: editOpen,
    onClose: editClose,
  } = useDisclosure();

  // Form validation

  const validateForm = () => {
    const newErrors = {};
    if (!formData.emplyeebarCode)
      newErrors.emplyeebarCode = "ກະລຸນາເລືອກລະຫັດພະນັກງານ";
    if (!formData.filtercheckIdcode)
      newErrors.filtercheckIdcode = "ກະລຸນາປ້ອນລະຫັດ filtercheckIdcode";
    if (!formData.date) newErrors.date = "ກະລຸນາເລືອກວັນທີ";
    if (!formData.inTime) newErrors.inTime = "ກະລຸນາປ້ອນເວລາເຂົ້າວຽກ";
    if (!formData.outTime) newErrors.outTime = "ກະລຸນາປ້ອນເວລາເລີກວຽກ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const validateFormEdit = () => {
    const newErrors = {};
    if (!formEdit.emplyeebarCode)
      newErrors.emplyeebarCode = "ກະລຸນາເລືອກລະຫັດພະນັກງານ";
    if (!formEdit.filtercheckIdcode)
      newErrors.filtercheckIdcode = "ກະລຸນາປ້ອນລະຫັດ filtercheckIdcode";
    if (!formEdit.date) newErrors.date = "ກະລຸນາເລືອກວັນທີ";
    if (!formEdit.inTime) newErrors.inTime = "ກະລຸນາປ້ອນເວລາເຂົ້າວຽກ";
    setErrorsEdit(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Compute full name based on selected employee barcode
  const getFullnameEmply = useMemo(() => {
    return get_all_user_em.find(
      (item) => item.emplyeebarCode === Number(formData.emplyeebarCode)
    );
  }, [get_all_user_em, formData.emplyeebarCode]);
  const getFullnameEmplyEdit = useMemo(() => {
    return get_all_user_em.find(
      (item) => item.emplyeebarCode === Number(formEdit.emplyeebarCode)
    );
  }, [get_all_user_em, formEdit.emplyeebarCode]);
  const handleonChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleChange = (e) => {
    const { files } = e.target;
    const selectedFile = files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const handleSave = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await dispatch(addfileInOutWork({ file: formData })).unwrap();
        toast({
          title: "ສຳເລັດ",
          description: "ອັບໂຫຼດໄຟລສຳເລັດແລ້ວ",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          variant: "solid",
        });
        setFile(null);
        setFileName("");
      } catch (error) {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: "ບໍ່ສາມາດອັບໂຫຼດໄຟລໄດ້",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          variant: "solid",
        });
      }
    } else {
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: "ກະລຸນາເລືອກໄຟລກ່ອນ",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        variant: "solid",
      });
    }
  };

  const handleSaveAdd = async () => {
    if (validateForm()) {
      try {
        onClose();
        const changeTypeData = new Date(formData.date);
        const stringData = changeTypeData.toString();
        const hasSalary = getSalaries.some(
          (salary) =>
            Number(salary?.month) === Number(monthryCover) &&
            Number(formData.emplyeebarCode) === Number(salary?.employeeCode)
        );
        if (hasSalary) {
          toast({
            title: "ແຈ້ງເຕືອນ",
            description:
              "ເດືອນນີ້ຄິດໄລ່ເງິນເດືອນແລ້ວ ກະລຸນາເລືອກເດືອນໃໝ່ ຫຼື ຜູ້ໃຊ້ງານໃໝ່",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
            variant: "solid",
          });
          return false;
        }
        dispatch(
          addFormData({
            emplyeebarCode: formData.emplyeebarCode,
            fullName: formData.fullName,
            filtercheckIdcode: formData.filtercheckIdcode,
            date: stringData,
            inTime: formData.inTime,
            outTime: formData.outTime,
          })
        ).then(() => dispatch(getAllot()));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleOpen = (item) => {
    editOpen();
    console.log(item);
    setFormEdit({
      id: item.id,
      emplyeebarCode: item.emplyeecode,
      fullName: item.fullName,
      filtercheckIdcode: item.filtercheckIdcode,
      date: item.date,
      inTime: item.inTime,
      outTime: item.outTime,
    });
  };
  const handleEditAdd = () => {
    if (validateFormEdit()) {
      try {
        const changeTypeData = new Date(formEdit.date);
        const stringData = changeTypeData.toString();
        const hasSalary = getSalaries.some(
          (salary) =>
            Number(salary?.month) === Number(monthryCoverEdit) &&
            Number(formEdit.emplyeebarCode) === Number(salary?.employeeCode)
        );
        if (hasSalary) {
          toast({
            title: "ແຈ້ງເຕືອນ",
            description:
              "ເດືອນນີ້ຄິດໄລ່ເງິນເດືອນແລ້ວ ກະລຸນາເລືອກເດືອນໃໝ່ ຫຼື ຜູ້ໃຊ້ງານໃໝ່",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
            variant: "solid",
          });
          return false;
        }
        dispatch(
          addFormDataEdit({
            id: formEdit.id,
            emplyeebarCode: formEdit.emplyeebarCode,
            fullName: formEdit.fullName,
            filtercheckIdcode: formEdit.filtercheckIdcode,
            date: stringData,
            inTime: formEdit.inTime,
            outTime: formEdit.outTime,
          })
        ).then(() => dispatch(getAllot()));
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleonChangeEdit = (e) => {
    const { name, value } = e.target;
    setFormEdit((prev) => ({ ...prev, [name]: value }));
    setErrorsEdit((prev) => ({ ...prev, [name]: "" }));
  };
  const years = Array.from(
    { length: 5 },
    (_, index) => new Date().getFullYear() - index
  );
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const clear = () => {
    setSelectedEmployeeCode("");
    setMontheris("");
    setYearseris("");
  };
  useEffect(() => {
    if (getFullnameEmply) {
      setFormData((prev) => ({
        ...prev,
        fullName: getFullnameEmply?.personalInfo?.fullName || "",
      }));
    }
    if (getFullnameEmplyEdit) {
      setFormEdit((prev) => ({
        ...prev,
        fullName: getFullnameEmplyEdit?.personalInfo?.fullName || "",
      }));
    }
  }, [getFullnameEmply, getFullnameEmplyEdit]);
  useEffect(() => {
    dispatch(getAllot());
    dispatch(DataEmplyee());
    dispatch(get_all_user());
    dispatch(getSalary());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      toast({
        title: "successfully",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        variant: "solid",
      });

      dispatch(messageClear());
    }
    if (errorMessage) {
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
        variant: "solid",
      });
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, toast]);

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.3 },
    },
  };

  if (loader) {
    return (
      <Flex
        justify="center"
        align="center"
        height="100vh"
        bgGradient={bgGradient}
      >
        <Center p={8} borderRadius="xl" bg={cardBg} boxShadow="xl">
          <VStack>
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
            <Text mt={4} fontSize="lg" fontWeight="medium">
              ກຳລັງໂຫຼດຂໍ້ມູນ...
            </Text>
          </VStack>
        </Center>
      </Flex>
    );
  }

  return (
    <Box bgGradient={bgGradient} minH="100vh" py={6} px={{ base: 4, md: 6 }}>
      <Container maxW="8xl">
        <motion.div initial="hidden" animate="visible" variants={textVariants}>
          <Card
            bg={cardBg}
            borderRadius="xl"
            boxShadow="xl"
            overflow="hidden"
            mb={8}
          >
            <CardHeader bg={headerBg} py={6} px={8}>
              <Heading
                fontFamily="Noto Sans Lao, serif"
                size="lg"
                fontWeight="800"
              >
                ເພີ່ມໄຟລ ເຂົ້າ-ອອກງານ
              </Heading>
            </CardHeader>

            <CardBody px={8} py={6}>
              <VStack spacing={8} align="stretch">
                {/* Filter Controls */}
                <Grid
                  templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                  gap={5}
                >
                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="medium">ລ້າງການຄົ້ນຫາ</FormLabel>
                      <Tooltip hasArrow label="Reset filters">
                        <IconButton
                          onClick={clear}
                          colorScheme="red"
                          icon={<IoRefreshCircle size={22} />}
                          size="lg"
                          borderRadius="md"
                          width="full"
                          _hover={{ transform: "scale(1.05)" }}
                          transition="all 0.2s"
                        />
                      </Tooltip>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="medium">ປີ</FormLabel>
                      <Select
                        id="year"
                        value={yearseris}
                        onChange={(e) => setYearseris(e.target.value)}
                        bg={cardBg}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                        size="lg"
                        _hover={{ borderColor: "blue.400" }}
                      >
                        <option value="">ທັງໝົດ</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="medium">ເດືອນ</FormLabel>
                      <Select
                        id="month"
                        value={montheris}
                        onChange={(e) => setMontheris(e.target.value)}
                        bg={cardBg}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                        size="lg"
                        _hover={{ borderColor: "blue.400" }}
                      >
                        <option value="">ທັງໝົດ</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl>
                      <FormLabel fontWeight="medium">ລະຫັດພະນັກງານ</FormLabel>
                      <Select
                        id="employeeCode"
                        value={selectedEmployeeCode}
                        onChange={(e) =>
                          setSelectedEmployeeCode(e.target.value)
                        }
                        placeholder="ເລືອກລະຫັດພະນັກງານ"
                        bg={cardBg}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={borderColor}
                        size="lg"
                        _hover={{ borderColor: "blue.400" }}
                      >
                        {get_all_user_em?.map((employee) => (
                          <option
                            key={employee.emplyeebarCode}
                            value={employee.emplyeebarCode}
                          >
                            {employee.emplyeebarCode}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </GridItem>
                </Grid>

                {/* File Upload Section */}
                <Card
                  as={motion.div}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  bg={cardBg}
                  boxShadow="md"
                  overflow="hidden"
                >
                  <CardHeader bg="blue.50" py={4} px={6}>
                    <HStack>
                      <Text fontWeight="bold">ອັບໂຫຼດຟາຍ Excel</Text>
                    </HStack>
                  </CardHeader>
                  <CardBody py={5} px={6}>
                    <FormControl>
                      <FormLabel fontWeight="medium">
                        ກະລຸນາເລືອກສະເພາະ files Excel ທີ່ເປັນຕາຕະລາງຕາມທີ່ກຳນົດ
                      </FormLabel>
                      <Box
                        border="2px dashed"
                        borderColor="blue.200"
                        borderRadius="md"
                        p={6}
                        textAlign="center"
                        transition="all 0.3s"
                        _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                      >
                        <Input
                          type="file"
                          accept=".csv, text/csv, .json, application/json, .xlsx, .xls, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          onChange={handleChange}
                          opacity="0"
                          position="absolute"
                          top="0"
                          left="0"
                          width="100%"
                          height="100%"
                          cursor="pointer"
                        />
                        <VStack spacing={3}>
                          <PiUploadSimpleBold size={32} color="#3182CE" />
                          <Text>ເລືອກຟາຍ ຫຼື ລາກແລະວາງຟາຍໃສ່ບ່ອນນີ້</Text>
                        </VStack>
                      </Box>
                      {fileName && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={textVariants}
                        >
                          <HStack
                            mt={4}
                            p={3}
                            bg="blue.50"
                            borderRadius="md"
                            justifyContent="space-between"
                          >
                            <HStack>
                              <PiMicrosoftExcelLogoFill
                                size={20}
                                color="green"
                              />
                              <Text fontSize="sm">{fileName}</Text>
                            </HStack>
                            <Badge
                              colorScheme="green"
                              variant="solid"
                              borderRadius="full"
                              px={2}
                            >
                              ພ້ອມອັບໂຫຼດ
                            </Badge>
                          </HStack>
                        </motion.div>
                      )}
                    </FormControl>

                    <HStack spacing={4} mt={6}>
                      <Button
                        isDisabled={true}
                        leftIcon={<PiUploadSimpleBold />}
                        colorScheme="blue"
                        onClick={handleSave}
                        size="md"
                        px={6}
                        borderRadius="md"
                        boxShadow="md"
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        transition="all 0.3s"
                      >
                        ອັບໂຫຼດໄຟລ
                      </Button>
                      <Button
                        leftIcon={<PiUserCirclePlusFill />}
                        onClick={onOpen}
                        colorScheme="teal"
                        variant="solid"
                        size="md"
                        px={6}
                        borderRadius="md"
                        boxShadow="md"
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        transition="all 0.3s"
                      >
                        ເພີ່ມOT
                      </Button>
                    </HStack>
                  </CardBody>
                </Card>

                {/* Company Work Schedule */}
                {getdatabase.length > 0 && (
                  <Card
                    as={motion.div}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                  >
                    <CardHeader bg="purple.50" py={4} px={6}>
                      <HStack>
                        <Clock size={20} />
                        <Text fontWeight="bold">
                          ກຳນົດເວລາເຂົ້າວຽກ-ອອກວຽກຂອງບໍລິສັດ
                        </Text>
                      </HStack>
                    </CardHeader>
                    <CardBody py={5} px={6}>
                      <Grid
                        templateColumns={{
                          base: "1fr",
                          md: "repeat(2, 1fr)",
                          lg: "repeat(4, 1fr)",
                        }}
                        gap={4}
                      >
                        {getdatabase.map((item, index) => (
                          <React.Fragment key={index}>
                            <GridItem>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm" color={mutedColor}>
                                  ເວລາເຂົ້າວຽກ
                                </Text>
                                <Text fontWeight="medium" fontSize="lg">
                                  {item?.startWorkTime}
                                </Text>
                              </VStack>
                            </GridItem>
                            <GridItem>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm" color={mutedColor}>
                                  ຈຳນວນຊົ່ວໂມງເຮັດວຽກ
                                </Text>
                                <Text fontWeight="medium" fontSize="lg">
                                  {item?.standardTimeWorkHour} ຊົ່ວໂມງ
                                </Text>
                              </VStack>
                            </GridItem>
                            <GridItem>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm" color={mutedColor}>
                                  ຈຳນວນເງິນຊົ່ວໂມງOT
                                </Text>
                                <Text fontWeight="medium" fontSize="lg">
                                  LAK {item?.otTohour.toLocaleString()}
                                </Text>
                              </VStack>
                            </GridItem>
                            <GridItem>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm" color={mutedColor}>
                                  ຈຳນວນເງິນນາທີOT
                                </Text>
                                <Text fontWeight="medium" fontSize="lg">
                                  LAK {item?.otminute.toLocaleString()}
                                </Text>
                              </VStack>
                            </GridItem>
                          </React.Fragment>
                        ))}
                      </Grid>
                    </CardBody>
                  </Card>
                )}

                {/* Download Options */}
                <HStack spacing={4} mt={2}>
                  <Tooltip label="ດາວໂຫລດ Excel" hasArrow>
                    <IconButton
                      fontSize="24px"
                      colorScheme="green"
                      icon={<PiMicrosoftExcelLogoFill />}
                      size="lg"
                      borderRadius="md"
                      boxShadow="md"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.3s"
                    />
                  </Tooltip>
                  <Tooltip label="Send Report" hasArrow>
                    <IconButton
                      fontSize="24px"
                      colorScheme="red"
                      icon={<PiAirplaneFill />}
                      size="lg"
                      borderRadius="md"
                      boxShadow="md"
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "lg",
                      }}
                      transition="all 0.3s"
                    />
                  </Tooltip>
                </HStack>

                {/* Data Table */}
                <Card
                  as={motion.div}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <CardHeader bg="blue.50" py={4} px={6}>
                    <HStack spacing={2} justify="space-between">
                      <HStack>
                        <PiClockCountdownFill size={20} />
                        <Text fontWeight="bold" fontSize="lg">
                          ລາຍການບັນທຶກເວລາເຂົ້າ-ອອກວຽກ
                        </Text>
                      </HStack>
                      <Tag colorScheme="blue" borderRadius="full" size="md">
                        {result.length} ລາຍການ
                      </Tag>
                    </HStack>
                  </CardHeader>
                  <Box
                    maxH="550px"
                    overflowY="auto"
                    css={{
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "10px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#3182CE",
                        borderRadius: "10px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        background: "#2C5282",
                      },
                    }}
                  >
                    <Box fontSize="sm" position="relative" width="100%">
                      <Table variant="simple">
                        <Thead
                          position="sticky"
                          top="0"
                          zIndex="10"
                          bg={headerBg}
                        >
                          <Tr>
                            {[
                              "filterCode",
                              "ລະຫັດພະນັກງານ",
                              "ວັນທີ",
                              "ຊື່ພະນັກງານ",
                              "ເວລາເຂົ້າວຽກ",
                              "ເວລາເລີກວຽກ",
                              "ຊົ່ວໂມງລ່ວງເວລາ",
                              "ເຄິ່ງຊົ່ວໂມງລ່ວງເວລາ",
                              "ຫັກຊົ່ວໂມງລ່ວງເວລາ",
                              "ຫັກເຄິ່ງຊົ່ວໂມງລ່ວງເວລາ",
                              "ບອດໄດ້ຮັບ",
                              "ຈັດການ",
                            ].map((header, index) => (
                              <Th
                                fontFamily="Noto Sans Lao, serif"
                                key={index}
                                textAlign="center"
                                borderColor={borderColor}
                                color={textColor}
                              >
                                {header}
                              </Th>
                            ))}
                          </Tr>
                        </Thead>

                        <Tbody>
                          {result.length > 0 ? (
                            result.map((item, index) => (
                              <Tr
                                key={index}
                                _hover={{ bg: hoverBg }}
                                transition="background 0.2s"
                                borderBottom="1px"
                                borderColor={borderColor}
                              >
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.filtercheckIdcode}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.emplyeecode}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {new Date(item.date).toLocaleDateString(
                                    "lo-LA"
                                  )}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.fullName}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.inTime}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.outTime}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.calculateTimeOThour.toLocaleString() ||
                                    "0"}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.calculateTimeOTminute.toLocaleString() |
                                    "0"}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.calculateTimeLateHour.toLocaleString() ||
                                    "0"}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.calculateTimeLateMinute.toLocaleString() ||
                                    "0"}
                                </Td>
                                <Td
                                  fontFamily="Noto Sans Lao, serif"
                                  textAlign="center"
                                >
                                  {item.incomeNet.toLocaleString() || "0"}
                                </Td>
                                <Td textAlign="center">
                                  <Tooltip label="ແກ້ໄຂ" hasArrow>
                                    <IconButton
                                      icon={<Edit2Icon size={16} />}
                                      colorScheme="blue"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOpen(item)}
                                      _hover={{ bg: "blue.100" }}
                                      transition="all 0.2s"
                                    />
                                  </Tooltip>
                                </Td>
                              </Tr>
                            ))
                          ) : (
                            <Tr>
                              <Td
                                colSpan={11}
                                textAlign="center"
                                p={6}
                                color={mutedColor}
                              >
                                <Text>ບໍ່ພົບຂໍ້ມູນ</Text>
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                </Card>
              </VStack>
            </CardBody>
          </Card>
        </motion.div>

        {/* Add OT Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="xl" bg={cardBg}>
            <ModalHeader bg={headerBg} borderRadius="xl 0 0 0">
              <HStack>
                <UserPlus size={20} />
                <Text fontWeight="bold">ເພີ່ມຂໍ້ມູນ OT</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={6}>
              <VStack spacing={5}>
                <FormControl isInvalid={errors.emplyeebarCode}>
                  <FormLabel>ລະຫັດພະນັກງານ</FormLabel>
                  <Select
                    name="emplyeebarCode"
                    value={formData.emplyeebarCode}
                    onChange={handleonChange}
                    placeholder="ເລືອກລະຫັດພະນັກງານ"
                    borderRadius="md"
                    size="lg"
                  >
                    {get_all_user_em?.map((employee) => (
                      <option
                        key={employee.emplyeebarCode}
                        value={employee.emplyeebarCode}
                      >
                        {employee.emplyeebarCode} -{" "}
                        {employee.personalInfo?.fullName}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.emplyeebarCode}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.filtercheckIdcode}>
                  <FormLabel>ລະຫັດ Filtercheck</FormLabel>
                  <Input
                    name="filtercheckIdcode"
                    value={formData.filtercheckIdcode}
                    onChange={handleonChange}
                    placeholder="ປ້ອນລະຫັດ Filtercheck"
                    borderRadius="md"
                    size="lg"
                  />
                  <FormErrorMessage>
                    {errors.filtercheckIdcode}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.date}>
                  <FormLabel>ວັນທີ</FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleonChange}
                    borderRadius="md"
                    size="lg"
                  />
                  <FormErrorMessage>{errors.date}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.inTime}>
                  <FormLabel>ເວລາເຂົ້າວຽກ</FormLabel>
                  <Input
                    type="time"
                    name="inTime"
                    value={formData.inTime}
                    onChange={handleonChange}
                    borderRadius="md"
                    size="lg"
                  />
                  <FormErrorMessage>{errors.inTime}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.outTime}>
                  <FormLabel>ເວລາອອກວຽກ</FormLabel>
                  <Input
                    type="time"
                    name="outTime"
                    value={formData.outTime}
                    onChange={handleonChange}
                    borderRadius="md"
                    size="lg"
                  />
                  <FormErrorMessage>{errors.outTime}</FormErrorMessage>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={3}>
                <Button
                  variant="outline"
                  onClick={onClose}
                  borderRadius="md"
                  size="md"
                >
                  ຍົກເລີກ
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={handleSaveAdd}
                  borderRadius="md"
                  size="md"
                  leftIcon={<PiUserCirclePlusFill />}
                >
                  ບັນທຶກ
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit OT Modal */}
        <Modal isOpen={eidtIsOpen} onClose={editClose} size="lg">
          <ModalOverlay />
          <ModalContent borderRadius="xl" bg={cardBg}>
            <ModalHeader bg={headerBg} borderRadius="xl 0 0 0">
              <HStack>
                <Edit2Icon size={20} />
                <Text fontWeight="bold">ແກ້ໄຂຂໍ້ມູນ OT</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody p={6}>
              <VStack spacing={5}>
                <FormControl isInvalid={errorsEdit.emplyeebarCode}>
                  <FormLabel>ລະຫັດພະນັກງານ</FormLabel>
                  <Select
                    name="emplyeebarCode"
                    value={formEdit.emplyeebarCode}
                    onChange={handleonChangeEdit}
                    placeholder="ເລືອກລະຫັດພະນັກງານ"
                    borderRadius="md"
                    size="lg"
                  >
                    {get_all_user_em?.map((employee) => (
                      <option
                        key={employee.emplyeebarCode}
                        value={employee.emplyeebarCode}
                      >
                        {employee.emplyeebarCode} -{" "}
                        {employee.personalInfo?.fullName}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>
                    {errorsEdit.emplyeebarCode}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errorsEdit.filtercheckIdcode}>
                  <FormLabel>ລະຫັດ Filtercheck</FormLabel>
                  <Input
                    name="filtercheckIdcode"
                    value={formEdit.filtercheckIdcode}
                    onChange={handleonChangeEdit}
                    placeholder="ປ້ອນລະຫັດ Filtercheck"
                    borderRadius="md"
                    size="lg"
                  />
                  <FormErrorMessage>
                    {errorsEdit.filtercheckIdcode}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errorsEdit.date}>
                  <FormLabel>ວັນທີ</FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={formEdit.date}
                    onChange={handleonChangeEdit}
                    borderRadius="md"
                    size="lg"
                  />
                  <FormErrorMessage>{errorsEdit.date}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errorsEdit.inTime}>
                  <FormLabel>ເວລາເຂົ້າວຽກ</FormLabel>
                  <Input
                    type="time"
                    name="inTime"
                    value={formEdit.inTime}
                    onChange={handleonChangeEdit}
                    borderRadius="md"
                    size="lg"
                  />
                  <FormErrorMessage>{errorsEdit.inTime}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>ເວລາອອກວຽກ</FormLabel>
                  <Input
                    type="time"
                    name="outTime"
                    value={formEdit.outTime}
                    onChange={handleonChangeEdit}
                    borderRadius="md"
                    size="lg"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup spacing={3}>
                <Button
                  variant="outline"
                  onClick={editClose}
                  borderRadius="md"
                  size="md"
                >
                  ຍົກເລີກ
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleEditAdd}
                  borderRadius="md"
                  size="md"
                  leftIcon={<Edit2Icon />}
                >
                  ບັນທຶກ
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default AddFileWorkTime;
