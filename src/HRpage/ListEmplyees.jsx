import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Avatar,
  SimpleGrid,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  Image,
  HStack,
  VStack,
  Tag,
  useColorModeValue,
  IconButton,
  Tooltip,
  Progress,
} from "@chakra-ui/react";
import {
  User,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  DollarSign,
  FileText,
  Shield,
  Building,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { get_Id_user } from "../store/Reducer/Auth/auth";
import { useParams } from "react-router-dom";

// Utility Functions
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
console.log(get_Id_user);
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("la-LA", {
    style: "currency",
    currency: "LAK",
    minimumFractionDigits: 2,
  }).format(amount);
};

const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return years > 0
    ? `${years} year${years > 1 ? "s" : ""} ${
        remainingMonths > 0
          ? `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`
          : ""
      }`
    : `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
};

// Animation for card entrance

// Sub-Components
const PersonalInfo = ({ personalInfo }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <Card
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
      >
        <CardHeader
          bgGradient="linear(to-r, teal.500, blue.500)"
          color="white"
          borderTopRadius="xl"
        >
          <Heading size="md">Personal Information</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={2} spacing={4}>
            {[
              { label: "Full Name", value: personalInfo?.fullName },
              { label: "Date of Birth", value: formatDate(personalInfo?.dob) },
              { label: "Gender", value: personalInfo?.gender },
              { label: "Marital Status", value: personalInfo?.maritalStatus },
              { label: "Ethnicity", value: personalInfo?.ethnicity },
              { label: "Nationality", value: personalInfo?.nationality },
              { label: "Religion", value: personalInfo?.religion },
              { label: "Phone", value: personalInfo?.phone },
            ].map((item, index) => (
              <Box key={index}>
                <Text fontWeight="bold" fontSize="sm" color="gray.500">
                  {item.label}
                </Text>
                <Text>{item.value}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
      >
        <CardHeader
          bgGradient="linear(to-r, teal.500, blue.500)"
          color="white"
          borderTopRadius="xl"
        >
          <Heading size="md">Address & Documentation</Heading>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            {[
              { label: "Address", value: personalInfo?.address },
              { label: "Village", value: personalInfo?.village },
              { label: "District", value: personalInfo?.district },
              { label: "Document Type", value: personalInfo?.documentType },
              { label: "Document Number", value: personalInfo?.documentNumber },
            ].map((item, index) => (
              <Box key={index}>
                <Text fontWeight="bold" fontSize="sm" color="gray.500">
                  {item.label}
                </Text>
                <Text>{item.value}</Text>
              </Box>
            ))}
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text fontWeight="bold" fontSize="sm" color="gray.500">
                  Issue Date
                </Text>
                <Text>{formatDate(personalInfo?.issueDate)}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" fontSize="sm" color="gray.500">
                  Expiry Date
                </Text>
                <Text>{formatDate(personalInfo?.expiryDate)}</Text>
              </Box>
            </SimpleGrid>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.500" mb={2}>
                ID Card
              </Text>
              <Image
                src={personalInfo?.idCardImage}
                alt="ID Card"
                borderRadius="md"
                maxH="150px"
                border="1px"
                borderColor={borderColor}
                transition="all 0.3s"
                _hover={{ transform: "scale(1.05)" }}
              />
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

const EducationHistory = ({ educationHistory }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <VStack spacing={6} align="stretch">
      <Card
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
      >
        <CardHeader
          bgGradient="linear(to-r, purple.500, pink.500)"
          color="white"
          borderTopRadius="xl"
        >
          <Flex justify="space-between" align="center">
            <Heading size="md">{educationHistory?.level}</Heading>
            <Badge colorScheme="yellow">
              {educationHistory?.graduationYear}
            </Badge>
          </Flex>
        </CardHeader>
        <CardBody>
          {educationHistory?.map((educationHistory, index) => (
            <SimpleGrid key={index} columns={{ base: 1, md: 2 }} spacing={4}>
              <VStack align="stretch" spacing={3}>
                {[
                  { label: "Major", value: educationHistory?.major },
                  { label: "University", value: educationHistory?.university },
                  { label: "Country", value: educationHistory?.country },
                  { label: "GPA", value: educationHistory?.gpa },
                ].map((item, idx) => (
                  <HStack key={idx}>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">
                      {item.label}
                    </Text>
                    <Text>{item.value}</Text>
                  </HStack>
                ))}
              </VStack>
              <Box>
                <Text fontWeight="bold" fontSize="sm" color="gray.500" mb={2}>
                  Certificate
                </Text>
                <Image
                  src={educationHistory?.certificate}
                  alt={`${educationHistory?.level} Certificate`}
                  borderRadius="md"
                  maxH="100px"
                  border="1px"
                  borderColor={borderColor}
                  transition="all 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </Box>
            </SimpleGrid>
          ))}
        </CardBody>
      </Card>
    </VStack>
  );
};

const WorkExperience = ({ workExperience }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <VStack spacing={6} align="stretch">
      {workExperience?.map((workExperience, index) => (
        <Card
          bg={bgColor}
          borderRadius="xl"
          boxShadow="lg"
          _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
        >
          <CardHeader
            bgGradient="linear(to-r, green.500, teal.500)"
            color="white"
            borderTopRadius="xl"
          >
            <Flex justify="space-between" align="center">
              <Heading size="md">{workExperience?.position}</Heading>
              <Badge colorScheme="green">
                {formatDate(workExperience?.startDate).split(",")[0]} -{" "}
                {workExperience?.endDate
                  ? formatDate(workExperience?.endDate).split(",")[0]
                  : "Present"}
              </Badge>
            </Flex>
            <Text mt={1} color="gray.200">
              {workExperience?.company}
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <VStack align="stretch" spacing={3}>
                {[
                  {
                    label: "Start Date",
                    value: formatDate(workExperience?.startDate),
                  },
                  {
                    label: "End Date",
                    value: workExperience?.endDate
                      ? formatDate(workExperience?.endDate)
                      : "Present",
                  },
                  {
                    label: "Duration",
                    value: calculateDuration(
                      workExperience?.startDate,
                      workExperience?.endDate
                    ),
                  },
                ].map((item, idx) => (
                  <Box key={idx}>
                    <Text fontWeight="bold" fontSize="sm" color="gray.500">
                      {item.label}
                    </Text>
                    <Text>{item.value}</Text>
                  </Box>
                ))}
              </VStack>
              <Box>
                <Text fontWeight="bold" fontSize="sm" color="gray.500" mb={2}>
                  Reference
                </Text>
                <Image
                  src={workExperience?.referenceFile}
                  alt={`${workExperience?.company} Reference`}
                  borderRadius="md"
                  maxH="100px"
                  border="1px"
                  borderColor={borderColor}
                  transition="all 0.3s"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </Box>
            </SimpleGrid>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

const EmploymentInfo = ({ employmentInfo, department, position }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const calculateProgress = (startDate, durationMonths) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(start.getMonth() + durationMonths);
    const totalDuration = end - start;
    const elapsed = new Date() - start;
    return Math.min((elapsed / totalDuration) * 100, 100);
  };

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <Card
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
      >
        <CardHeader
          bgGradient="linear(to-r, blue.500, cyan.500)"
          color="white"
          borderTopRadius="xl"
        >
          <Heading size="md">Employment Details</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {[
              { label: "Department", value: department?.type },
              { label: "Position", value: position?.type },
              { label: "Contract Type", value: employmentInfo?.contractType },
              { label: "Workplace", value: employmentInfo?.workplace },
              {
                label: "Start Date",
                value: formatDate(employmentInfo?.startDate),
              },
              {
                label: "Contract Duration",
                value: `${employmentInfo?.contractDuration} months`,
              },
              {
                label: "Probation Period",
                value: `${employmentInfo?.probationPeriod} months`,
              },
              {
                label: "Work Hours",
                value: `${employmentInfo?.workStartTime} - ${employmentInfo?.workEndTime}`,
              },
            ].map((item, index) => (
              <Box key={index}>
                <Text fontWeight="bold" fontSize="sm" color="gray.500">
                  {item.label}
                </Text>
                <Text>{item.value}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
      >
        <CardHeader
          bgGradient="linear(to-r, blue.500, cyan.500)"
          color="white"
          borderTopRadius="xl"
        >
          <Heading size="md">Contract Information</Heading>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.500" mb={2}>
                Contract Document
              </Text>
              <Image
                src={employmentInfo?.contractFile}
                alt="Contract Document"
                borderRadius="md"
                maxH="200px"
                border="1px"
                borderColor={borderColor}
                transition="all 0.3s"
                _hover={{ transform: "scale(1.05)" }}
              />
              <HStack mt={3} justify="center">
                <Tooltip label="Download Contract">
                  <IconButton
                    aria-label="Download contract"
                    icon={<FileText size={18} />}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleDownload(employmentInfo?.contractFile)}
                  />
                </Tooltip>
              </HStack>
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.500">
                Contract Progress
              </Text>
              <Progress
                value={calculateProgress(
                  employmentInfo?.startDate,
                  employmentInfo?.contractDuration
                )}
                size="sm"
                colorScheme="teal"
                mt={2}
              />
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.500">
                Probation Progress
              </Text>
              <Progress
                value={calculateProgress(
                  employmentInfo?.startDate,
                  employmentInfo?.probationPeriod
                )}
                size="sm"
                colorScheme="purple"
                mt={2}
              />
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.500">
                Contract End Date
              </Text>
              <Text>
                {(() => {
                  const startDate = new Date(employmentInfo?.startDate);
                  const endDate = new Date(startDate);
                  endDate.setMonth(
                    startDate.getMonth() + employmentInfo?.contractDuration
                  );
                  return formatDate(endDate);
                })()}
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="gray.500">
                Probation End Date
              </Text>
              <Text>
                {(() => {
                  const startDate = new Date(employmentInfo?.startDate);
                  const endDate = new Date(startDate);
                  endDate.setMonth(
                    startDate.getMonth() + employmentInfo?.probationPeriod
                  );
                  return formatDate(endDate);
                })()}
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

const CompensationInfo = ({ salaryInfo, salarydetail }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      <Card
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
      >
        <CardHeader
          bgGradient="linear(to-r, orange.500, red.500)"
          color="white"
          borderTopRadius="xl"
        >
          <Heading size="md">Salary Information</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {[
              {
                label: "Base Salary",
                value: formatCurrency(salaryInfo?.baseSalary),
                color: "teal.500",
                fontWeight: "bold",
              },
              {
                label: "Overtime Rate",
                value: `${salaryInfo?.overtimeRate.toLocaleString()} kip`,
              },
              { label: "Commission Type", value: salaryInfo?.commissionType },
              {
                label: "Commission Rate",
                value: `${salaryInfo?.commissionRate || 0}%`,
              },
              {
                label: "Annual Holidays",
                value: `${salaryInfo?.annualHolidays} days`,
              },
            ].map((item, index) => (
              <Box key={index}>
                <Text fontWeight="bold" fontSize="sm" color="gray.500">
                  {item.label}
                </Text>
                <Text
                  fontSize={item.fontWeight ? "lg" : "md"}
                  fontWeight={item.fontWeight}
                  color={item.color}
                >
                  {item.value}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

const BenefitsInfo = ({
  socialSecurity,
  dataset,
  annualHolidays,
  benefits,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <VStack spacing={6} align="stretch">
      <Card
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
      >
        <CardHeader
          bgGradient="linear(to-r, teal.500, cyan.500)"
          color="white"
          borderTopRadius="xl"
        >
          <Heading fontFamily="Noto Sans Lao, serif" size="md">ປະກັນໄພ</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {socialSecurity?.map((security, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={borderColor}
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                transition="all 0.3s"
                _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
              >
                <HStack mb={2}>
                  <Shield size={18} />
                  <Text fontWeight="bold">{security.type}</Text>
                </HStack>
                <VStack align="flex-start" spacing={2} pl={6}>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      Rate:
                    </Text>{" "}
                    {security.rate}
                  </Text>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      Registration Place:
                    </Text>{" "}
                    {security.registrationPlace}
                  </Text>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      Registration Date:
                    </Text>{" "}
                    {formatDate(security.registrationDate)}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          <CardHeader
            bgGradient="linear(to-r, teal.500, cyan.500)"
            color="white"
            borderTopRadius="xl"
          >
            <Heading fontFamily="Noto Sans Lao, serif" size="md">
              ສິດທິຜົນປະໂຫຍດ
            </Heading>
          </CardHeader>

          <SimpleGrid paddingTop={'20px'} columns={{ base: 1, md: 2 }} spacing={6}>
            {benefits?.map((benefits, index) => (
              <Box
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={borderColor}
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                transition="all 0.3s"
                _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
              >
                <HStack mb={2}>
                  <Shield size={18} />
                  <Text fontWeight="bold">{benefits.type}</Text>
                </HStack>
                <VStack align="flex-start" spacing={2} pl={6}>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      ຊື່:
                    </Text>{" "}
                    {benefits.name}
                  </Text>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      eligibility:
                    </Text>{" "}
                    {benefits.eligibility}
                  </Text>
                  <Text fontSize="sm">
                    <Text as="span" fontWeight="semibold">
                      ຈຳນວນເງິນ:
                    </Text>{" "}
                    {formatCurrency(benefits?.amount)}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card
        bg={bgColor}
        borderRadius="xl"
        boxShadow="lg"
        _hover={{ transform: "translateY(-4px)", transition: "all 0.3s" }}
      >
        <CardHeader
          bgGradient="linear(to-r, teal.500, cyan.500)"
          color="white"
          borderTopRadius="xl"
        >
          <Heading fontFamily="Noto Sans Lao, serif" size="md">
            Leave Balance ຈຳນວນວັນລາທັງໝົດທີ່ມີ {annualHolidays}
          </Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
            {dataset?.map((item, index) => (
              <Box
                p={4}
                borderRadius="md"
                bg="green.50"
                _dark={{ bg: "green.900" }}
                textAlign="center"
                transition="all 0.3s"
                _hover={{ bg: "green.100" }}
                key={index}
              >
                <Text color="green.500" fontSize="sm" mt={1}>
                  ຄົງເຫຼືອວັນລາ:{item?.countsix}
                </Text>
                <Heading
                  fontFamily="Noto Sans Lao, serif"
                  size="md"
                  color="green.500"
                >
                  {item?.content} {item?.countholidayreq} ວັນ
                </Heading>
                <Text fontSize="sm" mt={1}></Text>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
};

// Mock download function
const handleDownload = (fileUrl) => {
  console.log(`Downloading file: ${fileUrl}`);
  // Implement actual download logic here
};

// Main Component
const ListEmplyees = () => {
  const [activeTab, setActiveTab] = useState(0);
  const bgColor = useColorModeValue("whiteAlpha.900", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const dispatch = useDispatch();
  const { id } = useParams();
  const { get_id_emplyee } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(get_Id_user(id));
  }, [dispatch, id]);
  return (
    <Container
      maxW="container.xl"
      py={8}
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
    >
      {/* Header Section */}
      <Box
        bg={cardBg}
        p={6}
        borderRadius="xl"
        boxShadow="xl"
        mb={6}
        backdropFilter="blur(10px)"
        bgGradient="linear(to-b, whiteAlpha.900, whiteAlpha.700)"
        _dark={{ bgGradient: "linear(to-b, gray.800, gray.700)" }}
      >
        <HStack spacing={6} align="flex-start">
          <Avatar
            size="xl"
            name={get_id_emplyee?.personalInfo?.fullName}
            src={get_id_emplyee?.personalInfo?.profileImage}
            bg="teal.500"
            border="4px"
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ transform: "scale(1.1)" }}
          />
          <VStack align="flex-start" flex={1} spacing={1}>
            <Flex width="100%" justify="space-between" align="center">
              <Heading size="lg">
                {get_id_emplyee?.personalInfo?.fullName}
              </Heading>
              <Badge
                colorScheme="teal"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                bgGradient="linear(to-r, teal.500, cyan.500)"
                color="white"
              >
                ID: {get_id_emplyee?.emplyeebarCode}
              </Badge>
            </Flex>
            <HStack>
              <Tag size="md" colorScheme="blue" borderRadius="full">
                {get_id_emplyee?.position?.type}
              </Tag>
              <Tag size="md" colorScheme="purple" borderRadius="full">
                {get_id_emplyee?.department?.type}
              </Tag>
            </HStack>
            <HStack mt={2} color="gray.600">
              <HStack>
                <Phone size={16} />
                <Text fontSize="sm">{get_id_emplyee?.personalInfo?.phone}</Text>
              </HStack>
              <HStack>
                <MapPin size={16} />
                <Text fontSize="sm" noOfLines={1}>
                  {get_id_emplyee?.personalInfo?.address}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </Box>

      {/* Tabs Section */}
      <Tabs
        variant="soft-rounded"
        colorScheme="teal"
        index={activeTab}
        onChange={(index) => setActiveTab(index)}
        bg={cardBg}
        p={4}
        borderRadius="xl"
        boxShadow="xl"
        backdropFilter="blur(10px)"
        bgGradient="linear(to-b, whiteAlpha.900, whiteAlpha.700)"
        _dark={{ bgGradient: "linear(to-b, gray.800, gray.700)" }}
      >
        <TabList
          mb={4}
          overflowX="auto"
          py={2}
          bg={bgColor}
          borderRadius="xl"
          px={4}
        >
          {[
            { icon: User, label: "Personal" },
            { icon: GraduationCap, label: "Education" },
            { icon: Briefcase, label: "Work Experience" },
            { icon: Building, label: "Employment" },
            { icon: DollarSign, label: "Compensation" },
            { icon: Shield, label: "Benefits" },
          ].map((tab, index) => (
            <Tab key={index} fontWeight="semibold" fontSize="sm">
              <tab.icon size={18} style={{ marginRight: "8px" }} />
              {tab.label}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          <TabPanel>
            <PersonalInfo personalInfo={get_id_emplyee?.personalInfo} />
          </TabPanel>
          <TabPanel>
            <EducationHistory
              educationHistory={get_id_emplyee?.educationHistory}
            />
          </TabPanel>
          <TabPanel>
            <WorkExperience workExperience={get_id_emplyee?.workExperience} />
          </TabPanel>
          <TabPanel>
            <EmploymentInfo
              employmentInfo={get_id_emplyee?.employmentInfo}
              department={get_id_emplyee?.department}
              position={get_id_emplyee?.position}
            />
          </TabPanel>
          <TabPanel>
            <CompensationInfo
              salaryInfo={get_id_emplyee?.salaryInfo}
              salarydetail={get_id_emplyee?.salarydetail}
            />
          </TabPanel>
          <TabPanel>
            <BenefitsInfo
              socialSecurity={get_id_emplyee?.socialSecurity}
              dataset={get_id_emplyee?.dataset}
              annualHolidays={get_id_emplyee?.salaryInfo?.annualHolidays}
              benefits={get_id_emplyee?.bennifits}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default ListEmplyees;
