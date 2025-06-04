import React, { useEffect, useState } from "react";
import {
  addDataSalary,
  CancelCardSummary,
  cardsummary,
  getAllSalary,
  messageClear,
} from "../store/Reducer/HRReducer/salaryReducer";
import { useDispatch, useSelector } from "react-redux";
import { IoRefreshCircle } from "react-icons/io5";
import {
  Box,
  Card,
  Grid,
  GridItem,
  Text,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue,
  Button,
  Heading,
  Spinner,
  Badge,
  VStack,
  HStack,
  Select,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Animation variants for card entrance
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Motion components
const MotionCard = motion(Card);
const MotionBox = motion(Box);

const CardForSummaryCalu = () => {
  const {
    getAllSalaries,
    errorMessage,
    cardsummaries,
    loader,
    successMessage,
  } = useSelector((state) => state.salary);
  const dispatch = useDispatch();
  const [submittedCodes, setSubmittedCodes] = useState(new Set());
  useEffect(() => {
    dispatch(getAllSalary());
    dispatch(cardsummary());
  }, [dispatch]);

  // Theme values
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("white", "white");
  const accentColor = "cyan.400";
  const secondaryColor = "purple.400";
  const [fullName, setFullName] = useState("");
  const [montheris, setMontheris] = useState(0);
  const [yearseris, setYearseris] = useState(0);
  const handleSend = (item) => {
    if (submittedCodes.has(item?.emplyeecode && item.month && item.year)) {
      toast.error("ขออภัย ข้อมูลนี้ถูกบันทึกในระบบแล้ว");
      return;
    }
    const isDuplicate = getAllSalaries.some(
      (salary) =>
        salary.emplyeecode === item?.emplyeecode &&
        salary.month === item.month &&
        salary.year === item.year
    );
    if (isDuplicate) {
      toast.error("ขออภัย ข้อมูลนี้ถูกบันทึกในระบบแล้ว");
      setSubmittedCodes((prev) =>
        new Set(prev).add(item?.emplyeecode, item.month, item.year)
      );
      return;
    }
    setSubmittedCodes((prev) =>
      new Set(prev).add(item?.emplyeecode, item.month, item.year)
    );
    dispatch(addDataSalary({ ...item }));
  };
  const groupedSummaries = cardsummaries.reduce((acc, item) => {
    const monthYear = item?.date.slice(4, 15); // เอาแค่ 'YYYY-MM'
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(item);
    return acc;
  }, {});
  console.log("groupedSummaries",groupedSummaries)
  const result = Object.entries(groupedSummaries).flatMap(([year, items]) => {
    const date = new Date(year);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const years = date.getFullYear();

    return items
      .filter(({ personalInfo }) => {
        const matchFullName = !fullName || personalInfo?.fullName === fullName;
        const matchMonth = !montheris || month === Number(montheris);
        const matchYear = !yearseris || years === Number(yearseris);
        return matchFullName && matchMonth && matchYear;
      })
      .map((item) => ({ ...item, day, month, year: years }));
  });

  const year = Array.from(
    { length: 5 },
    (_, index) => new Date().getFullYear() - index
  );
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const clear = () => {
    setFullName("");
    setMontheris("");
    setYearseris("");
  };
  const handleCancel = (item) => {
    dispatch(
      CancelCardSummary({
        id: item.id,
      })
    );
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(getAllSalary());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <Box
      bg={bgColor}
      minH="100vh"
      p={{ base: 4, md: 6, lg: 8 }}
      transition="background-color 0.3s"
    >
      <VStack spacing={6} align="center" mb={8}>
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading
            as="h1"
            fontFamily="Noto Sans Lao, serif"
            size={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`}
            bgClip="text"
            textAlign="center"
          >
            ລາຍງານສະຫຼຸບເງິນລ່ວງເວລາ
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color={useColorModeValue("gray.600", "gray.300")}
            textAlign="center"
          >
            ກວດສອບຂໍ້ມູນກ່ອນດຳເນີນການບັນທຶກ
          </Text>
        </MotionBox>
      </VStack>

      {loader && (
        <Flex justify="center" align="center" height="100vh">
          <Center>
            <Spinner size="xl" thickness="4px" speed="0.65s" />
            <Text ml={4} fontSize="lg">
              ກຳລັງໂຫຼດຂໍ້ມູນ...
            </Text>
          </Center>
        </Flex>
      )}
      <Grid
        templateColumns={{
          base: "1fr",
          sm: "repeat(auto-fit, minmax(280px, 1fr))",
          lg: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
        gap={{ base: 4, md: 6 }}
      >
        <GridItem>
          <MotionCard
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="md"
            p={{ base: 4, md: 6 }}
            position="relative"
            overflow="hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, boxShadow: "lg" }}
            transition={{ duration: 0.3 }}
          >
            <VStack>
              <IconButton
                onClick={clear}
                colorScheme="red"
                icon={<IoRefreshCircle />}
              />
            </VStack>
            <HStack>
              <FormControl>
                <FormLabel>ເລືອກເດືອນ</FormLabel>
                <Select
                  value={montheris}
                  onChange={(e) => setMontheris(e.target.value)}
                >
                  <option value="">ເລືອກເດືອນ</option>
                  {months.map((item, index) => (
                    <option key={index}>{item}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>ເລືອກປິ</FormLabel>
                <Select
                  value={yearseris}
                  onChange={(e) => setYearseris(e.target.value)}
                >
                  <option value="">ເລືອກປິ</option>
                  {year.map((item, index) => (
                    <option key={index}>{item}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>ຄົ້ນຫາພະນັກງານ</FormLabel>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ຄົ້ນຫາຊື່ພະນັກງານ"
                />
              </FormControl>
            </HStack>
          </MotionCard>
        </GridItem>
      </Grid>
      <Grid
        paddingTop={"30px"}
        templateColumns={{
          base: "1fr",
          sm: "repeat(auto-fit, minmax(280px, 1fr))",
          lg: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
        gap={{ base: 4, md: 6 }}
      >
        {result.map((item, index) => (
          <Box key={index} mb={8}>
            <Heading
              size="lg"
              mb={4}
              color={accentColor}
              borderBottom="2px solid"
              borderColor={secondaryColor}
            >
              {item?.month}-{item?.year}
            </Heading>

            <GridItem key={index}>
              <MotionCard
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="md"
                p={{ base: 4, md: 6 }}
                position="relative"
                overflow="hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02, boxShadow: "lg" }}
                transition={{ duration: 0.3 }}
              >
                {getAllSalaries.some(
                  (salary) =>
                    salary.emplyeecode === item?.emplyeecode &&
                    salary.month === item.month &&
                    salary.year === item.year
                ) && (
                  <Badge
                    position="absolute"
                    top={3}
                    right={3}
                    colorScheme="red"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="0.8em"
                  >
                    ບັນທຶກແລ້ວ
                  </Badge>
                )}
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="bold"
                      color={accentColor}
                    >
                      #{item?.emplyeecode}
                    </Text>

                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="medium"
                      color={textColor}
                      isTruncated
                      maxW="60%"
                    >
                      {item?.personalInfo.fullName}
                    </Text>
                  </HStack>

                  <StatGroup
                    bg={"gray.700"}
                    p={4}
                    borderRadius="lg"
                    flexWrap="wrap"
                    gap={4}
                  >
                    <Stat flex="1" minW="120px">
                      <StatLabel color="gray.500" fontSize="sm">
                        ຫັກມາຊ້າ
                      </StatLabel>
                      <StatNumber
                        fontSize={{ base: "sm", md: "md" }}
                        color={textColor}
                      >
                        H {item?.calculateTimeLateHour?.toLocaleString()} ກີບ
                      </StatNumber>
                      <Text fontSize="xs" color="white">
                        M {item?.calculateTimeLateMinute?.toLocaleString()} ກີບ
                      </Text>
                    </Stat>
                    <Stat flex="1" minW="120px">
                      <StatLabel color="gray.500" fontSize="sm">
                        ຄ່າລ່ວງເວລາ
                      </StatLabel>
                      <StatNumber
                        fontSize={{ base: "sm", md: "md" }}
                        color={textColor}
                      >
                        H {item?.calculateTimeOThour?.toLocaleString()} ກີບ
                      </StatNumber>
                      <Text fontSize="xs" color="white">
                        M {item?.calculateTimeOTminute?.toLocaleString()} ກີບ
                      </Text>
                    </Stat>
                  </StatGroup>

                  <StatGroup
                    bg={"gray.700"}
                    p={4}
                    borderRadius="lg"
                    flexWrap="wrap"
                    gap={4}
                  >
                    <Stat flex="1" minW="120px">
                      <StatLabel color="gray.500" fontSize="sm">
                        ເງິນໂອທີຫຼັງຫັກ
                      </StatLabel>
                      <StatNumber
                        fontSize={{ base: "sm", md: "md" }}
                        color={textColor}
                      >
                        {item?.incomeNet?.toLocaleString()} ກີບ
                      </StatNumber>
                    </Stat>
                    <Stat flex="1" minW="120px">
                      <StatLabel color="gray.500" fontSize="sm">
                        ເງິນເດືອນພື້ນຖານ
                      </StatLabel>
                      <StatNumber
                        fontSize={{ base: "sm", md: "md" }}
                        color={textColor}
                      >
                        {item?.salaryInfo.baseSalary?.toLocaleString()} ກີບ
                      </StatNumber>
                    </Stat>
                  </StatGroup>

                  <Box
                    bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`}
                    p={{ base: 3, md: 4 }}
                    borderRadius="lg"
                    textAlign="center"
                  >
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="semibold"
                      color="white"
                    >
                      ເງິນເດືອນສຸດທິ:{" "}
                      <Text as="span" fontWeight="bold">
                        {item?.salaryfirst?.toLocaleString()} ກີບ
                      </Text>
                    </Text>
                  </Box>
                  <Flex>
                    <Center>
                      <Box paddingRight={"40px"}>
                        <Button
                          onClick={() => handleCancel(item)}
                          color={"white"}
                          bg={"red"}
                        >
                          ຍົກເລີກບັນທຶກ
                        </Button>
                      </Box>
                      <Button
                        onClick={() => handleSend(item)}
                        isLoading={loader}
                        isDisabled={
                          submittedCodes.has(
                            item?.emplyeecode && item.month && item.year
                          ) ||
                          getAllSalaries.some(
                            (salary) =>
                              salary.emplyeecode === item?.emplyeecode &&
                              salary.month === item.month &&
                              salary.year === item.year
                          )
                        }
                        bgGradient={`linear(to-r, ${accentColor}, ${secondaryColor})`}
                        color="white"
                        size="md"
                        _hover={{
                          bgGradient: `linear(to-r, ${accentColor}, ${secondaryColor})`,
                          opacity: 0.9,
                        }}
                        _disabled={{
                          opacity: 0.5,
                          cursor: "not-allowed",
                          bgGradient: `linear(to-r, gray.400, gray.500)`,
                        }}
                      >
                        ຢືນຢັນຂໍ້ມູນ
                      </Button>
                    </Center>
                  </Flex>
                </VStack>
              </MotionCard>
            </GridItem>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default CardForSummaryCalu;
