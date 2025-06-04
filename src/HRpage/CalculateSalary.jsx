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
  });

  // UI Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const summaryCardBg = useColorModeValue("blue.50", "blue.900");
  const headerColor = useColorModeValue("blue.600", "blue.300");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Responsive layout
  const columnTemplate = useBreakpointValue({ base: "1fr", md: "1fr 1fr" });
  const stackDirection = useBreakpointValue({ base: "column", md: "row" });
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const headerSize = useBreakpointValue({ base: "md", md: "xl" });
  const cardSpacing = useBreakpointValue({ base: 4, md: 6 });

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

  // Compute getsalary with useMemo to prevent re-computation on every render
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
console.log(incomeItems)
  // Data fetching on component mount
  useEffect(() => {
    dispatch(get_all_user());
    dispatch(getAllSalary()); ////success for print
    dispatch(getTax());
    dispatch(getSalary());
  }, [dispatch]);

  // Reset dataIncome and dataExpense when selectedEmployee changes
  useEffect(() => {
    setDataIncome([]);
    setDataExpense([]);
  }, [selectedEmployee]);

  // Update incomeItems when getsalary changes
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
        benitfits: getsalary?.bennifits || 0,
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

  dataIncome.forEach((item) => {
    NetIncome += parseFloat(item.amount) || 0;
  });

  dataExpense.forEach((item) => {
    NetExpense += parseFloat(item.amount) || 0;
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

  Net = incomeItems?.salaryfirst + NetIncome - NetExpense - socialSecurityMoney;

  // Find tax bracket
  const matchedRange = getTaxeis?.find(
    (range) => Net >= range?.minAmount && Net < range?.maxAmount
  );

  // Calculate tax (progressive tax calculation)
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
      socialSecurity: getsalary[0]?.socialSecurity || [],
      socialSecurityMoney: socialSecurityMoney,
      tax: taxpay,
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

  ///successMessage errorMessage
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
      <Flex justify="center" align="center" height="100vh">
        <Center>
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          <Text ml={4} fontSize="lg" fontFamily="Noto Sans Lao, serif">
            ກຳລັງໂຫຼດຂໍ້ມູນ...
          </Text>
        </Center>
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" px={{ base: 2, md: 6 }}>
      <MotionBox
        w="full"
        mx="auto"
        py={8}
        px={{ base: 4, md: 8 }}
        bg={cardBg}
        borderRadius="xl"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={borderColor}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MotionFlex
          direction="column"
          align="center"
          mb={8}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Heading
            fontFamily="Noto Sans Lao, serif"
            as="h1"
            size={headerSize}
            textAlign="center"
            color={headerColor}
            mb={2}
          >
            ຄິດໄລ່ເງິນເດືອນ
          </Heading>
          <Divider width="100px" borderWidth="2px" borderColor={headerColor} />
        </MotionFlex>

        {/* Employee Selection */}
        <Card
          mb={cardSpacing}
          variant="outline"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <CardBody>
            <Stack direction={stackDirection} spacing={4}>
              <FormControl>
                <FormLabel
                  fontWeight="medium"
                  fontFamily="Noto Sans Lao, serif"
                >
                  ເລືອກພະນັກງານ
                </FormLabel>
                <Select
                  value={selectedEmployee}
                  onChange={handleSelect}
                  placeholder="Select employee"
                  isDisabled={!get_all_user_em?.length}
                  bg={inputBg}
                  borderRadius="md"
                  height="42px"
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
                <FormLabel fontFamily="Noto Sans Lao, serif">
                  ເລືອກເດືອນ
                </FormLabel>
                <Select
                  value={montheris}
                  onChange={(e) => setMontheris(e.target.value)}
                  bg={inputBg}
                  borderRadius="md"
                  height="42px"
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
                <FormLabel fontFamily="Noto Sans Lao, serif">ເລືອກປິ</FormLabel>
                <Select
                  value={yearseris}
                  onChange={(e) => setYearseris(e.target.value)}
                  bg={inputBg}
                  borderRadius="md"
                  height="42px"
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
            transition={{ delay: 0.3 }}
          >
            {/* Salary Information */}
            <Card
              mb={cardSpacing}
              variant="outline"
              borderColor={borderColor}
              boxShadow="sm"
            >
              <CardHeader pb={0} borderTopRadius="md">
                <Heading
                  fontFamily="Noto Sans Lao, serif"
                  size="md"
                  color={headerColor}
                >
                  ຂໍ້ມູນເງິນເດືອນ
                </Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={columnTemplate} gap={6}>
                  {/* Base Salary Info */}
                  <VStack align="start" spacing={3}>
                    <Text fontFamily="Noto Sans Lao, serif" fontWeight="medium">
                      ເງຶນເດືອນພື້ນຖານ:{" "}
                      <Badge
                        colorScheme="blue"
                        fontSize="0.9em"
                        borderRadius="full"
                        px={2}
                        py={0.5}
                      >
                        {incomeItems.basicSalary.toLocaleString()} ກີບ
                      </Badge>
                    </Text>
                    <Text fontFamily="Noto Sans Lao, serif" fontWeight="medium">
                      ເງິນເດືອນຫຼັງບວກລົບOT:{" "}
                      <Badge
                        colorScheme="green"
                        fontSize="0.9em"
                        borderRadius="full"
                        px={2}
                        py={0.5}
                      >
                        {incomeItems.salaryfirst.toLocaleString()} ກີບ
                      </Badge>
                    </Text>
                    <Text fontFamily="Noto Sans Lao, serif" fontWeight="medium">
                      ເງິນສິດທິພິເສດປະໂຫຍດ:{" "}
                      <Badge
                        colorScheme="green"
                        fontSize="0.9em"
                        borderRadius="full"
                        px={2}
                        py={0.5}
                      >
                        {/* {incomeItems?.benitfits?.map((i,index)=>(
                          <Text>{i?.amount}</Text>
                        ))} ກີບ */}
                      </Badge>
                    </Text>
                    <Text fontFamily="Noto Sans Lao, serif" fontWeight="medium">
                      ເງິນເດືອນຫຼັງບວກ:{" "}
                      <Badge
                        colorScheme="green"
                        fontSize="0.9em"
                        borderRadius="full"
                        px={2}
                        py={0.5}
                      >
                        {incomeItems.salaryfirst.toLocaleString()} ກີບ
                      </Badge>
                    </Text>
                    {matchedRange && (
                      <Text fontFamily="Noto Sans Lao, serif">
                        ຂັ້ນອາກອນຕ້ອງຫັກຢູ່ທີ່:{" "}
                        <Badge
                          colorScheme="purple"
                          fontSize="0.9em"
                          borderRadius="full"
                          px={2}
                          py={0.5}
                        >
                          {matchedRange.minAmount.toLocaleString()}-
                          {matchedRange.maxAmount.toLocaleString()}
                        </Badge>
                      </Text>
                    )}
                  </VStack>

                  {/* Social Security Info */}
                  <VStack align="start" spacing={3}>
                    <Text fontWeight="medium" fontFamily="Noto Sans Lao, serif">
                      ປະກັຍສັງຄົມ (Social Security):
                    </Text>
                    <Badge
                      colorScheme="red"
                      fontSize="0.9em"
                      borderRadius="full"
                      px={2}
                      py={0.5}
                    >
                      -{socialSecurityMoney.toLocaleString()} ກີບ
                    </Badge>
                    {getsalary[0]?.socialSecurity?.length > 0 ? (
                      getsalary[0].socialSecurity.map((item, index) => (
                        <Text key={index}>
                          <Badge
                            colorScheme="teal"
                            borderRadius="full"
                            px={2}
                            py={0.5}
                          >
                            {item.rate}%
                          </Badge>{" "}
                          - {item.type}
                        </Text>
                      ))
                    ) : (
                      <Text color="gray.500">
                        No social security data available
                      </Text>
                    )}
                  </VStack>
                </Grid>
                <Divider my={4} />
                <FormControl>
                  <FormLabel
                    fontWeight="medium"
                    fontFamily="Noto Sans Lao, serif"
                  >
                    ເລືອກວັນທີ່ເດືອນປີເບີກຈ່າຍປະຈຳເດືອນ
                  </FormLabel>
                  <Input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    bg={inputBg}
                    borderRadius="md"
                    height="42px"
                  />
                </FormControl>
              </CardBody>
            </Card>

            {/* Income & Expense Items */}
            <Grid
              templateColumns={columnTemplate}
              gap={cardSpacing}
              mb={cardSpacing}
            >
              {/* Income Items */}
              <Card
                variant="outline"
                borderColor={borderColor}
                boxShadow="sm"
                h="100%"
              >
                {block ? (
                  <Alert status="warning" mt={4} borderRadius="md">
                    <AlertIcon />
                    <Text fontFamily="Noto Sans Lao, serif">
                      ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                    </Text>
                  </Alert>
                ) : (
                  <CardHeader pb={2} borderTopRadius="md">
                    <Flex justify="space-between" align="center">
                      <Heading
                        fontFamily="Noto Sans Lao, serif"
                        size="sm"
                        color="green.600"
                      >
                        ລາຍການລາຍໄດ້
                      </Heading>
                      <Tooltip label="Add income item" hasArrow>
                        <IconButton
                          icon={<AddIcon />}
                          colorScheme="green"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({ ...formData, type: "income" });
                            onOpen();
                          }}
                          aria-label="Add income"
                        />
                      </Tooltip>
                    </Flex>
                  </CardHeader>
                )}
                <CardBody>
                  {dataIncome.length > 0 ? (
                    <VStack align="start" spacing={2} w="full">
                      {dataIncome.map((item, index) => (
                        <Flex
                          key={index}
                          justify="space-between"
                          w="full"
                          p={2}
                          borderRadius="md"
                        >
                          <Text fontFamily="Noto Sans Lao, serif">
                            {item.itemName}
                          </Text>
                          <Flex align="center">
                            <Text fontWeight="medium" color="green.500" mr={2}>
                              +{item.amount.toLocaleString()}
                            </Text>
                            <IconButton
                              onClick={() => deleteIncome(index)}
                              icon={<DeleteIcon />}
                              size="xs"
                              colorScheme="red"
                              variant="ghost"
                              aria-label="Delete item"
                            />
                          </Flex>
                        </Flex>
                      ))}
                      <Divider my={2} />
                      <Flex justify="space-between" w="full" p={2}>
                        <Text
                          fontWeight="bold"
                          fontFamily="Noto Sans Lao, serif"
                        >
                          ລວມລາຍການໄດ້:
                        </Text>
                        <Text fontWeight="bold" color="green.500">
                          {NetIncome.toLocaleString()} ກີບ
                        </Text>
                      </Flex>
                    </VStack>
                  ) : block ? (
                    <Alert status="warning" mt={4} borderRadius="md">
                      <AlertIcon />
                      <Text fontFamily="Noto Sans Lao, serif">
                        ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                      </Text>
                    </Alert>
                  ) : (
                    <Center py={6} flexDirection="column">
                      <Text color="gray.500" mb={2}>
                        No income items added
                      </Text>
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="green"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({ ...formData, type: "income" });
                          onOpen();
                        }}
                      >
                        Add Income Item
                      </Button>
                    </Center>
                  )}
                </CardBody>
              </Card>

              {/* Expense Items */}
              <Card
                variant="outline"
                borderColor={borderColor}
                boxShadow="sm"
                h="100%"
              >
                {block ? (
                  <Alert status="warning" mt={4} borderRadius="md">
                    <AlertIcon />
                    <Text fontFamily="Noto Sans Lao, serif">
                      ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                    </Text>
                  </Alert>
                ) : (
                  <CardHeader pb={2} borderTopRadius="md">
                    <Flex justify="space-between" align="center">
                      <Heading
                        fontFamily="Noto Sans Lao, serif"
                        size="sm"
                        color="red.600"
                      >
                        ລາຍການຫັກ
                      </Heading>
                      <Tooltip label="Add expense item" hasArrow>
                        <IconButton
                          icon={<AddIcon />}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({ ...formData, type: "deduction" });
                            onOpen();
                          }}
                          aria-label="Add expense"
                        />
                      </Tooltip>
                    </Flex>
                  </CardHeader>
                )}
                <CardBody>
                  {dataExpense.length > 0 ? (
                    <VStack align="start" spacing={2} w="full">
                      {dataExpense.map((item, index) => (
                        <Flex
                          key={index}
                          justify="space-between"
                          w="full"
                          p={2}
                          borderRadius="md"
                        >
                          <Text fontFamily="Noto Sans Lao, serif">
                            {item.itemName}
                          </Text>
                          <Flex align="center">
                            <Text fontWeight="medium" color="red.500" mr={2}>
                              -{item.amount.toLocaleString()}
                            </Text>
                            <IconButton
                              onClick={() => deleteExpense(index)}
                              icon={<DeleteIcon />}
                              size="xs"
                              colorScheme="red"
                              variant="ghost"
                              aria-label="Delete item"
                            />
                          </Flex>
                        </Flex>
                      ))}
                      <Divider my={2} />
                      <Flex justify="space-between" w="full" p={2}>
                        <Text
                          fontWeight="bold"
                          fontFamily="Noto Sans Lao, serif"
                        >
                          ລວມລາຍການຫັກ:
                        </Text>
                        <Text fontWeight="bold" color="red.500">
                          {NetExpense.toLocaleString()} ກີບ
                        </Text>
                      </Flex>
                    </VStack>
                  ) : block ? (
                    <Alert status="warning" mt={4} borderRadius="md">
                      <AlertIcon />
                      <Text fontFamily="Noto Sans Lao, serif">
                        ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                      </Text>
                    </Alert>
                  ) : (
                    <Center py={6} flexDirection="column">
                      <Text color="gray.500" mb={2}>
                        No expense items added
                      </Text>
                      <Button
                        leftIcon={<AddIcon />}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData({ ...formData, type: "deduction" });
                          onOpen();
                        }}
                      >
                        Add Expense Item
                      </Button>
                    </Center>
                  )}
                </CardBody>
              </Card>
            </Grid>

            {/* Summary */}
            <Card variant="filled" bg={summaryCardBg} mb={cardSpacing}>
              <CardHeader
                pb={2}
                borderBottom="1px solid"
                borderColor={borderColor}
              >
                <Heading size="md" fontFamily="Noto Sans Lao, serif">
                  ສະຫຼຸບເງິນເດືອນ
                </Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium" fontFamily="Noto Sans Lao, serif">
                      ເງິນເດືອນກ່ອນຫັກອາກອນ:
                    </Text>
                    <Badge
                      colorScheme="blue"
                      fontSize="md"
                      p={2}
                      borderRadius="md"
                    >
                      {Net.toLocaleString()} ກີບ
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium" fontFamily="Noto Sans Lao, serif">
                      ອາກອນລາຍໄດ້ທີ່ຕ້ອງຈ່າຍ:
                    </Text>
                    <Badge
                      colorScheme="red"
                      fontSize="md"
                      p={2}
                      borderRadius="md"
                    >
                      {taxpay.toLocaleString()} ກີບ
                    </Badge>
                  </Flex>

                  <Divider />

                  <Flex
                    justify="space-between"
                    align="center"
                    p={4}
                    borderRadius="lg"
                  >
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      fontFamily="Noto Sans Lao, serif"
                    >
                      ເງິນເດືອນສຸດທິ:
                    </Text>
                    <Text fontWeight="bold" fontSize="xl">
                      {(Net - taxpay).toLocaleString()} ກີບ
                    </Text>
                  </Flex>
                </Stack>
              </CardBody>
            </Card>

            {/* Save Button */}
            {block ? (
              <Alert status="warning" mt={4} borderRadius="md">
                <AlertIcon />
                <Text fontFamily="Noto Sans Lao, serif">
                  ຂໍອະໄພໄດ້ຄິດໄລ່ເງິນເດືອນຂອງເດືອນນີ້ແລ້ວ
                </Text>
              </Alert>
            ) : (
              <Button
                onClick={handleSaveSalary}
                colorScheme="blue"
                isDisabled={block}
                size={buttonSize}
                w="full"
                h="48px"
                fontFamily="Noto Sans Lao, serif"
                boxShadow="md"
                leftIcon={<CheckCircleIcon />}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                ບັນທຶກເງິນເດືອນພະນັກງານ ໝາຍເລກ {selectedEmployee}
              </Button>
            )}

            {/* Show warning if payment date is not set */}
            {!date && (
              <Alert status="warning" mt={4} borderRadius="md">
                <AlertIcon />
                <Text fontFamily="Noto Sans Lao, serif">
                  ກະລຸນາເລືອກວັນທີ່ເບີກຈ່າຍກ່ອນບັນທຶກ
                </Text>
              </Alert>
            )}
          </MotionBox>
        ) : (
          selectedEmployee && (
            <Alert
              status="info"
              borderRadius="md"
              variant="left-accent"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              py={6}
            >
              <AlertIcon boxSize="30px" mr={0} mb={3} />
              <Text fontFamily="Noto Sans Lao, serif" fontSize="lg">
                ບໍ່ພົບຂໍ້ມູນເງິນເດືອນ ສຳລັບພະນັກງານລະຫັດ {selectedEmployee}
              </Text>
              <Text color="gray.500" mt={2} fontFamily="Noto Sans Lao, serif">
                ກະລຸນາເລືອກເດືອນ ແລະ ປີ ທີ່ຕ້ອງການຄິດໄລ່
              </Text>
            </Alert>
          )
        )}

        {/* Add Item Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
          <ModalOverlay backdropFilter="blur(2px)" />
          <ModalContent borderRadius="lg">
            <ModalHeader
              fontFamily="Noto Sans Lao, serif"
              bg={formData.type === "income" ? "green.50" : "red.50"}
              borderTopRadius="lg"
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              {formData.type === "income"
                ? "ເພີ່ມລາຍການລາຍໄດ້"
                : "ເພີ່ມລາຍການລາຍຫັກ"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pt={6}>
              <VStack spacing={5}>
                <FormControl isInvalid={formErrors.itemName}>
                  <FormLabel
                    fontFamily="Noto Sans Lao, serif"
                    fontWeight="medium"
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
                    borderRadius="md"
                    height="42px"
                  />
                  <FormErrorMessage>{formErrors.itemName}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={formErrors.amount}>
                  <FormLabel
                    fontFamily="Noto Sans Lao, serif"
                    fontWeight="medium"
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
                    borderRadius="md"
                    height="42px"
                  />
                  <FormErrorMessage>{formErrors.amount}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontFamily="Noto Sans Lao, serif"
                    fontWeight="medium"
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
                    <Stack direction={stackDirection}>
                      <Radio value="income" colorScheme="green" size="lg">
                        <Text fontFamily="Noto Sans Lao, serif">ລາຍໄດ້</Text>
                      </Radio>
                      <Radio value="deduction" colorScheme="red" size="lg">
                        <Text fontFamily="Noto Sans Lao, serif">ລາຍຫັກ</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter
              borderTop="1px solid"
              borderColor={borderColor}
              gap={3}
            >
              <Button
                variant="outline"
                onClick={onClose}
                fontFamily="Noto Sans Lao, serif"
              >
                ຍົກເລີກ
              </Button>

              <Button
                colorScheme={formData.type === "income" ? "green" : "red"}
                onClick={handleSubmit}
                fontFamily="Noto Sans Lao, serif"
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
