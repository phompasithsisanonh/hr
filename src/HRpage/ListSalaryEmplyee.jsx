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
  Grid,
  GridItem,
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
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react"; // หรือไอคอนอื่น ๆ ที่ต้องการ
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
    console.log(input);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(`payslip_${id}.pdf`);
    });
  };
  const handleClick = (item) => {
    onOpen();
    console.log(item);
    setItem(item);
  };
  const handleDelete = (id) => {
    dispatch(deletesalarycalu(id)).then(() => dispatch(getSalary()));
  };
  const generatePDF = (data) => {
    const doc = new jsPDF();

    // Company Name
    doc.setFontSize(22);
    doc.text("YOUR COMPANY NAME", 105, 20, { align: "center" });

    // Slip Title
    doc.setFontSize(16);
    doc.text("ລາຍການເງິນເດືອນ ", 105, 30, { align: "center" });

    // Employee Info
    doc.setFontSize(12);
    doc.text(`${data.personalInfo.fullName}`, 20, 50);
    doc.text("Position: Software Developer", 20, 60);
    doc.text(`${data?.employeeCode}`, 20, 70);
    doc.text(data.date, 150, 50);

    // Salary Table
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

    // Signature Area
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.setFontSize(12);
    doc.text("ລາຍເຊັນ: _______________________", 20, finalY);

    // Footer
    doc.setFontSize(10);
    doc.text(
      "This is a computer-generated slip. No signature required if printed electronically.",
      20,
      290
    );

    // Save PDF
    doc.save("salary_slip.pdf");
  };

  return (
    <Box bg="gray.50" minH="100vh" py={8}>
      {/* //receipt */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="white" p="6" borderRadius="md" maxW="700px" w="100vw">
          <ModalHeader>
            {" "}
            <Flex justify="space-between" align="center" mb="4">
              <Text fontSize="xl" fontWeight="bold">
                ໃບເງິນເດືອນພະນັກງານ
              </Text>
            </Flex>
          </ModalHeader>

          <ModalBody>
            <Box ref={(el) => (payslipRef.current[item?.employeeCode] = el)}>
              {/* Header */}

              {/* Body */}
              <VStack spacing="6" align="stretch">
                {/* Company & Title */}
                <Flex paddingLeft={"30px"} align="center" gap="4">
                  <Image src="/api/placeholder/100/100" boxSize="70px" />
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">
                      ບໍລິສັດ ຊື່ບໍລິສັດຂອງທ່ານ
                    </Text>
                    <Text>ໃບເງິນເດືອນປະຈຳເດືອນ {formatDate(item?.date)}</Text>
                  </Box>
                </Flex>

                {/* Employee Details */}
                <Box paddingLeft={"30px"}>
                  <Flex mb="2">
                    <Text fontWeight="medium" minW="160px">
                      ລະຫັດພະນັກງານ:
                    </Text>
                    <Text>{item?.employeeCode}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="medium" minW="160px">
                      ວັນທີຈ່າຍເງິນເດືອນ:
                    </Text>
                    <Text>{formatDate(item?.date)}</Text>
                  </Flex>
                </Box>

                <Divider />

                {/* Salary Table */}
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th
                        fontFamily="Noto Sans Lao, serif"
                        colSpan="2"
                        textAlign="center"
                      >
                        ລາຍລະອຽດເງິນເດືອນ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>ເງິນເດືອນພື້ນຖານ</Td>
                      <Td isNumeric>{formatCurrency(item?.basicSalary)} LAK</Td>
                    </Tr>
                    <Tr>
                      <Td>ເງິນລວ່ງເວລາ</Td>
                      <Td isNumeric>
                        {formatCurrency(item?.salaryFirst - item?.basicSalary)}{" "}
                        LAK
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>ເງິນເດືອນຂັ້ນຕົ້ນ</Td>
                      <Td isNumeric>{formatCurrency(item?.salaryFirst)} LAK</Td>
                    </Tr>
                    <Tr bg="green.50">
                      <Td>ລາຍຮັບເພີ່ມ</Td>
                      <Td isNumeric>{formatCurrency(item?.netIncome)} LAK</Td>
                    </Tr>
                    <Tr bg="red.50">
                      <Td>ປະກັນສັງຄົມ</Td>
                      <Td isNumeric>
                        -{formatCurrency(item?.socialSecurityMoney)} LAK
                      </Td>
                    </Tr>
                    <Tr bg="red.50">
                      <Td>ລາຍຈ່າຍເພີ່ມ</Td>
                      <Td isNumeric>-{formatCurrency(item?.netExpense)} LAK</Td>
                    </Tr>
                    <Tr bg="red.50">
                      <Td>ອາກອນເງິນເດືອນ</Td>
                      <Td isNumeric>-{formatCurrency(item?.tax)} LAK</Td>
                    </Tr>
                    <Tr fontWeight="bold" bg="gray.100">
                      <Td>ເງິນເດືອນສຸດທິ</Td>
                      <Td isNumeric>{formatCurrency(item?.netSalary)} LAK</Td>
                    </Tr>
                  </Tbody>
                </Table>

                {/* Signatures */}
                <Flex justify="space-around" pt="6">
                  <Box textAlign="center">
                    <Box borderBottom="1px solid" w="150px" mb="2" />
                    <Text>ລາຍເຊັນພະນັກງານ</Text>
                  </Box>
                  <Box textAlign="center">
                    <Box borderBottom="1px solid" w="150px" mb="2" />
                    <Text>ລາຍເຊັນຜູ້ອໍານວຍການ</Text>
                  </Box>
                </Flex>
              </VStack>

              {/* Footer */}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Flex justify="flex-end" gap="3" mt="6" className="no-print">
              <IconButton
                icon={<Download />}
                colorScheme="red"
                size="md"
                onClick={() => downloadPDF(item.employeeCode)}
              />

              <Button
                colorScheme="blue"
                size="md"
                onClick={() => window.print()}
              >
                ພິມໃບເງິນເດືອນ
              </Button>
              <Button variant="outline" size="md" onClick={onClose}>
                ປິດ
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Container maxW="container.xl">
        <Card mb={6} shadow="md" borderRadius="lg">
          <CardHeader pb={0}>
            <Heading
              fontFamily="Noto Sans Lao, serif"
              size="lg"
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

            <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={6}>
              <GridItem>
                <Card bg="blue.50" borderRadius="lg">
                  <CardBody>
                    <Stat>
                      <StatLabel fontSize="md" color="blue.600">
                        ຈຳນວນພະນັກງານທັງໝົດ
                      </StatLabel>
                      <StatNumber color="blue.600" fontSize="2xl">
                        {totalEmployees}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card bg="green.50" borderRadius="lg">
                  <CardBody>
                    <Stat>
                      <StatLabel fontSize="md" color="green.600">
                        ເງິນເດືອນລວມທັງໝົດ
                      </StatLabel>
                      <StatNumber color="green.600" fontSize="2xl">
                        {formatCurrency(totalSalary)}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card bg="purple.50" borderRadius="lg">
                  <CardBody>
                    <Stat>
                      <StatLabel fontSize="md" color="purple.600">
                        ເງິນເດືອນສະເລ່ຍ
                      </StatLabel>
                      <StatNumber color="purple.600" fontSize="2xl">
                        {formatCurrency(averageSalary)}
                      </StatNumber>
                    </Stat>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>

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
              />
            </InputGroup>

            <Box overflowX="auto">
              <Table variant="simple" borderRadius="lg" overflow="hidden">
                <Thead bg="gray.100">
                  <Tr>
                    <Th
                      cursor="pointer"
                      onClick={() => requestSort("employeeCode")}
                      position="relative"
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
                    <Th cursor="pointer" onClick={() => requestSort("date")}>
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
                    <Th fontFamily="Noto Sans Lao, serif">ລາຍຮັບເພີ່ມ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ປະກັນສັງຄົມ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ອາກອນ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ລາຍຈ່າຍເພີ່ມ</Th>
                    <Th
                      cursor="pointer"
                      onClick={() => requestSort("netSalary")}
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
                    <Th fontFamily="Noto Sans Lao, serif">ຄຳສັ່ງ</Th>
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
                          <Badge colorScheme="blue" p={1} borderRadius="md">
                            {salary.employeeCode}
                          </Badge>
                        </Td>
                        <Td>{formatDate(salary?.date)}</Td>
                        <Td>{formatCurrency(salary.basicSalary)}</Td>
                        <Td>{formatCurrency(salary.netIncome)}</Td>
                        <Td>{formatCurrency(salary.socialSecurityMoney)}</Td>
                        <Td>{formatCurrency(salary.tax)}</Td>
                        <Td>{formatCurrency(salary.netExpense)}</Td>
                        <Td fontWeight="bold" color="green.600">
                          {formatCurrency(salary.netSalary)}
                        </Td>
                        <Td>
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
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default SalaryDashboard;
