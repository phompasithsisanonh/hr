import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  IconButton,
  Link,
  useColorModeValue,
  Heading,
  Divider,
  CardBody,
  FormErrorMessage,
  Select,
  Card,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { messageClear, register } from "../store/Reducer/Auth/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const MotionCard = motion(Card);

// Motion variants for animation
const MotionBox = motion(Box);
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const Register = () => {
  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { errorMessage, successMessage } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    tel: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Full name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email is invalid";
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Add registration logic here
      dispatch(register(formData));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
  return (
    <Box minH="100vh" bg={bg} position="relative" overflow="hidden">
      {/* Background Pattern */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        opacity="0.05"
        backgroundSize="60px 60px"
      />

      {/* Floating Elements */}
      <MotionBox
        position="absolute"
        top="10%"
        left="10%"
        w="100px"
        h="100px"
        bg="blue.100"
        borderRadius="full"
        opacity="0.3"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <MotionBox
        position="absolute"
        top="20%"
        right="15%"
        w="80px"
        h="80px"
        bg="purple.100"
        borderRadius="lg"
        opacity="0.2"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <MotionBox
        position="absolute"
        bottom="15%"
        left="20%"
        w="60px"
        h="60px"
        bg="teal.100"
        borderRadius="md"
        opacity="0.25"
        animate={{
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Container maxW="xl" py={12} position="relative" zIndex="1">
        <MotionCard
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="2xl"
          border="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <CardBody p={8}>
            <VStack spacing={6}>
              {/* Logo Section */}
              <motion.div variants={itemVariants}>
                <VStack spacing={4}>
                  <Box
                    w="80px"
                    h="80px"
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    borderRadius="2xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize="2xl"
                    fontWeight="bold"
                    boxShadow="lg"
                  >
                    HR
                  </Box>
                  <VStack spacing={1}>
                    <Heading
                      size="lg"
                      color={useColorModeValue("gray.700", "white")}
                      textAlign="center"
                    >
                      Welcome to the HR Resource Portal
                    </Heading>
                    <Text color={textColor} textAlign="center" fontSize="sm">
                      Please sign in to your account to continue
                    </Text>
                  </VStack>
                </VStack>
              </motion.div>

              <Divider />

              {/* Login Form */}
              <motion.div variants={itemVariants} style={{ width: "100%" }}>
                <VStack spacing={6}>
                  <motion.div variants={itemVariants} style={{ width: "100%" }}>
                    <form onSubmit={handleSubmit}>
                      <VStack spacing={4}>
                        <FormControl isRequired isInvalid={errors.name}>
                          <FormLabel>ຊື່ ແລະ ນາມສະກຸນ</FormLabel>
                          <Input
                            name="name"
                            _hover={{
                              bg: useColorModeValue("gray.100", "gray.600"),
                            }}
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="ຊື່ ແລະ ນາມສະກຸນ"
                            focusBorderColor="blue.500"
                          />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={errors.email}>
                          <FormLabel>Email</FormLabel>
                          <Input
                            name="email"
                            _hover={{
                              bg: useColorModeValue("gray.100", "gray.600"),
                            }}
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ອີເມວ"
                            focusBorderColor="blue.500"
                          />
                          <FormErrorMessage>{errors.email}</FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={errors.tel}>
                          <FormLabel>tel</FormLabel>
                          <Input
                            name="tel"
                            _hover={{
                              bg: useColorModeValue("gray.100", "gray.600"),
                            }}
                            type="number"
                            value={formData.tel}
                            onChange={handleChange}
                            placeholder="ເບີໂທລະສັບ"
                            focusBorderColor="blue.500"
                          />
                          <FormErrorMessage>{errors.tel}</FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired isInvalid={errors.password}>
                          <FormLabel>Password</FormLabel>
                          <InputGroup>
                            <Input
                              _hover={{
                                bg: useColorModeValue("gray.100", "gray.600"),
                              }}
                              name="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="Enter your password"
                              focusBorderColor="blue.500"
                            />
                            <InputRightElement>
                              <IconButton
                                _hover={{
                                  bg: useColorModeValue("gray.100", "gray.600"),
                                }}
                                variant="ghost"
                                onClick={() => setShowPassword(!showPassword)}
                                icon={
                                  showPassword ? <ViewOffIcon /> : <ViewIcon />
                                }
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              />
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{errors.password}</FormErrorMessage>
                        </FormControl>

                        <FormControl isRequired isInvalid={errors.role}>
                          <FormLabel>Role</FormLabel>
                          <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="Select role"
                            focusBorderColor="blue.500"
                          >
                            <option value="CHR">CHR</option>
                          </Select>
                          <FormErrorMessage>{errors.role}</FormErrorMessage>
                        </FormControl>

                        <Button
                          as={motion.button}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          size="lg"
                          width="full"
                          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          color="white"
                          _hover={{
                            bg:
                              "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                            boxShadow: "lg",
                          }}
                          _active={{
                            transform: "scale(0.98)",
                          }}
                          borderRadius="lg"
                          fontWeight="semibold"
                          transition="all 0.2s"
                        >
                          ສະໝັກສະມາຊິກ
                        </Button>
                      </VStack>
                    </form>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Text fontSize="sm">
                      ທ່ານມີບັນຊີແລ້ວບໍ່?{" "}
                      <Button
                        variant="link"
                        colorScheme="blue"
                        onClick={() => navigate("/login")}
                      >
                        ເຂົ້າສູ່ລະບົບ
                      </Button>
                    </Text>
                  </motion.div>
                </VStack>
              </motion.div>

              {/* Footer */}
              <motion.div variants={itemVariants}>
                <VStack spacing={3}>
                  <Divider />
                  <Text fontSize="xs" color={textColor} textAlign="center">
                    © 2024 HR Resource Portal. All rights reserved.
                  </Text>
                  <HStack spacing={4}>
                    <Link fontSize="xs" color="blue.500">
                      Privacy Policy
                    </Link>
                    <Text fontSize="xs" color={textColor}>
                      •
                    </Text>
                    <Link fontSize="xs" color="blue.500">
                      Terms of Service
                    </Link>
                    <Text fontSize="xs" color={textColor}>
                      •
                    </Text>
                    <Link fontSize="xs" color="blue.500">
                      Support
                    </Link>
                  </HStack>
                </VStack>
              </motion.div>
            </VStack>
          </CardBody>
        </MotionCard>
      </Container>
    </Box>
  );
};

export default Register;
