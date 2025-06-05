import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Grid,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Text,
  Select,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  RadioGroup,
  Radio,
  FormErrorMessage,
  Spinner,
  Divider,
  Stack,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Flex,
  IconButton,
  Center,
  useColorModeValue,
  Tooltip,
  Alert,
  AlertIcon,
  useBreakpointValue,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { get_all_user } from "../store/Reducer/Auth/auth";
import {
  getAllSalary,
  getSalary,
  getTax,
  messageClear,
  postsalary,
} from "../store/Reducer/HRReducer/salaryReducer";
import toast from "react-hot-toast";
import { DeleteIcon, AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const CalculateSalary = () => {
  // Redux state management
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { get_all_user_em, loader: userLoading } = useSelector(
    (state) => state.auth
  );
  const {
    getAllSalaries,
    getTaxeis,
    loader: salaryLoading,
    successMessage,
    errorMessage,
    getSalaries,
  } = useSelector((state) => state.salary);

  // Local state management
  const [montheris, setMontheris] = useState(0);
  const [yearseris, setYearseris] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState("");
  const [dataIncome, setDataIncome] = useState([]);
  const [dataExpense, setDataExpense] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [incomeItems, setIncomeItems] = useState({
    emcode: 0,
    basicSalary: 0,
    salaryfirst: 0,
    socialSecurity: [],
    personalInfo: [],
    month: 0,
    year: 0,
    benitfits: [],
    calculateTimeLateHour: 0,
    calculateTimeLateMinute: 0,
    calculateTimeOThour: 0,
    calculateTimeOTminute: 0,
  });

  // UI Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const headerColor = useColorModeValue("blue.700", "blue.200");
  const inputBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue("gray.300", "gray.500");

  // Responsive layout
  const columnTemplate = useBreakpointValue({ base: "1fr", md: "1fr 1fr" });
  const stackDirection = useBreakpointValue({ base: "column", sm: "row" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const headerSize = useBreakpointValue({ base: "lg", md: "xl" });
  const cardSpacing = useBreakpointValue({ base: 2, md: 4 });
  const fontSize = useBreakpointValue({ base: "sm", md: "md" });

  const hasSalary = getSalaries.some(
    (salary) => Number(salary?.month) === Number(montheris)
  );
  const block = hasSalary;

  const [formData, setFormData] = useState({
    emcode: 0,
    itemName: "",
    amount: "",
    type: "income",
  });

  // Compute getsalary with useMemo
  const getsalary = useMemo(() => {
    return getAllSalaries?.filter(
      (item) =>
        item.emplyeecode === Number(selectedEmployee) &&
        item.month === Number(montheris) &&
        item.year === Number(yearseris)
    );
  }, [getAllSalaries, selectedEmployee, montheris, yearseris]);

  const handleSelect = (e) => {
    setSelectedEmployee(e.target.value);
    setIncomeItems({
      emcode: 0,
      basicSalary: 0,
      salaryfirst: 0,
      socialSecurity: [],
      personalInfo: [],
      month: 0,
      year: 0,
    });
  };

  // Data fetching
  useEffect(() => {
    dispatch(get_all_user());
    dispatch(getAllSalary());
    dispatch(getTax());
    dispatch(getSalary());
  }, [dispatch]);

  // Reset dataIncome and dataExpense
  useEffect(() => {
    setDataIncome([]);
    setDataExpense([]);
  }, [selectedEmployee]);

  // Update incomeItems
  useEffect(() => {
    if (getsalary?.length > 0) {
      setIncomeItems({
        emcode: getsalary[0]?.emplyeecode || 0,
        basicSalary: getsalary[0]?.baseSalary || 0,
        salaryfirst: getsalary[0]?.salaryfirst || 0,
        socialSecurity: getsalary[0]?.socialSecurity || [],
        personalInfo: getsalary[0]?.personalInfo || [],
        month: getsalary[0]?.month || 0,
        year: getsalary[0]?.year || 0,
        calculateTimeLateHour: getsalary[0]?.calculateTimeLateHour,
        calculateTimeLateMinute: getsalary[0]?.calculateTimeLateMinute,
        calculateTimeOThour: getsalary[0]?.calculateTimeOThour,
        calculateTimeOTminute: getsalary[0]?.calculateTimeOTminute,
        benitfits: getsalary[0]?.bennifits || [],
      });
    }
  }, [getsalary]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.itemName.trim()) errors.itemName = "Item name is required";
    if (!formData.amount || formData.amount <= 0)
      errors.amount = "Valid amount is required";
    return errors;
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newItem = {
      itemName: formData.itemName,
      amount: parseFloat(formData.amount),
    };

    if (formData.type === "income") {
      setDataIncome((prev) => [...prev, newItem]);
    } else {
      setDataExpense((prev) => [...prev, newItem]);
    }

    onClose();
    setFormData({ itemName: "", amount: "", type: "income" });
  };

  // Salary calculations
  let NetIncome = 0;
  let NetExpense = 0;
  let NetBennifits = 0;
  dataIncome.forEach((item) => {
    NetIncome += parseFloat(item.amount) || 0;
  });

  dataExpense.forEach((item) => {
    NetExpense += parseFloat(item.amount) || 0;
  });

  incomeItems?.benitfits?.forEach((item) => {
    NetBennifits += parseFloat(item.amount) || 0;
  });

  let Net = 0;
  let socialSecurityMoney = 0;

  if (incomeItems?.socialSecurity?.length > 0) {
    for (let index = 0; index < incomeItems.socialSecurity.length; index++) {
      socialSecurityMoney +=
        (incomeItems.salaryfirst + NetIncome - NetExpense) *
        (incomeItems.socialSecurity[index].rate / 100);
    }
  }

  Net =
    incomeItems?.salaryfirst +
    NetIncome +
    NetBennifits -
    NetExpense -
    socialSecurityMoney;

  // Find tax bracket
  const matchedRange = getTaxeis?.find(
    (range) => Net >= range?.minAmount && Net < range?.maxAmount
  );

  // Calculate tax
  let taxpay = 0;
  if (getTaxeis) {
    for (const bracket of getTaxeis) {
      if (Net > bracket.minAmount) {
        const taxableAmount =
          Math.min(Net, bracket.maxAmount) - bracket.minAmount;
        taxpay += taxableAmount * (bracket.rate / 100);
      }
    }
  }

  const deleteExpense = (index) => {
    setDataExpense((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteIncome = (index) => {
    setDataIncome((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSalary = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee before saving");
      return;
    }

    if (!date) {
      toast.error("Please select a payment date");
      return;
    }

    const salaryData = {
      employeeCode: selectedEmployee,
      date: date,
      year: incomeItems?.year,
      month: incomeItems?.month,
      personalInfo: incomeItems?.personalInfo,
      basicSalary: incomeItems?.basicSalary,
      salaryFirst: incomeItems?.salaryfirst,
      incomeItems: dataIncome,
      expenseItems: dataExpense,
      netIncome: NetIncome,
      netExpense: NetExpense,
      NetBennifits: NetBennifits,
      socialSecurity: getsalary[0]?.socialSecurity || [],
      socialSecurityMoney: socialSecurityMoney,
      tax: taxpay,
      totalTimeLate : (incomeItems?.calculateTimeLateHour +  incomeItems?.calculateTimeLateMinute),
      totalTimeOt : (incomeItems?.calculateTimeOThour +  incomeItems?.calculateTimeOTminute),
      netSalary: Net - taxpay,
      taxBracket: matchedRange
        ? {
            minAmount: matchedRange?.minAmount,
            maxAmount: matchedRange?.maxAmount,
          }
        : null,
    };

    dispatch(postsalary(salaryData)).then(() => dispatch(getSalary()));
  };

  const year = Array.from(
    { length: 5 },
    (_, index) => new Date().getFullYear() - index
  );

  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  // Handle messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/hr/salary-calculation");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  // Loading state
  if (userLoading || salaryLoading) {
    return (
      <Flex justify="center" align="center" minH="100vh">
        <Center flexDirection="column">
          <Spinner size="lg" thickness="4px" speed="0.65s" color="blue.500" />
          <Text
            ml={4}
            fontSize={fontSize}
            fontFamily="Noto Sans Lao, sans-serif"
            mt={2}
          >
            ກຳລັງໂຫຼດຂໍ້ມູນ...
          </Text>
        </Center>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" px={{ base: 2, md: 4 }}>
      <MotionBox
        w="full"
        mx="auto"
        py={6}
        px={{ base: 3, md: 6 }}
        bg={cardBg}
        bgOpacity={0.95}
        borderRadius="2xl"
        boxShadow="md"
        borderWidth="1.5px"
        borderColor={borderColor}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MotionFlex
          direction="column"
          align="center"
          mb={6}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Heading
            fontFamily="Noto Sans Lao, sans-serif"
            as="h1"
            size={headerSize}
            textAlign="center"
            color={headerColor}
            mb={2}
            letterSpacing="0.5px"
          >
            ຄິດໄລ່ເງິນເດືອນ
          </Heading>
          <Divider
            width="100px"
            borderWidth="1.5px"
            borderColor={headerColor}
            my={2}
          />
        </MotionFlex>

        {/* Employee Selection */}
        <Card
          mb={cardSpacing}
          variant="outline"
          borderColor={borderColor}
          boxShadow="md"
          borderRadius="2xl"
        >
          <CardBody py={4}>
            <Stack direction={stackDirection} spacing={3} alignItems="stretch">
              <FormControl>
                <FormLabel
                  fontWeight="medium"
                  fontFamily="Noto Sans Lao, sans-serif"
                  fontSize={fontSize}
                  mb={1}
                >
                  ເລືອກພະນັກງານ
                </FormLabel>
                <Select
                  value={selectedEmployee}
                  onChange={handleSelect}
                  placeholder="Select employee"
                  isDisabled={!get_all_user_em?.length}
                  bg={inputBg}
                  borderRadius="lg"
                  height={{ base: "36px", md: "42px" }}
                  fontSize={fontSize}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px blue.400",
                  }}
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
              <FormControl>
                <FormLabel
                  fontFamily="Noto Sans Lao, sans-serif"
                  fontSize={fontSize}
                  mb={1}
                >
                  ເລືອກເດືອນ
                </FormLabel>
                <Select
                  value={montheris}
                  onChange={(e) => setMontheris(e.target.value)}
                  bg={inputBg}
                  borderRadius="lg"
                  height={{ base: "36px", md: "42px" }}
                  fontSize={fontSize}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px blue.400",
                  }}
                >
                  <option value="">ເລືອກເດືອນ</option>
                  {months.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel
                  fontFamily="Noto Sans Lao, sans-serif"
                  fontSize={fontSize}
                  mb={1}
                >
                  ເລືອກປິ
                </FormLabel>
                <Select
                  value={yearseris}
                  onChange={(e) => setYearseris(e.target.value)}
                  bg={inputBg}
                  borderRadius="lg"
                  height={{ base: "36px", md: "42px" }}
                  fontSize={fontSize}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px blue.400",
                  }}
                >
                  <option value="">ເລືອກປິ</option>
                  {year.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardBody>
        </Card>

        {selectedEmployee && getsalary?.length > 0 ? (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              mb={cardSpacing}
              variant="outline"
              borderColor={borderColor}
              boxShadow="md"
              borderRadius="2xl"
            >
              <CardHeader pb={2} borderTopRadius="2xl">
                <Heading
                  fontFamily="Noto Sans Lao, sans-serif"
                  size={{ base: "sm", md: "md" }}
                  color={headerColor}
                  textAlign="left"
                >
                  ຂໍ້ມູນເງິນເດືອນ
                </Heading>
              </CardHeader>

              <CardBody py={4}>
                <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                  {/* รายได้ */}
                  <VStack align="start" spacing={3}>
                    <Heading
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize="md"
                      color={headerColor}
                    >
                      ລາຍໄດ້
                    </Heading>
                    <Text
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontWeight="medium"
                      fontSize={fontSize}
                    >
                      ເງຶນເດືອນພື້ນຖານ:{" "}
                      <Badge
                        colorScheme="blue"
                        fontSize="0.9em"
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {incomeItems.basicSalary.toLocaleString()} ກີບ
                      </Badge>
                    </Text>

                    <Text
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontWeight="medium"
                      fontSize={fontSize}
                    >
                      ຫຼັງບວກລົບ OT:{" "}
                      <Badge
                        colorScheme="green"
                        fontSize="0.9em"
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {incomeItems.salaryfirst.toLocaleString()} ກີບ
                      </Badge>
                    </Text>

                    <Text
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontWeight="medium"
                      fontSize={fontSize}
                    >
                      ເງິນສິດທິພິເສດ:
                    </Text>
                    {incomeItems?.benitfits?.length > 0 ? (
                      incomeItems.benitfits.map((i, index) => (
                        <Box
                          key={index}
                          p={3}
                          borderWidth="1px"
                          borderRadius="lg"
                          bg={inputBg}
                          mb={2}
                        >
                          <Flex align="center" justify="space-between">
                            <Box>
                              <Text fontSize="sm" fontWeight="medium">
                                {i.name}{" "}
                                <Badge
                                  colorScheme="purple"
                                  ml={2}
                                  borderRadius="full"
                                >
                                  {i.type}
                                </Badge>
                              </Text>
                            </Box>
                            <Text
                              fontSize="sm"
                              fontWeight="bold"
                              color="green.600"
                            >
                              {i.amount.toLocaleString()} ກີບ
                            </Text>
                          </Flex>
                        </Box>
                      ))
                    ) : (
                      <Text color="gray.500" fontSize="sm" pl={4}>
                        ບໍ່ມີສິດທິພິເສດ
                      </Text>
                    )}

                    <Text fontWeight="bold">
                      ລວມສິດທິ: {NetBennifits.toLocaleString()} ກີບ
                    </Text>

                    {matchedRange && (
                      <Text
                        fontFamily="Noto Sans Lao, sans-serif"
                        fontSize={fontSize}
                      >
                        ຂັ້ນອາກອນ:{" "}
                        <Badge
                          colorScheme="purple"
                          fontSize="0.9em"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          {matchedRange.minAmount.toLocaleString()} -{" "}
                          {matchedRange.maxAmount.toLocaleString()}
                        </Badge>
                      </Text>
                    )}
                  </VStack>

                  {/* รายการຫັກ */}
                  <VStack align="start" spacing={3}>
                    <Heading
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize="md"
                      color={headerColor}
                    >
                      ລາຍຈ່າຍຫັກ
                    </Heading>
                    <HStack>
                      <Text
                        fontWeight="medium"
                        fontFamily="Noto Sans Lao, sans-serif"
                        fontSize={fontSize}
                      >
                        ປະກັນສັງຄົມ:
                      </Text>
                      {getsalary[0]?.socialSecurity?.length > 0 ? (
                        getsalary[0].socialSecurity.map((item, index) => (
                          <Text key={index} fontSize="sm">
                            ({item?.type}): {item?.rate.toLocaleString()}%
                          </Text>
                        ))
                      ) : (
                        <Text color="gray.500" fontSize="sm">
                          ບໍ່ມີຂໍ້ມູນ
                        </Text>
                      )}
                    </HStack>
                    <Text fontWeight="bold">
                      ລວມຫັກ: {socialSecurityMoney.toLocaleString()} ກີບ
                    </Text>
                    <Card
                      mb={cardSpacing}
                      variant="outline"
                      borderColor={borderColor}
                      boxShadow="md"
                      borderRadius="2xl"
                    >
                      <CardHeader pb={2} borderTopRadius="2xl">
                        <Heading
                          fontFamily="Noto Sans Lao, sans-serif"
                          size={{ base: "sm", md: "md" }}
                          color={headerColor}
                          textAlign="left"
                        >
                          ຂໍ້ມູນເວລາຄ່າແຮງ
                        </Heading>
                      </CardHeader>
                      <CardBody py={4}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          {/* Time Late */}
                          <Box
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            bg={inputBg}
                          >
                            <Text
                              fontFamily="Noto Sans Lao, sans-serif"
                              fontWeight="medium"
                              mb={2}
                              fontSize={fontSize}
                            >
                              ສາຍ (Late)
                            </Text>
                            <HStack spacing={3}>
                              <Badge
                                colorScheme="red"
                                borderRadius="full"
                                px={3}
                                py={1}
                              >
                                ຊົ່ວໂມງ: -{incomeItems.calculateTimeLateHour}
                              </Badge>
                              <Badge
                                colorScheme="red"
                                borderRadius="full"
                                px={3}
                                py={1}
                              >
                                ນາທີ: -{incomeItems.calculateTimeLateMinute}
                              </Badge>
                            </HStack>
                          </Box>

                          {/* OT */}
                          <Box
                            p={4}
                            borderWidth="1px"
                            borderRadius="lg"
                            bg={inputBg}
                          >
                            <Text
                              fontFamily="Noto Sans Lao, sans-serif"
                              fontWeight="medium"
                              mb={2}
                              fontSize={fontSize}
                            >
                              ຄ່າ OT (ເວລາເຮັດວຽກເພີ່ມ)
                            </Text>
                            <HStack spacing={3}>
                              <Badge
                                colorScheme="green"
                                borderRadius="full"
                                px={3}
                                py={1}
                              >
                                ຊົ່ວໂມງ: +{incomeItems.calculateTimeOThour}
                              </Badge>
                              <Badge
                                colorScheme="green"
                                borderRadius="full"
                                px={3}
                                py={1}
                              >
                                ນາທີ: +{incomeItems.calculateTimeOTminute}
                              </Badge>
                            </HStack>
                          </Box>
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  </VStack>
                </Grid>

                <Divider my={4} borderWidth="1.5px" borderColor={headerColor} />

                <FormControl>
                  <FormLabel
                    fontWeight="medium"
                    fontFamily="Noto Sans Lao, sans-serif"
                    fontSize={fontSize}
                  >
                    ເລືອກວັນທີ່ເບີກຈ່າຍ
                  </FormLabel>
                  <Input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    bg={inputBg}
                    borderRadius="lg"
                    height={{ base: "36px", md: "42px" }}
                    fontSize={fontSize}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px blue.400",
                    }}
                  />
                </FormControl>
              </CardBody>
            </Card>

            {/* Income & Expense Items */}
            <Grid
              templateColumns={columnTemplate}
              gap={{ base: 2, md: 4 }}
              mb={cardSpacing}
            >
              {/* Income Items */}
              <Card
                variant="outline"
                borderColor={borderColor}
                boxShadow="md"
                borderRadius="2xl"
                minH="200px"
              >
                {block ? (
                  <Alert status="warning" mt={2} borderRadius="lg" py={2}>
                    <AlertIcon />
                    <Text
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize={fontSize}
                    >
                      ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                    </Text>
                  </Alert>
                ) : (
                  <CardHeader pb={1} borderTopRadius="2xl">
                    <Flex justify="space-between" align="center">
                      <Heading
                        fontFamily="Noto Sans Lao, sans-serif"
                        size={{ base: "sm", md: "md" }}
                        color="green.400"
                      >
                        ລາຍການລາຍໄດ້
                      </Heading>
                      <Tooltip label="Add income item" hasArrow>
                        <IconButton
                          icon={<AddIcon />}
                          colorScheme="green"
                          variant="solid"
                          size="md"
                          borderRadius="full"
                          onClick={() => {
                            setFormData({ ...formData, type: "income" });
                            onOpen();
                          }}
                          aria-label="Add income"
                          touchAction="manipulation"
                        />
                      </Tooltip>
                    </Flex>
                  </CardHeader>
                )}
                <CardBody py={4}>
                  {dataIncome.length > 0 ? (
                    <VStack align="start" spacing={2} w="full">
                      {dataIncome.map((item, index) => (
                        <Flex
                          key={index}
                          justify="space-between"
                          w="full"
                          p={2}
                          borderRadius="lg"
                        >
                          <Text
                            fontFamily="Noto Sans Lao, sans-serif"
                            fontSize={fontSize}
                          >
                            {item.itemName}
                          </Text>
                          <Flex align="center">
                            <Text fontWeight="medium" color="green.400" mr={2}>
                              +{item.amount.toLocaleString()}
                            </Text>
                            <IconButton
                              onClick={() => deleteIncome(index)}
                              icon={<DeleteIcon />}
                              size="md"
                              colorScheme="red"
                              variant="ghost"
                              aria-label="Delete income item"
                              touchAction="manipulation"
                            />
                          </Flex>
                        </Flex>
                      ))}
                      <Divider
                        my={2}
                        borderWidth="1.5px"
                        borderColor={headerColor}
                      />
                      <Flex justify="space-between" w="full" p={2}>
                        <Text
                          fontWeight="bold"
                          fontFamily="Noto Sans Lao, sans-serif"
                          fontSize={fontSize}
                        >
                          ລວມລາຍການໄດ້:
                        </Text>
                        <Text fontWeight="bold" color="green.400">
                          {NetIncome.toLocaleString()} ກີບ
                        </Text>
                      </Flex>
                    </VStack>
                  ) : block ? (
                    <Alert status="warning" mt={2} borderRadius="lg" py={2}>
                      <AlertIcon />
                      <Text
                        fontFamily="Noto Sans Lao, sans-serif"
                        fontSize={fontSize}
                      >
                        ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                      </Text>
                    </Alert>
                  ) : (
                    <Center py={4} flexDirection="column">
                      <Text color="gray.500" mb={2} fontSize={fontSize}>
                        No income items added
                      </Text>
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="green"
                        variant="solid"
                        size={buttonSize}
                        borderRadius="full"
                        onClick={() => {
                          setFormData({ ...formData, type: "income" });
                          onOpen();
                        }}
                        touchAction="manipulation"
                      >
                        Add Income
                      </Button>
                    </Center>
                  )}
                </CardBody>
              </Card>

              {/* Expense Items */}
              <Card
                variant="outline"
                borderColor={borderColor}
                boxShadow="md"
                borderRadius="2xl"
                minH="200px"
              >
                {block ? (
                  <Alert status="warning" mt={2} borderRadius="lg" py={2}>
                    <AlertIcon />
                    <Text
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize={fontSize}
                    >
                      ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                    </Text>
                  </Alert>
                ) : (
                  <CardHeader pb={1} borderTopRadius="2xl">
                    <Flex justify="space-between" align="center">
                      <Heading
                        fontFamily="Noto Sans Lao, sans-serif"
                        size={{ base: "sm", md: "md" }}
                        color="red.400"
                      >
                        ລາຍການຫັກ
                      </Heading>
                      <Tooltip label="Add expense item" hasArrow>
                        <IconButton
                          icon={<AddIcon />}
                          colorScheme="red"
                          variant="solid"
                          size="md"
                          borderRadius="full"
                          onClick={() => {
                            setFormData({ ...formData, type: "deduction" });
                            onOpen();
                          }}
                          aria-label="Add expense"
                          touchAction="manipulation"
                        />
                      </Tooltip>
                    </Flex>
                  </CardHeader>
                )}
                <CardBody py={4}>
                  {dataExpense.length > 0 ? (
                    <VStack align="start" spacing={2} w="full">
                      {dataExpense.map((item, index) => (
                        <Flex
                          key={index}
                          justify="space-between"
                          w="full"
                          p={2}
                          borderRadius="lg"
                        >
                          <Text
                            fontFamily="Noto Sans Lao, sans-serif"
                            fontSize={fontSize}
                          >
                            {item.itemName}
                          </Text>
                          <Flex align="center">
                            <Text fontWeight="medium" color="red.400" mr={2}>
                              -{item.amount.toLocaleString()}
                            </Text>
                            <IconButton
                              onClick={() => deleteExpense(index)}
                              icon={<DeleteIcon />}
                              size="md"
                              colorScheme="red"
                              variant="ghost"
                              aria-label="Delete expense item"
                              touchAction="manipulation"
                            />
                          </Flex>
                        </Flex>
                      ))}
                      <Divider
                        my={2}
                        borderWidth="1.5px"
                        borderColor={headerColor}
                      />
                      <Flex justify="space-between" w="full" p={2}>
                        <Text
                          fontWeight="bold"
                          fontFamily="Noto Sans Lao, sans-serif"
                          fontSize={fontSize}
                        >
                          ລວມລາຍການຫັກ:
                        </Text>
                        <Text fontWeight="bold" color="red.400">
                          {NetExpense.toLocaleString()} ກີບ
                        </Text>
                      </Flex>
                    </VStack>
                  ) : block ? (
                    <Alert status="warning" mt={2} borderRadius="lg" py={2}>
                      <AlertIcon />
                      <Text
                        fontFamily="Noto Sans Lao, sans-serif"
                        fontSize={fontSize}
                      >
                        ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                      </Text>
                    </Alert>
                  ) : (
                    <Center py={4} flexDirection="column">
                      <Text color="gray.500" mb={2} fontSize={fontSize}>
                        No expense items added
                      </Text>
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="red"
                        variant="solid"
                        size={buttonSize}
                        borderRadius="full"
                        onClick={() => {
                          setFormData({ ...formData, type: "deduction" });
                          onOpen();
                        }}
                        touchAction="manipulation"
                      >
                        Add Expense
                      </Button>
                    </Center>
                  )}
                </CardBody>
              </Card>
            </Grid>

            {/* Summary */}
            {/* Payment Date Warning */}
            {!date && (
              <Alert status="warning" mt={2} borderRadius="lg" py={2}>
                <AlertIcon />
                <Text
                  fontFamily="Noto Sans Lao, sans-serif"
                  fontSize={fontSize}
                >
                  ກະລຸນາເລືອກວັນທີ່ເບີກຈ່າຍກ່ອນບັນທຶກ
                </Text>
              </Alert>
            )}
            <Card
              variant="filled"
              bgGradient="linear(to-b, blue.100, blue.200)"
              mb={cardSpacing}
              borderRadius="2xl"
            >
              <CardHeader
                pb={2}
                borderBottom="1.5px solid"
                borderColor={borderColor}
              >
                <Heading
                  size={{ base: "sm", md: "md" }}
                  fontFamily="Noto Sans Lao, sans-serif"
                >
                  ສະຫຼຸບເງິນເດືອນ
                </Heading>
              </CardHeader>
              <CardBody py={4}>
                <Stack spacing={3}>
                  <Flex justify="space-between" align="center">
                    <Text
                      fontWeight="medium"
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize={fontSize}
                    >
                      ເງິນເດືອນພື້ນຖານ:
                    </Text>
                    <Badge
                      colorScheme="blue"
                      fontSize={{ base: "sm", md: "md" }}
                      p={2}
                      borderRadius="lg"
                      variant="subtle"
                    >
                      {incomeItems.basicSalary.toLocaleString()} ກີບ
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text
                      fontWeight="medium"
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize={fontSize}
                    >
                      ເງິນເດືອນຫຼັງບວກຄ່າລ່ວງເວລາ:
                    </Text>
                    <Badge
                      colorScheme="blue"
                      fontSize={{ base: "sm", md: "md" }}
                      p={2}
                      borderRadius="lg"
                      variant="subtle"
                    >
                      {incomeItems.salaryfirst.toLocaleString()} ກີບ
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text
                      fontWeight="medium"
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize={fontSize}
                    >
                      ເງິນຄ່າສິດທິປະໂຫຍດ:
                    </Text>
                    <Badge
                      colorScheme="blue"
                      fontSize={{ base: "sm", md: "md" }}
                      p={2}
                      borderRadius="lg"
                      variant="subtle"
                    >
                      {NetBennifits.toLocaleString()} ກີບ
                    </Badge>
                  </Flex>
                  <Flex justify="space-between" align="center">
                    <Text
                      fontWeight="medium"
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize={fontSize}
                    >
                      ເງິນເດືອນກ່ອນຫັກອາກອນ:
                    </Text>
                    <Badge
                      colorScheme="blue"
                      fontSize={{ base: "sm", md: "md" }}
                      p={2}
                      borderRadius="lg"
                      variant="subtle"
                    >
                      {Net.toLocaleString()} ກີບ
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text
                      fontWeight="medium"
                      fontFamily="Noto Sans Lao, sans-serif"
                      fontSize={fontSize}
                    >
                      ອາກອນລາຍໄດ້ທີ່ຕ້ອງຈ່າຍ:
                    </Text>
                    <Badge
                      colorScheme="red"
                      fontSize={{ base: "sm", md: "md" }}
                      p={2}
                      borderRadius="lg"
                      variant="subtle"
                    >
                      {taxpay.toLocaleString()} ກີບ
                    </Badge>
                  </Flex>

                  <Divider borderWidth="1.5px" borderColor={headerColor} />

                  <Flex
                    justify="space-between"
                    align="center"
                    p={3}
                    borderRadius="lg"
                  >
                    <Text
                      fontWeight="bold"
                      fontSize={{ base: "md", md: "lg" }}
                      fontFamily="Noto Sans Lao, sans-serif"
                    >
                      ເງິນເດືອນສຸດທິ:
                    </Text>
                    <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
                      {(Net - taxpay).toLocaleString()} ກີບ
                    </Text>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>

            {/* Save Button */}
            {block ? (
              <Alert status="warning" mt={2} borderRadius="lg" py={2}>
                <AlertIcon />
                <Text
                  fontFamily="Noto Sans Lao, sans-serif"
                  fontSize={fontSize}
                >
                  ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                </Text>
              </Alert>
            ) : (
              <Button
                onClick={handleSaveSalary}
                colorScheme="blue"
                bgGradient="linear(to-r, blue.500, blue.600)"
                size={buttonSize}
                w="full"
                h={{ base: "40px", md: "48px" }}
                fontFamily="Noto Sans Lao, sans-serif"
                fontWeight="semibold"
                textTransform="uppercase"
                boxShadow="md"
                leftIcon={<CheckCircleIcon />}
                _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
                transition="all 0.2s"
                isDisabled={block}
                touchAction="manipulation"
                _focus={{ outline: "2px solid", outlineColor: "blue.400" }}
              >
                ບັນທຶກເງິນເດືອນ
              </Button>
            )}
          </MotionBox>
        ) : (
          selectedEmployee && (
            <Alert
              status="info"
              borderRadius="lg"
              variant="left-accent"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              py={4}
            >
              <AlertIcon boxSize="30px" mr={0} mb={3} />
              <Text
                fontFamily="Noto Sans Lao, sans-serif"
                fontSize={{ base: "md", md: "lg" }}
              >
                ບໍ່ພົບຂໍ້ມູນເງິນເດືອນ ສຳລັບພະນັກງານລະຫັດ {selectedEmployee}
              </Text>
              <Text
                color="gray.500"
                mt={2}
                fontFamily="Noto Sans Lao, sans-serif"
                fontSize={fontSize}
              >
                ກະລຸນາເລືອກເດືອນ ແລະ ປີ ທີ່ຕ້ອງການຄິດໄລ່
              </Text>
            </Alert>
          )
        )}

        {/* Add Item Modal */}
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={{ base: "xs", sm: "sm", md: "md" }}
          isCentered
        >
          <ModalOverlay backdropFilter="blur(2px)" />
          <ModalContent borderRadius="lg" maxH="80vh" overflowY="auto">
            <ModalHeader
              fontFamily="Noto Sans Lao, sans-serif"
              bgGradient={
                formData.type === "income"
                  ? "linear(to-b, green.50, green.100)"
                  : "linear(to-b, red.50, red.100)"
              }
              borderTopRadius="lg"
              borderBottom="1.5px solid"
              borderColor={borderColor}
            >
              {formData.type === "income"
                ? "ເພີ່ມລາຍການລາຍໄດ້"
                : "ເພີ່ມລາຍການລາຍຫັກ"}
            </ModalHeader>
            <ModalCloseButton size="lg" />
            <ModalBody pt={4}>
              <VStack spacing={3}>
                <FormControl isInvalid={formErrors.itemName}>
                  <FormLabel
                    fontFamily="Noto Sans Lao, sans-serif"
                    fontWeight="medium"
                    fontSize={fontSize}
                    mb={1}
                  >
                    ຊື່ລາຍການ
                  </FormLabel>
                  <Input
                    type="text"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleFormChange}
                    placeholder="ຊື່ລາຍການ"
                    bg={inputBg}
                    borderRadius="lg"
                    height={{ base: "36px", md: "42px" }}
                    fontSize={fontSize}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px blue.400",
                    }}
                  />
                  <FormErrorMessage>{formErrors.itemName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formErrors.amount}>
                  <FormLabel
                    fontFamily="Noto Sans Lao, sans-serif"
                    fontWeight="medium"
                    fontSize={fontSize}
                    mb={1}
                  >
                    ຈຳນວນເງິນ
                  </FormLabel>
                  <Input
                    type="number"
                    name="amount"
                    placeholder="ຈຳນວນເງິນເປັນກີບ"
                    value={formData.amount}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    bg={inputBg}
                    borderRadius="lg"
                    height={{ base: "36px", md: "42px" }}
                    fontSize={fontSize}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px blue.400",
                    }}
                  />
                  <FormErrorMessage>{formErrors.amount}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontFamily="Noto Sans Lao, sans-serif"
                    fontWeight="medium"
                    fontSize={fontSize}
                    mb={1}
                  >
                    ປະເພດ
                  </FormLabel>
                  <RadioGroup
                    name="type"
                    value={formData.type}
                    onChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <Stack direction={stackDirection} spacing={3}>
                      <Radio value="income" colorScheme="green" size="md">
                        <Text
                          fontFamily="Noto Sans Lao, sans-serif"
                          fontSize={fontSize}
                        >
                          ລາຍໄດ້
                        </Text>
                      </Radio>
                      <Radio value="deduction" colorScheme="red" size="md">
                        <Text
                          fontFamily="Noto Sans Lao, sans-serif"
                          fontSize={fontSize}
                        >
                          ລາຍຫັກ
                        </Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter
              borderTop="1.5px solid"
              borderColor={borderColor}
              gap={2}
            >
              <Button
                variant="outline"
                onClick={onClose}
                fontFamily="Noto Sans Lao, sans-serif"
                size={buttonSize}
                w="full"
                touchAction="manipulation"
                _focus={{ outline: "2px solid", outlineColor: "blue.400" }}
              >
                ຍົກເລີກ
              </Button>

              <Button
                colorScheme={formData.type === "income" ? "green" : "red"}
                bgGradient={
                  formData.type === "income"
                    ? "linear(to-r, green.400, green.500)"
                    : "linear(to-r, red.400, red.500)"
                }
                onClick={handleSubmit}
                fontFamily="Noto Sans Lao, sans-serif"
                size={buttonSize}
                w="full"
                touchAction="manipulation"
                _focus={{ outline: "2px solid", outlineColor: "blue.400" }}
              >
                ບັນທຶກລາຍການ
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </MotionBox>
    </Container>
  );
};

export default CalculateSalary;
