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
  Flex,
  Heading,
  Divider,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, messageClear } from "../store/Reducer/Auth/auth";
import toast from "react-hot-toast";
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

const Login = () => {
  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [showPassword, setShowPassword] = useState(false);
  const { errorMessage, successMessage } = useSelector((state) => state.auth);
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    dispatch(
      login({
        tel: tel,
        password: password,
      })
    );
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/hr/dashboard");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);
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
                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={5}>
                    <FormControl isRequired>
                      <FormLabel color={textColor} fontWeight="medium">
                        Telephone Number
                      </FormLabel>
                      <Input
                        type="number"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        placeholder="Enter your telephone number"
                        size="lg"
                        focusBorderColor="blue.500"
                        bg={useColorModeValue("gray.50", "gray.600")}
                        borderColor={borderColor}
                        _hover={{
                          borderColor: "blue.300",
                        }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel color={textColor} fontWeight="medium">
                        Password
                      </FormLabel>
                      <InputGroup size="lg">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          focusBorderColor="blue.500"
                          bg={useColorModeValue("gray.50", "gray.600")}
                          borderColor={borderColor}
                          _hover={{
                            borderColor: "blue.300",
                          }}
                        />
                        <InputRightElement>
                          <IconButton
                            variant="ghost"
                            onClick={() => setShowPassword(!showPassword)}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            color={textColor}
                            _hover={{
                              bg: useColorModeValue("gray.100", "gray.600"),
                            }}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    {/* Remember Me and Forgot Password */}
                    <Flex justify="space-between" align="center" w="full">
                      <Link
                        fontSize="sm"
                        color="blue.500"
                        _hover={{
                          color: "blue.600",
                          textDecoration: "underline",
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </Flex>

                    {/* Login Button */}
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
                        bg: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        boxShadow: "lg",
                      }}
                      _active={{
                        transform: "scale(0.98)",
                      }}
                      borderRadius="lg"
                      fontWeight="semibold"
                      transition="all 0.2s"
                    >
                      Sign In
                    </Button>
                  </VStack>
                </Box>
              </motion.div>

              {/* Footer */}
              <motion.div variants={itemVariants}>
                <VStack spacing={3}>
                  <Text fontSize="sm" color={textColor} textAlign="center">
                    Don't have an account?{" "}
                    <Link
                      color="blue.500"
                      _hover={{ textDecoration: "underline" }}
                      onClick={() => navigate("/register")}
                    >
                      Register here
                    </Link>
                  </Text>
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

export default Login;
