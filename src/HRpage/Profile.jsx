import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Avatar,
  Text,
  Button,
  Divider,
  Card,
  CardBody,
  Heading,
  useColorModeValue,
  Grid,
  GridItem,
  Badge,
  Input,
  FormControl,
  FormLabel,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  Container,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Spacer,
  Image,
} from "@chakra-ui/react";
import {
  EditIcon,
  EmailIcon,
  PhoneIcon,
  CalendarIcon,
  StarIcon,
  AddIcon,
} from "@chakra-ui/icons";
import {
  deletePostNotice,
  editPostNotice,
  editProfile,
  get_user_info,
  getPostNotice,
  logout,
  messageClear,
  postNotice,
} from "../store/Reducer/Auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { DeleteIcon } from "lucide-react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
const ProfileUI = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const placeholderColor = useColorModeValue("gray.400", "gray.500");

  //post
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Welcome to the Notice Board",
      content:
        "This is your first notice. You can create, edit, and delete notices using the buttons provided.",
      author: "Admin",
      date: "2024-05-28",
      priority: "normal",
    },
    {
      id: 2,
      title: "Important System Maintenance",
      content:
        "System maintenance will be performed this weekend. Please save your work regularly.",
      author: "IT Department",
      date: "2024-05-27",
      priority: "high",
    },
  ]);

  const [currentNotice, setCurrentNotice] = useState({
    id: null,
    title: "",
    content: "",
    author: "",
    postImage: "",
    priority: "normal",
  });
  console.log(currentNotice);
  const dispatch = useDispatch();
  const {
    userInfo,
    getPostNoti,
    loader,
    errorMessage,
    successMessage,
  } = useSelector((state) => state.auth);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    email: "",
    role: "",
    typeBusiness: "",
    address: "",
    image: "",
    status: "",
    createdAt: "",
  });

  useEffect(() => {
    dispatch(get_user_info());
    dispatch(getPostNotice());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo?.name || "",
        tel: userInfo?.tel || "",
        email: userInfo?.email || "",
        role: userInfo?.role || "",
        typeBusiness: userInfo?.typeBusiness || "",
        address: userInfo?.address || "",
        image: userInfo?.image || "",
        status: userInfo?.status || "",
        createdAt: userInfo?.createdAt
          ? new Date(userInfo.createdAt).toLocaleDateString()
          : "",
      });
    }
  }, [userInfo]);

  // Mock user data
  const user = {
    name: "Sarah Chen",
    title: "Senior Product Designer",
    company: "TechFlow Inc.",
    location: "San Francisco, CA",
    email: "sarah.chen@techflow.com",
    phone: "+1 (555) 234-5678",
    joinDate: "March 2021",
    bio:
      "Passionate product designer with 8+ years of experience creating user-centered digital solutions. I specialize in design systems, user research, and bridging the gap between business goals and user needs.",
    stats: {
      projects: 47,
      reviews: 128,
      rating: 4.9,
      completion: 95,
    },
    skills: [
      { name: "UI/UX Design", level: 95 },
      { name: "Figma", level: 90 },
      { name: "Prototyping", level: 88 },
      { name: "User Research", level: 85 },
      { name: "Design Systems", level: 92 },
      { name: "React", level: 75 },
    ],
    experience: [
      {
        role: "Senior Product Designer",
        company: "TechFlow Inc.",
        period: "2021 - Present",
        description:
          "Leading design initiatives for mobile and web applications",
      },
      {
        role: "Product Designer",
        company: "StartupHub",
        period: "2019 - 2021",
        description: "Designed user experiences for B2B SaaS products",
      },
      {
        role: "Junior Designer",
        company: "CreativeSpace",
        period: "2017 - 2019",
        description: "Created visual designs and marketing materials",
      },
    ],
    achievements: [
      "Design Team Lead of the Year 2023",
      "Best Mobile App Design Award",
      "UX Research Excellence Recognition",
    ],
  };

  const handleEditProfile = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const prepareFormData = () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("tel", formData.tel);
    data.append("typeBusiness", formData.typeBusiness);
    data.append("address", formData.address);
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }
    return data;
  };

  const handleSubmit = () => {
    if (!userInfo?._id) return;
    const data = prepareFormData();
    dispatch(editProfile({ id: userInfo._id, formData: data })).then(() =>
      dispatch(getPostNotice())
    );
    onClose();
  };

  //post
  const [isEditing, setIsEditing] = useState(false);

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const handleCreateNew = () => {
    // dispatch(postNotice({ formData: currentNotice }));

    setCurrentNotice({
      id: null,
      title: "",
      content: "",
      author: "",
      priority: "normal",
    });
    setIsEditing(false);
    onModalOpen();
  };
  const handleImageNoticeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentNotice((prevData) => ({
        ...prevData,
        postImage: file,
      }));
    }
  };
  const handleEdit = (notice) => {
    setCurrentNotice(notice);
    setIsEditing(true);
    onModalOpen();
  };

  const handleDelete = (id) => {
    dispatch(deletePostNotice({ id })).then(() => dispatch(getPostNotice()));
  };
  const handleSave = () => {
    // Check if all required fields are filled
    const isPdfnew = currentNotice?.postImage?.type === "application/pdf";
    const isExcelnew =
      currentNotice?.postImage?.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const isWordnew =
      currentNotice?.postImage?.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (
      !currentNotice.title.trim() ||
      !currentNotice.content.trim() ||
      !currentNotice.author.trim()
    ) {
      return;
    }

    if (isEditing) {
      // const getFileNameFromUrl = (url) => {
      //   if (typeof url !== "string") return null;
      //   const parts = url.split("/");
      //   return parts[parts.length - 1]; // เอาตัวสุดท้ายของ path
      // };
      // const isPdf = getFileNameFromUrl(currentNotice?.postImage) === ".pdf";
      // const isExcel = getFileNameFromUrl(currentNotice?.postImage) === ".xlsx";
      // const isWord = getFileNameFromUrl(currentNotice?.postImage) === ".docx";

      // if (isPdf || isExcel || isWord) {
      //   toast.error("PDF uploads are not supported yet", {
      //     duration: 3000,
      //     position: "top",
      //   });
      //   return;
      // }

      if (isPdfnew || isExcelnew || isWordnew) {
        toast.error(
          `ຂໍອະໄພ ລະບົບຍັງບໍ່ຮັບຮອງ ການອັບໂຫຼດ ${
            isPdfnew ? "PDF" : isExcelnew ? "Excel" : "Word"
          } `,
          {
            duration: 3000,
            position: "top",
          }
        );
      }
      dispatch(
        editPostNotice({
          id: currentNotice._id,
          formData: currentNotice,
        })
      ).then(() => dispatch(getPostNotice()));
    } else {
      if (isPdfnew || isExcelnew || isWordnew) {
        toast.error(
          `ຂໍອະໄພ ລະບົບຍັງບໍ່ຮັບຮອງ ການອັບໂຫຼດ ${
            isPdfnew ? "PDF" : isExcelnew ? "Excel" : "Word"
          } `,
          {
            duration: 3000,
            position: "top",
          }
        );
      }

      dispatch(postNotice({ formData: currentNotice })).then(() =>
        dispatch(getPostNotice())
      );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      default:
        return "blue";
    }
  };
  function FilePreview({ fileUrl }) {
    const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");

    const proxyUrl = fileUrl ? `${fileUrl}` : null;

    return isPdf ? (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={proxyUrl} />
      </Worker>
    ) : (
      <Image src={proxyUrl} alt="preview" maxW="300px" />
    );
  }
  const handlelogout = () => {
    dispatch(logout());
    
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        duration: 3000,
        position: "top",
      });
      dispatch(messageClear());
      setNotices("");
    }

    if (errorMessage) {
      toast.error(errorMessage, {
        duration: 3000,
        position: "top",
      });
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  if (!userInfo) {
    return <Box>Loading...</Box>;
  }

  return (
    // Remove ChakraProvider if it's already set at the app level
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="6xl" py={8}>
        {/* Header Section with Cover */}
        <Card mb={6} overflow="hidden" bg={cardBg} shadow="lg">
          <Box
            h="200px"
            bgGradient={
              !formData.image
                ? "linear(135deg, blue.400, purple.500, pink.400)"
                : undefined
            }
            backgroundImage={
              formData.image ? `url(${formData.image})` : undefined
            }
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            filter="brightness(0.8)"
            boxShadow="md"
            width="100%"
            height="200px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            textAlign="center"
            fontSize="xl"
            fontWeight="bold"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,

              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
            }}
            position="relative"
            borderRadius="md"
            overflow="hidden"
          ></Box>

          <CardBody pb={6}>
            <Flex direction={{ base: "column", md: "row" }} align="start">
              <Box
                position="relative"
                mr={{ base: 0, md: 6 }}
                mb={{ base: 4, md: 0 }}
              >
                <Avatar
                  size="2xl"
                  name={formData.name}
                  src={formData.image || "https://via.placeholder.com/150"}
                  border="4px solid"
                  borderColor={cardBg}
                  mt="-75px"
                />
                <IconButton
                  icon={<EditIcon />}
                  size="sm"
                  colorScheme="blue"
                  isRound
                  position="absolute"
                  bottom="0"
                  right="0"
                  onClick={onOpen}
                />
              </Box>

              <Flex flex="1" justify="space-between" align="start" w="full">
                <VStack align="start" spacing={2}>
                  <Heading
                    fontFamily="Noto Sans Lao, serif"
                    size="lg"
                    color={textColor}
                  >
                    {formData.name || "User Name"}
                  </Heading>
                  <Text fontSize="lg" color={accentColor} fontWeight="medium">
                    role: {formData.role || "N/A"}
                  </Text>
                  <HStack spacing={4} mt={2}>
                    <Badge colorScheme="green" variant="subtle">
                      {formData.status || "Active"}
                    </Badge>
                  </HStack>
                </VStack>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
          <Card bg={cardBg} shadow="md">
            <CardBody textAlign="center">
              <Stat>
                <StatNumber color={accentColor}>
                  {user.stats.projects}
                </StatNumber>
                <StatLabel color={subtextColor}>Projects</StatLabel>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md">
            <CardBody textAlign="center">
              <Stat>
                <StatNumber color={accentColor}>
                  {user.stats.reviews}
                </StatNumber>
                <StatLabel color={subtextColor}>Reviews</StatLabel>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md">
            <CardBody textAlign="center">
              <Stat>
                <StatNumber color={accentColor}>{user.stats.rating}</StatNumber>
                <StatLabel color={subtextColor}>Rating</StatLabel>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="md">
            <CardBody textAlign="center">
              <Stat>
                <StatNumber color={accentColor}>
                  {user.stats.completion}%
                </StatNumber>
                <StatLabel color={subtextColor}>Complete</StatLabel>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          {/* Main Content */}
          <GridItem>
            <Card bg={cardBg} shadow="lg">
              <CardBody>
                <Tabs variant="soft-rounded" colorScheme="blue">
                  <TabList mb={6}>
                    <Tab>Overview</Tab>
                    <Tab>ແຈ້ງການ</Tab>
                  </TabList>

                  <TabPanels>
                    {/* Overview Tab */}
                    <TabPanel px={0}>
                      <VStack align="start" spacing={6}>
                        <Box>
                          <Heading
                            fontFamily="Noto Sans Lao, serif"
                            size="md"
                            mb={3}
                            color={textColor}
                          >
                            ກ່ຽວກັບບໍລິສັດປະຫວັດຫຍໍ້
                          </Heading>
                          <Text color={subtextColor} lineHeight="tall">
                            {user.bio}
                          </Text>
                        </Box>

                        <Divider />

                        <Box w="full">
                          <Heading
                            fontFamily="Noto Sans Lao, serif"
                            size="md"
                            mb={3}
                            color={textColor}
                          >
                            ຂໍ້ມູນພື້ນຖານຂອງບໍລິສັດ
                          </Heading>
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <StarIcon color="yellow.400" boxSize={4} />
                              <Text color={subtextColor} fontSize="sm">
                                ປະເພດທຸລະກິດ: {formData.typeBusiness || "N/A"}
                              </Text>
                            </HStack>
                            <HStack>
                              <StarIcon color="yellow.400" boxSize={4} />
                              <Text color={subtextColor} fontSize="sm">
                                ທີ່ຢູ່: {formData.address || "N/A"}
                              </Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </VStack>
                    </TabPanel>

                    {/* Experience Tab */}
                    <TabPanel px={0}>
                      <Flex mb={6} align="center">
                        <Heading size="lg" color={textColor}>
                          Notice Board
                        </Heading>
                        <Spacer />
                        <Button
                          leftIcon={<AddIcon />}
                          colorScheme="blue"
                          onClick={handleCreateNew}
                        >
                          Create Notice
                        </Button>
                      </Flex>
                      <VStack spacing={4} align="stretch">
                        {getPostNoti.length === 0 ? (
                          <Card>
                            <CardBody>
                              <Text
                                color={subtextColor}
                                textAlign="center"
                                py={8}
                              >
                                No notices yet. Create your first notice!
                              </Text>
                            </CardBody>
                          </Card>
                        ) : loader ? (
                          <></>
                        ) : (
                          getPostNoti.map((notice, index) => (
                            <Card
                              key={notice.id}
                              bg={bgColor}
                              borderColor={borderColor}
                            >
                              <CardBody>
                                <HStack
                                  justify="space-between"
                                  align="start"
                                  mb={3}
                                >
                                  <VStack align="start" spacing={1} flex={1}>
                                    <Heading
                                      fontFamily="Noto Sans Lao, serif"
                                      size="md"
                                      color={textColor}
                                    >
                                      {notice.title}
                                    </Heading>
                                    <HStack spacing={3}>
                                      <Text
                                        color={accentColor}
                                        fontWeight="medium"
                                        fontSize="sm"
                                      >
                                        By {notice.author}
                                      </Text>
                                      <Text color={subtextColor} fontSize="sm">
                                        {new Date(
                                          notice.date
                                        ).toLocaleDateString()}
                                      </Text>
                                      <Badge
                                        colorScheme={getPriorityColor(
                                          notice.priority
                                        )}
                                        variant="subtle"
                                        textTransform="capitalize"
                                      >
                                        {notice.priority} Priority
                                      </Badge>

                                      {/* {notice.postImage && (
                                        <FilePreview
                                          fileUrl={notice.postImage}
                                        />
                                      )} */}
                                    </HStack>
                                  </VStack>
                                  <HStack spacing={2}>
                                    <IconButton
                                      icon={<EditIcon />}
                                      size="sm"
                                      colorScheme="blue"
                                      variant="ghost"
                                      onClick={() => handleEdit(notice)}
                                      aria-label="Edit notice"
                                    />
                                    <IconButton
                                      icon={<DeleteIcon />}
                                      size="sm"
                                      colorScheme="red"
                                      variant="ghost"
                                      onClick={() => handleDelete(notice._id)}
                                      aria-label="Delete notice"
                                    />
                                  </HStack>
                                </HStack>

                                <Text
                                  color={subtextColor}
                                  fontSize="sm"
                                  lineHeight="1.6"
                                >
                                  {notice.content}
                                </Text>

                                {index < notices.length - 1 && (
                                  <Divider mt={4} />
                                )}
                              </CardBody>
                            </Card>
                          ))
                        )}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <VStack spacing={6}>
              {/* Contact Information */}
              <Card bg={cardBg} shadow="lg" w="full">
                <CardBody>
                  <Heading size="md" mb={4} color={textColor}>
                    Contact Info
                  </Heading>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <EmailIcon color={accentColor} />
                      <Text fontSize="sm" color={subtextColor}>
                        {formData.email || "N/A"}
                      </Text>
                    </HStack>
                    <HStack>
                      <PhoneIcon color={accentColor} />
                      <Text fontSize="sm" color={subtextColor}>
                        {formData.tel || "N/A"}
                      </Text>
                    </HStack>
                    <HStack>
                      <CalendarIcon color={accentColor} />
                      <Text fontSize="sm" color={subtextColor}>
                        Joined {formData.createdAt || "N/A"}
                      </Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card bg={cardBg} shadow="lg" w="full">
                <CardBody>
                  <Heading size="md" mb={4} color={textColor}>
                    Quick Actions
                  </Heading>
                  <VStack spacing={3}>
                    <Button
                      w="full"
                      onClick={onOpen}
                      leftIcon={<EditIcon />}
                      colorScheme="blue"
                      variant="outline"
                    >
                      ແກ້ໄຂໂປຣໄຟລ
                    </Button>
                    {/* <Button
                      w="full"
                      leftIcon={<SettingsIcon />}
                      variant="outline"
                    >
                      Settings
                    </Button> */}
                    <Button
                      w="full"
                      onClick={() => handlelogout()}
                      colorScheme="red"
                      variant="outline"
                    >
                      ອອກຈາກລະບົບ
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ແກ້ໄຂໂປຣໄຟລ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={6}
              align="start"
              w="full"
              p={6}
              bg={bg}
              borderRadius="lg"
              boxShadow="md"
              transition="all 0.3s"
            >
              <HStack spacing={4} w="full">
                <Avatar
                  size="xl"
                  name={formData.name}
                  src={
                    formData.image instanceof File
                      ? URL.createObjectURL(formData.image)
                      : formData.image || "https://via.placeholder.com/150"
                  }
                  border="3px solid"
                  borderColor={borderColor}
                  transition="border-color 0.3s"
                  _hover={{ borderColor: "blue.400" }}
                />
                <Button
                  as="label"
                  htmlFor="file-upload"
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  px={6}
                  fontWeight="medium"
                  borderRadius="md"
                  _hover={{ bg: "blue.50", transform: "translateY(-2px)" }}
                  transition="all 0.2s"
                >
                  ເພີ່ມຮູບ
                  <input
                    id="file-upload"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </Button>
              </HStack>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                  ຊື່:
                </FormLabel>
                <Input
                  type="text"
                  name="name"
                  placeholder="ຊື່ບໍລິສັດ"
                  value={formData.name}
                  onChange={handleEditProfile}
                  bg={inputBg}
                  borderColor={borderColor}
                  borderRadius="md"
                  size="md"
                  focusBorderColor="blue.400"
                  _placeholder={{ color: placeholderColor }}
                  transition="all 0.2s"
                  _hover={{ borderColor: "blue.300" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                  ອີເມວ:
                </FormLabel>
                <Input
                  type="email"
                  name="email"
                  isDisabled
                  placeholder="ອີເມວ"
                  value={formData.email}
                  onChange={handleEditProfile}
                  bg={inputBg}
                  borderColor={borderColor}
                  borderRadius="md"
                  size="md"
                  focusBorderColor="blue.400"
                  _placeholder={{ color: placeholderColor }}
                  opacity={0.7}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                  ເບີໂທ:
                </FormLabel>
                <Input
                  type="tel"
                  name="tel"
                  value={formData.tel}
                  onChange={handleEditProfile}
                  bg={inputBg}
                  borderColor={borderColor}
                  borderRadius="md"
                  size="md"
                  focusBorderColor="blue.400"
                  _placeholder={{ color: placeholderColor }}
                  transition="all 0.2s"
                  _hover={{ borderColor: "blue.300" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                  typeBusiness:
                </FormLabel>
                <Input
                  type="text"
                  name="typeBusiness"
                  placeholder="typeBusiness"
                  value={formData.typeBusiness}
                  onChange={handleEditProfile}
                  bg={inputBg}
                  borderColor={borderColor}
                  borderRadius="md"
                  size="md"
                  focusBorderColor="blue.400"
                  _placeholder={{ color: placeholderColor }}
                  transition="all 0.2s"
                  _hover={{ borderColor: "blue.300" }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                  address:
                </FormLabel>
                <Input
                  type="text"
                  name="address"
                  placeholder="address"
                  value={formData.address}
                  onChange={handleEditProfile}
                  bg={inputBg}
                  borderColor={borderColor}
                  borderRadius="md"
                  size="md"
                  focusBorderColor="blue.400"
                  _placeholder={{ color: placeholderColor }}
                  transition="all 0.2s"
                  _hover={{ borderColor: "blue.300" }}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              ປິດ
            </Button>
            <Button onClick={handleSubmit} variant="ghost">
              ບັນທຶກການປ່ຽນແປງ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Create/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEditing ? "Edit Notice" : "Create New Notice"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={currentNotice.title}
                  onChange={(e) =>
                    setCurrentNotice({
                      ...currentNotice,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter notice title"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Author</FormLabel>
                <Input
                  value={currentNotice.author}
                  onChange={(e) =>
                    setCurrentNotice({
                      ...currentNotice,
                      author: e.target.value,
                    })
                  }
                  placeholder="Enter your name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Box>
                  <HStack spacing={3}>
                    {["normal", "medium", "high"].map((priority) => (
                      <Button
                        key={priority}
                        size="sm"
                        variant={
                          currentNotice.priority === priority
                            ? "solid"
                            : "outline"
                        }
                        colorScheme={getPriorityColor(priority)}
                        onClick={() =>
                          setCurrentNotice({
                            ...currentNotice,
                            priority,
                          })
                        }
                        textTransform="capitalize"
                      >
                        {priority}
                      </Button>
                    ))}
                  </HStack>

                  <HStack spacing={4} w="full">
                    <Button
                      as="label"
                      htmlFor="file-upload"
                      colorScheme="blue"
                      variant="outline"
                      size="md"
                      px={6}
                      fontWeight="medium"
                      borderRadius="md"
                      _hover={{ bg: "blue.50", transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                    >
                      ເພີ່ມຮູບ
                      <input
                        id="file-upload"
                        type="file"
                        name="postImage"
                        accept="png/*"
                        onChange={handleImageNoticeChange}
                        style={{ display: "none" }}
                      />
                    </Button>
                    {currentNotice.postImage && (
                      <FilePreview
                        fileUrl={
                          currentNotice.postImage instanceof File
                            ? URL.createObjectURL(currentNotice.postImage)
                            : currentNotice.postImage
                        }
                      />
                    )}
                  </HStack>
                </Box>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Content</FormLabel>
                <Textarea
                  value={currentNotice.content}
                  onChange={(e) =>
                    setCurrentNotice({
                      ...currentNotice,
                      content: e.target.value,
                    })
                  }
                  placeholder="Enter notice content"
                  rows={6}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSave}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Skills Tab */}
      {/* <TabPanel px={0}>
                      <VStack align="start" spacing={4} w="full">
                        {user.skills.map((skill, index) => (
                          <Box key={index} w="full">
                            <Flex justify="space-between" mb={2}>
                              <Text fontWeight="medium" color={textColor}>
                                {skill.name}
                              </Text>
                              <Text fontSize="sm" color={subtextColor}>
                                {skill.level}%
                              </Text>
                            </Flex>
                            <Progress
                              value={skill.level}
                              colorScheme="blue"
                              size="sm"
                              borderRadius="full"
                            />
                          </Box>
                        ))}
                      </VStack>
                    </TabPanel> */}
    </Box>
  );
};

export default ProfileUI;
