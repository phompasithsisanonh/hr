import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletesalarycalu,
  getSalary,
  messageClear,
} from "../store/Reducer/HRReducer/salaryReducer";
import {
  Box,
  Container,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Flex,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  Spinner,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Image,
  VStack,
  IconButton,
  Stack,
  SimpleGrid,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import autoTable from "jspdf-autotable";

const SalaryDashboard = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, getSalaries } = useSelector(
    (state) => state.salary
  );
  const payslipRef = useRef({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "employeeCode",
    direction: "ascending",
  });
  const [item, setItem] = useState();

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const cardColumns = useBreakpointValue({ base: 1, md: 2, lg: 3 });
  const modalSize = useBreakpointValue({ base: "full", md: "xl", lg: "2xl" });

  useEffect(() => {
    dispatch(getSalary());
  }, [dispatch]);

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

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredSalaries = getSalaries
    ? getSalaries.filter((salary) =>
        salary.employeeCode.toString().includes(searchTerm)
      )
    : [];

  const sortedSalaries = [...filteredSalaries].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("lo-LA", {
      style: "currency",
      currency: "LAK",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  if (loader) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Flex>
    );
  }

  // Calculate summary statistics
  const totalEmployees = sortedSalaries.length;
  const totalSalary = sortedSalaries.reduce(
    (sum, salary) => sum + salary.netSalary,
    0
  );
  const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

  const downloadPDF = (id) => {
    const input = payslipRef.current[id];
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`payslip_${id}.pdf`);
    });
  };

  const handleClick = (item) => {
    onOpen();
    setItem(item);
  };

  const handleDelete = (id) => {
    dispatch(deletesalarycalu(id)).then(() => dispatch(getSalary()));
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("YOUR COMPANY NAME", 105, 20, { align: "center" });
    doc.setFontSize(16);
    doc.text("ລາຍການເງິນເດືອນ ", 105, 30, { align: "center" });
    doc.setFontSize(12);
    doc.text(`${data.personalInfo?.fullName || 'N/A'}`, 20, 50);
    doc.text("Position: Software Developer", 20, 60);
    doc.text(`${data?.employeeCode}`, 20, 70);
    doc.text(data.date, 150, 50);

    autoTable(doc, {
      startY: 80,
      head: [["ລາຍການ", "ຈຳນວນເງິນ ກີບ"]],
      body: [
        ["ເງິນເດືອນພື້ນຖານ", `${data.basicSalary.toLocaleString()}`],
        ["ເງິນລວ່ງເວລາ", `${data.salaryFirst.toLocaleString()}`],
        ["ເງິນໄດ້ອື່ນໆ", `${data.netIncome.toLocaleString()}`],
        ["ເງິນຫັກອື່ນໆ", `${data.netExpense.toLocaleString()}`],
        ["ສະຫວັດດີການ", `${data.socialSecurityMoney.toLocaleString()}`],
        ["ອາກອນລາຍໄດ້", `${data.tax.toLocaleString()}`],
        [
          { content: "Net Pay", styles: { fontStyle: "bold" } },
          `${data.netSalary.toLocaleString()}`,
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: 255,
        halign: "center",
      },
      bodyStyles: { halign: "right" },
      styles: { fontSize: 12 },
    });

    const finalY = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(12);
    doc.text("ລາຍເຊັນ: _______________________", 20, finalY);
    doc.setFontSize(10);
    doc.text(
      "This is a computer-generated slip. No signature required if printed electronically.",
      20,
      290
    );
    doc.save("salary_slip.pdf");
  };

  // Mobile Card Component for better mobile display
  const MobileSalaryCard = ({ salary, index }) => (
    <Card mb={4} shadow="md" borderRadius="lg" bg={index % 2 === 0 ? bgColor : "gray.50"}>
      <CardBody>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Badge colorScheme="blue" p={2} borderRadius="md" fontSize="sm">
              {salary.employeeCode}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              {formatDate(salary?.date)}
            </Text>
          </HStack>
          
          <Divider />
          
          <SimpleGrid columns={2} spacing={3} fontSize="sm">
            <Box>
              <Text color="gray.500">ເງິນເດືອນພື້ນຖານ:</Text>
              <Text fontWeight="medium">{formatCurrency(salary.basicSalary)}</Text>
            </Box>
            <Box>
              <Text color="gray.500">ລາຍຮັບເພີ່ມ:</Text>
              <Text fontWeight="medium">{formatCurrency(salary.netIncome)}</Text>
            </Box>
            <Box>
              <Text color="gray.500">ປະກັນສັງຄົມ:</Text>
              <Text fontWeight="medium">{formatCurrency(salary.socialSecurityMoney)}</Text>
            </Box>
            <Box>
              <Text color="gray.500">ອາກອນ:</Text>
              <Text fontWeight="medium">{formatCurrency(salary.tax)}</Text>
            </Box>
          </SimpleGrid>
          
          <Divider />
          
          <HStack justify="space-between" align="center">
            <Box>
              <Text fontSize="xs" color="gray.500">ເງິນເດືອນສຸດທິ</Text>
              <Text fontWeight="bold" color="green.600" fontSize="lg">
                {formatCurrency(salary.netSalary)}
              </Text>
            </Box>
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                size="sm"
                colorScheme="blue"
              >
                ຄຳສັ່ງ
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => generatePDF(salary)}>
                  ລາຍລະອຽດ
                </MenuItem>
                <MenuItem onClick={() => handleClick(salary)}>
                  ພິມໃບເງິນເດືອນ
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => handleDelete(salary._id)}
                  color="red.500"
                >
                  ລຶບຂໍ້ມູນ
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 4, md: 8 }}>
      {/* Modal for payslip */}
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
        <ModalOverlay />
        <ModalContent 
          bg="white" 
          p={{ base: 2, md: 6 }} 
          borderRadius="md" 
          maxW={{ base: "95vw", md: "700px" }}
          mx={{ base: 2, md: "auto" }}
        >
          <ModalHeader>
            <Flex justify="space-between" align="center" mb="4">
              <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
                ໃບເງິນເດືອນພະນັກງານ
              </Text>
            </Flex>
          </ModalHeader>

          <ModalBody px={{ base: 2, md: 6 }}>
            <Box ref={(el) => (payslipRef.current[item?.employeeCode] = el)}>
              <VStack spacing="6" align="stretch">
                {/* Company & Title */}
                <Flex 
                  paddingLeft={{ base: "10px", md: "30px" }} 
                  align="center" 
                  gap="4"
                  direction={{ base: "column", md: "row" }}
                  textAlign={{ base: "center", md: "left" }}
                >
                  <Image src="/api/placeholder/100/100" boxSize={{ base: "50px", md: "70px" }} />
                  <Box>
                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                      ບໍລິສັດ ຊື່ບໍລິສັດຂອງທ່ານ
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      ໃບເງິນເດືອນປະຈຳເດືອນ {formatDate(item?.date)}
                    </Text>
                  </Box>
                </Flex>

                {/* Employee Details */}
                <Box paddingLeft={{ base: "10px", md: "30px" }}>
                  <Stack spacing={2} direction={{ base: "column", md: "row" }}>
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">
                        ລະຫັດພະນັກງານ: {item?.employeeCode}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="medium" fontSize="sm">
                        ວັນທີຈ່າຍເງິນເດືອນ: {formatDate(item?.date)}
                      </Text>
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                {/* Salary Table - Responsive */}
                <Box overflowX="auto">
                  <Table variant="simple" size={{ base: "sm", md: "md" }}>
                    <Thead>
                      <Tr>
                        <Th
                          fontFamily="Noto Sans Lao, serif"
                          colSpan="2"
                          textAlign="center"
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          ລາຍລະອຽດເງິນເດືອນ
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td fontSize={{ base: "xs", md: "sm" }}>ເງິນເດືອນພື້ນຖານ</Td>
                        <Td isNumeric fontSize={{ base: "xs", md: "sm" }}>
                          {formatCurrency(item?.basicSalary)} LAK
                        </Td>
                      </Tr>
                      <Tr bg="green.50">
                        <Td fontSize={{ base: "xs", md: "sm" }}>ເງິນລວ່ງເວລາ</Td>
                        <Td isNumeric fontSize={{ base: "xs", md: "sm" }}>
                          {formatCurrency(item?.salaryFirst - item?.basicSalary)} LAK
                        </Td>
                      </Tr>
                        <Tr bg="green.50">
                        <Td fontSize={{ base: "xs", md: "sm" }}>ເງິນສິດທິປະໂຫຍດ</Td>
                        <Td isNumeric fontSize={{ base: "xs", md: "sm" }}>
                          {formatCurrency(item?.NetBennifits)} LAK
                        </Td>
                      </Tr>
                      <Tr bg="green.50">
                        <Td fontSize={{ base: "xs", md: "sm" }}>ລາຍຮັບເພີ່ມ</Td>
                        <Td isNumeric fontSize={{ base: "xs", md: "sm" }}>
                          {formatCurrency(item?.netIncome)} LAK
                        </Td>
                      </Tr>
                      <Tr>
                        <Td fontSize={{ base: "xs", md: "sm" }}>ເງິນເດືອນຂັ້ນຕົ້ນ</Td>
                        <Td isNumeric fontSize={{ base: "xs", md: "sm" }}>
                          {formatCurrency(item?.salaryFirst +item?.netIncome+item?.NetBennifits )} LAK
                        </Td>
                      </Tr>
                      <Tr bg="red.50">
                        <Td fontSize={{ base: "xs", md: "sm" }}>ປະກັນສັງຄົມ </Td>
                        <Td isNumeric fontSize={{ base: "xs", md: "sm" }}>
                          -{formatCurrency(item?.socialSecurityMoney)} LAK
                        </Td>
                      </Tr>
                      <Tr bg="red.50">
                        <Td fontSize={{ base: "xs", md: "sm" }}>ລາຍຈ່າຍເພີ່ມ</Td>
                        <Td isNumeric fontSize={{ base: "xs", md: "sm" }}>
                          -{formatCurrency(item?.netExpense)} LAK
                        </Td>
                      </Tr>
                      <Tr bg="red.50">
                        <Td fontSize={{ base: "xs", md: "sm" }}>ອາກອນເງິນເດືອນ</Td>
                        <Td isNumeric fontSize={{ base: "xs", md: "sm" }}>
                          -{formatCurrency(item?.tax)} LAK
                        </Td>
                      </Tr>
                      <Tr fontWeight="bold" bg="gray.100">
                        <Td fontSize={{ base: "sm", md: "md" }}>ເງິນເດືອນສຸດທິ</Td>
                        <Td isNumeric fontSize={{ base: "sm", md: "md" }}>
                          {formatCurrency(item?.netSalary)} LAK
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>

                {/* Signatures */}
                <Stack 
                  direction={{ base: "column", md: "row" }} 
                  justify="space-around" 
                  pt="6" 
                  spacing={4}
                >
                  <Box textAlign="center">
                    <Box borderBottom="1px solid" w="150px" mb="2" mx="auto" />
                    <Text fontSize={{ base: "xs", md: "sm" }}>ລາຍເຊັນພະນັກງານ</Text>
                  </Box>
                  <Box textAlign="center">
                    <Box borderBottom="1px solid" w="150px" mb="2" mx="auto" />
                    <Text fontSize={{ base: "xs", md: "sm" }}>ລາຍເຊັນຜູ້ອໍານວຍການ</Text>
                  </Box>
                </Stack>
              </VStack>
            </Box>
          </ModalBody>
          
          <ModalFooter>
            <Stack 
              direction={{ base: "column", md: "row" }} 
              spacing={3} 
              width="full"
              justify="flex-end"
            >
              <IconButton
                icon={<Download />}
                colorScheme="red"
                size={{ base: "sm", md: "md" }}
                onClick={() => downloadPDF(item?.employeeCode)}
              />
              <Button
                colorScheme="blue"
                size={{ base: "sm", md: "md" }}
                onClick={() => window.print()}
              >
                ພິມໃບເງິນເດືອນ
              </Button>
              <Button 
                variant="outline" 
                size={{ base: "sm", md: "md" }} 
                onClick={onClose}
              >
                ປິດ
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
        <Card mb={6} shadow="md" borderRadius="lg">
          <CardHeader pb={0}>
            <Heading
              fontFamily="Noto Sans Lao, serif"
              size={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color={textColor}
            >
              ຂໍ້ມູນເງິນເດືອນພະນັກງານ
            </Heading>
          </CardHeader>
          <CardBody>
            {successMessage && (
              <Alert status="success" mb={4} borderRadius="md">
                <AlertIcon />
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert status="error" mb={4} borderRadius="md">
                <AlertIcon />
                {errorMessage}
              </Alert>
            )}

            {/* Summary Cards - Responsive Grid */}
            <SimpleGrid columns={cardColumns} spacing={6} mb={6}>
              <Card bg="blue.50" borderRadius="lg">
                <CardBody>
                  <Stat>
                    <StatLabel fontSize={{ base: "sm", md: "md" }} color="blue.600">
                      ຈຳນວນພະນັກງານທັງໝົດ
                    </StatLabel>
                    <StatNumber color="blue.600" fontSize={{ base: "xl", md: "2xl" }}>
                      {totalEmployees}
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg="green.50" borderRadius="lg">
                <CardBody>
                  <Stat>
                    <StatLabel fontSize={{ base: "sm", md: "md" }} color="green.600">
                      ເງິນເດືອນລວມທັງໝົດ
                    </StatLabel>
                    <StatNumber color="green.600" fontSize={{ base: "lg", md: "2xl" }}>
                      {formatCurrency(totalSalary)}
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg="purple.50" borderRadius="lg">
                <CardBody>
                  <Stat>
                    <StatLabel fontSize={{ base: "sm", md: "md" }} color="purple.600">
                      ເງິນເດືອນສະເລ່ຍ
                    </StatLabel>
                    <StatNumber color="purple.600" fontSize={{ base: "lg", md: "2xl" }}>
                      {formatCurrency(averageSalary)}
                    </StatNumber>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Search Input */}
            <InputGroup mb={6}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="ຄົ້ນຫາດ້ວຍລະຫັດພະນັກງານ..."
                bg={bgColor}
                borderColor={borderColor}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fontSize={{ base: "sm", md: "md" }}
              />
            </InputGroup>

            {/* Conditional Rendering: Mobile Cards vs Desktop Table */}
            {isMobile ? (
              // Mobile Card Layout
              <VStack spacing={4} align="stretch">
                {sortedSalaries.length > 0 ? (
                  sortedSalaries.map((salary, index) => (
                    <MobileSalaryCard 
                      key={salary._id} 
                      salary={salary} 
                      index={index}
                    />
                  ))
                ) : (
                  <Card>
                    <CardBody>
                      <Text textAlign="center" py={10} fontSize="lg" color="gray.500">
                        ບໍ່ພົບຂໍ້ມູນເງິນເດືອນພະນັກງານ
                      </Text>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            ) : (
              // Desktop Table Layout
              <Box overflowX="auto">
                <Table variant="simple" borderRadius="lg" overflow="hidden" minW="800px">
                  <Thead bg="gray.100">
                    <Tr>
                      <Th
                        cursor="pointer"
                        onClick={() => requestSort("employeeCode")}
                        position="relative"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        <Flex align="center">
                          ລະຫັດພະນັກງານ
                          {sortConfig.key === "employeeCode" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUpIcon ml={1} />
                            ) : (
                              <ChevronDownIcon ml={1} />
                            ))}
                        </Flex>
                      </Th>
                      <Th 
                        cursor="pointer" 
                        onClick={() => requestSort("date")}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        <Flex align="center">
                          ວັນທີ
                          {sortConfig.key === "date" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUpIcon ml={1} />
                            ) : (
                              <ChevronDownIcon ml={1} />
                            ))}
                        </Flex>
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => requestSort("basicSalary")}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        <Flex align="center">
                          ເງິນເດືອນພື້ນຖານ
                          {sortConfig.key === "basicSalary" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUpIcon ml={1} />
                            ) : (
                              <ChevronDownIcon ml={1} />
                            ))}
                        </Flex>
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize={{ base: "xs", md: "sm" }}>
                        ລາຍຮັບສິດທິ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize={{ base: "xs", md: "sm" }}>
                        ລາຍຮັບເພີ່ມ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize={{ base: "xs", md: "sm" }}>
                        ລາຍຈ່າຍເພີ່ມ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize={{ base: "xs", md: "sm" }}>
                        ປະກັນສັງຄົມ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize={{ base: "xs", md: "sm" }}>
                        ອາກອນ
                      </Th>
                      <Th
                        cursor="pointer"
                        onClick={() => requestSort("netSalary")}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        <Flex align="center">
                          ເງິນເດືອນສຸດທິ
                          {sortConfig.key === "netSalary" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUpIcon ml={1} />
                            ) : (
                              <ChevronDownIcon ml={1} />
                            ))}
                        </Flex>
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" fontSize={{ base: "xs", md: "sm" }}>
                        ຄຳສັ່ງ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedSalaries.length > 0 ? (
                      sortedSalaries.map((salary, index) => (
                        <Tr
                          key={salary._id}
                          _hover={{ bg: hoverBg }}
                          bg={index % 2 === 0 ? bgColor : "gray.50"}
                        >
                          <Td>
                            <Badge colorScheme="blue" p={1} borderRadius="md" fontSize="xs">
                              {salary.employeeCode}
                            </Badge>
                          </Td>
                          <Td fontSize={{ base: "xs", md: "sm" }}>
                            {formatDate(salary?.date)}
                          </Td>
                          <Td fontSize={{ base: "xs", md: "sm" }}>
                            {formatCurrency(salary.basicSalary)}
                          </Td>
                          <Td fontSize={{ base: "xs", md: "sm" }}>
                            {formatCurrency(salary.NetBennifits)}
                          </Td>
                           <Td fontSize={{ base: "xs", md: "sm" }}>
                            {formatCurrency(salary.netIncome)}
                          </Td>
                          <Td fontSize={{ base: "xs", md: "sm" }}>
                            {formatCurrency(salary.netExpense)}
                          </Td>
                          <Td fontSize={{ base: "xs", md: "sm" }}>
                            {formatCurrency(salary.socialSecurityMoney)}
                          </Td>
                          <Td fontSize={{ base: "xs", md: "sm" }}>
                            {formatCurrency(salary.tax)}
                          </Td>
                          <Td fontWeight="bold" color="green.600" fontSize={{ base: "xs", md: "sm" }}>
                            {formatCurrency(salary.netSalary)}
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={Button}
                                rightIcon={<ChevronDownIcon />}
                                size="sm"
                                colorScheme="blue"
                                fontSize={{ base: "xs", md: "sm" }}
                              >
                                ຄຳສັ່ງ
                              </MenuButton>
                              <MenuList>
                                <MenuItem onClick={() => generatePDF(salary)}>
                                  ລາຍລະອຽດ
                                </MenuItem>
                                <MenuItem onClick={() => handleClick(salary)}>
                                  ພິມໃບເງິນເດືອນ
                                </MenuItem>
                                <Divider />
                                <MenuItem
                                  onClick={() => handleDelete(salary._id)}
                                  color="red.500"
                                >
                                  ລຶບຂໍ້ມູນ
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={9} textAlign="center" py={10}>
                          <Text fontSize="lg" color="gray.500">
                            ບໍ່ພົບຂໍ້ມູນເງິນເດືອນພະນັກງານ
                          </Text>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            )}
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default SalaryDashboard;