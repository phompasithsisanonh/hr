import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Text,
  useColorModeValue,
  HStack,
  Icon,
  Heading,
  IconButton,
  Tooltip,
  Divider,
  Spinner,
  Badge,
  Flex,
  VStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Container,
  useMediaQuery,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BlocksIcon, Calendar, Edit2Icon, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { get_all_user } from "../store/Reducer/Auth/auth";
import { useEffect, useState } from "react";
import {
  block_active,
  messageClear,
} from "../store/Reducer/HRReducer/InformationEmplyee";
import toast from "react-hot-toast";
import { IoOpen } from "react-icons/io5";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const ListTableEmlyee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("teal.500", "teal.300");

  // Redux selectors
  const { get_all_user_em, get_all_user_block, loader, totaled } = useSelector(
    (state) => state.auth
  );
  const { successMessage, errorMessage } = useSelector(
    (state) => state.information
  );
  //pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(totaled);

  const [status, setStatus] = useState();

  // Navigation handlers
  const handleViewDetails = (employeeId) => {
    navigate(`/hr/detail-employees/${employeeId}`);
  };

  const handleViewCalendar = (employeeId) => {
    navigate(`/hr/calendar/${employeeId}`);
  };

  const handleEdit = (employeeId) => {
    navigate(`/hr/edit/${employeeId}`);
  };
  console.log(status);
  const handleBlockActive = (item, isActive) => {
    setStatus(isActive);
    dispatch(
      block_active({
        id: item._id,
        active: isActive,
      })
    ).then(() => dispatch(get_all_user()));
  };

  // Table view based on screen size

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    dispatch(get_all_user(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setTotalPages();
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  // Mobile card view for employees
  const EmployeeCard = ({ employee, isBlocked }) => (
    <MotionCard
      variants={itemVariants}
      bg={cardBg}
      borderRadius="xl"
      overflow="hidden"
      boxShadow="lg"
      border="1px solid"
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
        borderColor: accentColor,
      }}
      mb={4}
    >
      <CardBody>
        <Flex direction="column" spacing={4}>
          <Flex align="center" mb={3}>
            <Avatar
              size="md"
              name={employee.personalInfo.fullName}
              src={employee.personalInfo.profileImage}
              bg={accentColor}
              mr={3}
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="md">
                {employee.personalInfo.fullName}
              </Text>
              <Text fontSize="sm" color="gray.500">
                ID: {employee.emplyeebarCode}
              </Text>
            </VStack>
          </Flex>

          <Grid templateColumns="1fr 1fr" gap={2} mb={3}>
            <GridItem>
              <Text fontSize="xs" color="gray.500">
                Position
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {employee?.position?.type}
              </Text>
            </GridItem>
            <GridItem>
              <Text fontSize="xs" color="gray.500">
                Department
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {employee?.department?.type}
              </Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Text fontSize="xs" color="gray.500">
                Phone
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {employee.personalInfo.phone}
              </Text>
            </GridItem>
          </Grid>

          <Flex justifyContent="space-between" mt={2}>
            <Tooltip label="ລາຍລະອຽດ">
              <IconButton
                size="sm"
                aria-label="View details"
                icon={<Icon as={Eye} />}
                onClick={() => handleViewDetails(employee._id)}
                bgGradient="linear(to-r, teal.500, cyan.500)"
                _hover={{
                  bgGradient: "linear(to-r, teal.600, cyan.600)",
                }}
                color="white"
                borderRadius="lg"
              />
            </Tooltip>

            <Tooltip label="ປະຕິທິນວັນລາ">
              <IconButton
                size="sm"
                aria-label="View calendar"
                icon={<Calendar />}
                onClick={() => handleViewCalendar(employee.emplyeebarCode)}
                colorScheme="green"
                borderRadius="lg"
              />
            </Tooltip>

            <Tooltip label="ແກ້ໄຂຂໍ້ມູນ">
              <IconButton
                size="sm"
                aria-label="Edit employee"
                icon={<Icon as={Edit2Icon} />}
                onClick={() => handleEdit(employee._id)}
                colorScheme="blue"
                borderRadius="lg"
              />
            </Tooltip>

            {isBlocked ? (
              <Tooltip label="ເປີດໃຊ້ງານ">
                <IconButton
                  size="sm"
                  aria-label="Activate employee"
                  icon={<Icon as={IoOpen} />}
                  onClick={() => handleBlockActive(employee, true)}
                  colorScheme="purple"
                  borderRadius="lg"
                />
              </Tooltip>
            ) : (
              <Tooltip label="ປິດໃຊ້ງານພະນັກງານ">
                <IconButton
                  size="sm"
                  aria-label="Block employee"
                  icon={<Icon as={BlocksIcon} />}
                  onClick={() => handleBlockActive(employee, false)}
                  colorScheme="red"
                  borderRadius="lg"
                />
              </Tooltip>
            )}
          </Flex>
        </Flex>
      </CardBody>
    </MotionCard>
  );

  // Desktop table view
  const DesktopTable = ({ employees, isBlocked }) => (
    <TableContainer
      mt={4}
      borderRadius="xl"
      boxShadow="lg"
      bg={bgColor}
      overflow="hidden"
    >
      <Table variant="simple">
        <Thead>
          <Tr bgGradient="linear(to-r, teal.500, blue.500)">
            <Th color="white" borderTopLeftRadius="md" py={4}>
              ID
            </Th>
            <Th color="white" py={4}>
              Name
            </Th>
            <Th color="white" py={4}>
              Position
            </Th>
            <Th color="white" py={4}>
              Department
            </Th>
            <Th color="white" py={4}>
              Phone
            </Th>
            <Th
              color="white"
              borderTopRightRadius="md"
              py={4}
              textAlign="center"
            >
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {employees?.map((employee) => (
            <Tr
              key={employee.emplyeebarCode}
              bg={bgColor}
              _hover={{
                bg: hoverBg,
                transform: "scale(1.01)",
                transition: "all 0.3s ease",
              }}
              transition="all 0.3s"
            >
              <Td borderColor={borderColor} py={4}>
                <Text fontWeight="medium">{employee.emplyeebarCode}</Text>
              </Td>
              <Td borderColor={borderColor} py={4}>
                <HStack>
                  <Avatar
                    size="sm"
                    name={employee.personalInfo.fullName}
                    src={employee.personalInfo.profileImage}
                    bg={accentColor}
                  />
                  <Text fontWeight="medium">
                    {employee.personalInfo.fullName}
                  </Text>
                </HStack>
              </Td>
              <Td borderColor={borderColor} py={4}>
                <Badge colorScheme="teal" px={2} py={1} borderRadius="full">
                  {employee?.position?.type || "N/A"}
                </Badge>
              </Td>
              <Td borderColor={borderColor} py={4}>
                <Badge colorScheme="blue" px={2} py={1} borderRadius="full">
                  {employee?.department?.type || "N/A"}
                </Badge>
              </Td>
              <Td borderColor={borderColor} py={4}>
                {employee.personalInfo.phone}
              </Td>
              <Td borderColor={borderColor} py={4}>
                <HStack spacing={3} justify="center">
                  <Tooltip label="ລາຍລະອຽດ" placement="top">
                    <IconButton
                      size="sm"
                      colorScheme="teal"
                      icon={<Icon as={Eye} />}
                      onClick={() => handleViewDetails(employee._id)}
                      bgGradient="linear(to-r, teal.500, cyan.500)"
                      _hover={{
                        bgGradient: "linear(to-r, teal.600, cyan.600)",
                        transform: "translateY(-2px)",
                      }}
                      color="white"
                      borderRadius="lg"
                    />
                  </Tooltip>

                  <Tooltip label="ປະຕິທິນວັນລາ" placement="top">
                    <IconButton
                      size="sm"
                      colorScheme="teal"
                      onClick={() =>
                        handleViewCalendar(employee.emplyeebarCode)
                      }
                      bgGradient="linear(to-r, green.400, green.600)"
                      _hover={{
                        bgGradient: "linear(to-r, green.500, green.700)",
                        transform: "translateY(-2px)",
                      }}
                      color="white"
                      icon={<Calendar />}
                      borderRadius="lg"
                    />
                  </Tooltip>

                  <Tooltip label="ແກ້ໄຂຂໍ້ມູນ" placement="top">
                    <IconButton
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleEdit(employee._id)}
                      icon={<Icon as={Edit2Icon} />}
                      bgGradient="linear(to-r, blue.400, blue.600)"
                      _hover={{
                        bgGradient: "linear(to-r, blue.500, blue.700)",
                        transform: "translateY(-2px)",
                      }}
                      color="white"
                      borderRadius="lg"
                    />
                  </Tooltip>

                  {isBlocked ? (
                    <Tooltip label="ເປີດໃຊ້ງານ" placement="top">
                      <IconButton
                        size="sm"
                        colorScheme="purple"
                        onClick={() => handleBlockActive(employee, true)}
                        icon={<Icon as={IoOpen} />}
                        bgGradient="linear(to-r, purple.400, purple.600)"
                        _hover={{
                          bgGradient: "linear(to-r, purple.500, purple.700)",
                          transform: "translateY(-2px)",
                        }}
                        color="white"
                        borderRadius="lg"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip label="ປິດໃຊ້ງານພະນັກງານ" placement="top">
                      <IconButton
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleBlockActive(employee, false)}
                        icon={<Icon as={BlocksIcon} />}
                        bgGradient="linear(to-r, red.400, red.600)"
                        _hover={{
                          bgGradient: "linear(to-r, red.500, red.700)",
                          transform: "translateY(-2px)",
                        }}
                        color="white"
                        borderRadius="lg"
                      />
                    </Tooltip>
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      {loader ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          height="100vh"
          width="100%"
        >
          <Box
            p={10}
            borderRadius="xl"
            bgGradient="linear(to-r, teal.500, blue.500)"
            boxShadow="xl"
            textAlign="center"
          >
            <Spinner
              speed="0.8s"
              size="xl"
              color="white"
              thickness="4px"
              emptyColor="rgba(255,255,255,0.2)"
            />
            <Text mt={4} color="white" fontWeight="medium">
              ກຳລັງໂຫຼດຂໍ້ມູນ...
            </Text>
          </Box>
        </Flex>
      ) : (
        <Container maxW="container.xl" px={{ base: 4, md: 6 }}>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg={bgColor}
            p={{ base: 4, md: 8 }}
            borderRadius="2xl"
            boxShadow="2xl"
            backdropFilter="blur(10px)"
            bgGradient="linear(to-b, white, gray.50)"
            _dark={{ bgGradient: "linear(to-b, gray.800, gray.700)" }}
            mx="auto"
            my={8}
            overflow="hidden"
            border="1px solid"
            borderColor="gray.200"
          >
            {/* Active Employees Section */}
            <Flex
              direction="column"
              mb={8}
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              as={motion.div}
            >
              <Heading
                size="lg"
                mb={6}
                fontFamily="Noto Sans Lao, serif"
                bgGradient="linear(to-r, teal.500, blue.500)"
                bgClip="text"
                fontWeight="bold"
                pb={2}
                borderBottom="3px solid"
                borderColor="teal.500"
                display="inline-block"
              >
                ພະນັກງານທັງໝົດພາຍໃນອົງກອນ
              </Heading>

              {isLargerThan768 ? (
                <DesktopTable employees={get_all_user_em} isBlocked={false} />
              ) : (
                <MotionBox
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {get_all_user_em.map((employee) => (
                    <EmployeeCard
                      key={employee.emplyeebarCode}
                      employee={employee}
                      isBlocked={false}
                    />
                  ))}
                </MotionBox>
              )}
              <HStack spacing={4} justify="center" mt={4}>
                <Button
                  onClick={() => setPage(page - 1)}
                  isDisabled={page === 1}
                  colorScheme="teal"
                  variant="outline"
                >
                  Prev
                </Button>

                <Text fontWeight="medium">
                  Page {page} of {totalPages}
                </Text>

                <Button
                  onClick={() => setPage(page + 1)}
                  isDisabled={page === totalPages}
                  colorScheme="teal"
                  variant="outline"
                >
                  Next
                </Button>
              </HStack>
            </Flex>

            <Divider my={8} borderWidth="1px" borderColor={borderColor} />

            {/* Blocked Employees Section */}
            <Flex
              direction="column"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              as={motion.div}
            >
              <Heading
                size="lg"
                mb={6}
                fontFamily="Noto Sans Lao, serif"
                bgGradient="linear(to-r, red.500, purple.500)"
                bgClip="text"
                fontWeight="bold"
                pb={2}
                borderBottom="3px solid"
                borderColor="red.500"
                display="inline-block"
              >
                ພະນັກງານທີ່ຖືກລະງັບການໃຊ້ງານ
              </Heading>

              {get_all_user_block?.length === 0 ? (
                <Box
                  p={4}
                  borderRadius="lg"
                  bg="gray.50"
                  _dark={{ bg: "gray.700" }}
                  textAlign="center"
                >
                  <Text color="gray.500">
                    ບໍ່ມີພະນັກງານທີ່ຖືກລະງັບການໃຊ້ງານ
                  </Text>
                </Box>
              ) : isLargerThan768 ? (
                <DesktopTable employees={get_all_user_block} isBlocked={true} />
              ) : (
                <MotionBox
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {get_all_user_block?.map((employee) => (
                    <EmployeeCard
                      key={employee.emplyeebarCode}
                      employee={employee}
                      isBlocked={true}
                    />
                  ))}
                </MotionBox>
              )}
            </Flex>
          </MotionBox>
        </Container>
      )}
    </>
  );
};

export default ListTableEmlyee;
