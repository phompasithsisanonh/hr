import React from "react";
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  Circle,
} from "@chakra-ui/react";

// Keyframe animations

const Loading = () => {
  const bg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.900")}
      position="relative"
      overflow="hidden"
    >
      {/* Background Elements */}
      <Box
        position="absolute"
        top="20%"
        left="10%"
        w="60px"
        h="60px"
        bg="blue.100"
        borderRadius="full"
        opacity="0.2"
        animation={` 3s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        top="30%"
        right="15%"
        w="40px"
        h="40px"
        bg="purple.100"
        borderRadius="lg"
        opacity="0.15"
        animation={` 2s ease-in-out infinite 0.5s`}
      />
      <Box
        position="absolute"
        bottom="25%"
        left="20%"
        w="50px"
        h="50px"
        bg="teal.100"
        borderRadius="md"
        opacity="0.2"
        animation={` 2.5s ease-in-out infinite 1s`}
      />

      {/* Main Loading Card */}
      <Box
        bg={bg}
        p={12}
        borderRadius="2xl"
        boxShadow="2xl"
        textAlign="center"
        border="1px"
        borderColor={useColorModeValue("gray.200", "gray.600")}
        minW="300px"
        position="relative"
        zIndex="1"
      >
        <VStack spacing={8}>
          {/* Logo Section */}
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
            animation={` 2s ease-in-out infinite`}
          >
            HR
          </Box>

          {/* Custom Spinner */}
          <Box position="relative">
            {/* Outer Ring */}
            <Box
              w="60px"
              h="60px"
              border="4px solid"
              borderColor={useColorModeValue("gray.200", "gray.600")}
              borderTopColor={accentColor}
              borderRadius="full"
              animation={` 1s linear infinite`}
            />

            {/* Inner Ring */}
            <Box
              position="absolute"
              top="8px"
              left="8px"
              w="44px"
              h="44px"
              border="3px solid"
              borderColor="transparent"
              borderBottomColor={useColorModeValue("blue.300", "blue.400")}
              borderRadius="full"
              animation={` 0.8s linear infinite reverse`}
            />

            {/* Center Dot */}
            <Circle
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              size="8px"
              bg={accentColor}
              animation={` 1.5s ease-in-out infinite`}
            />
          </Box>

          {/* Loading Text with Animated Dots */}
          <VStack spacing={2}>
            <Text
              fontSize="lg"
              fontWeight="semibold"
              color={useColorModeValue("gray.700", "white")}
            >
              Authenticating
            </Text>
            <Flex align="center" gap={1}>
              <Text fontSize="sm" color={textColor}>
                Please wait
              </Text>
              <Box>
                {[0, 1, 2].map((i) => (
                  <Text
                    key={i}
                    as="span"
                    fontSize="sm"
                    color={textColor}
                    animation={` 1.5s ease-in-out infinite`}
                    sx={{
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >
                    .
                  </Text>
                ))}
              </Box>
            </Flex>
          </VStack>

          {/* Progress Indicator */}
          <Box w="full">
            <Box
              h="2px"
              bg={useColorModeValue("gray.200", "gray.600")}
              borderRadius="full"
              overflow="hidden"
              position="relative"
            >
              <Box
                h="full"
                bg={`linear-gradient(90deg, ${accentColor}, ${useColorModeValue(
                  "blue.400",
                  "blue.200"
                )})`}
                borderRadius="full"
                animation={` 2s ease-in-out infinite`}
                w="40%"
                position="absolute"
                left="0"
              />
            </Box>
          </Box>

          {/* Status Text */}
          <Text fontSize="xs" color={textColor} opacity="0.8">
            Verifying credentials and setting up your session...
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Loading;
