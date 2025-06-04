import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Heading,
  Icon,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaBell, FaCog, FaMoon, FaSun } from "react-icons/fa";
import NaBar from "./NaBar";

const MainLayout = () => {
  const { toggleColorMode } = useColorMode();
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const bgColor = useColorModeValue("gray.50", "gray.900");
  
  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headerPadding = useBreakpointValue({ base: 4, md: 6 });
  const containerPadding = useBreakpointValue({ base: 4, md: 6 });
  const headingSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <Box w="full" minH="100vh" bg={bgColor}>
      {/* Main Layout Container */}
      <Flex direction={{ base: "column", md: "row" }} minH="100vh">
        {/* Navbar Component */}
        <NaBar />
        
        {/* Main Content Area */}
        <Box 
          flex="1" 
          overflowY="auto" 
          w="full"
          // Add top padding on mobile to account for mobile header
          pt={{ base: 0, md: 0 }}
        >
          {/* Top Header Bar */}
          <Box p={containerPadding}>
            <Flex
              bg={cardBg}
              p={headerPadding}
              boxShadow="sm"
              borderRadius="lg"
              mb={6}
              justify="space-between"
              align="center"
              // Make header responsive
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 4, sm: 0 }}
            >
              <Heading 
                size={headingSize} 
                color={textColor}
                textAlign={{ base: "center", sm: "left" }}
              >
                User Profile
              </Heading>
              
              <HStack spacing={{ base: 2, md: 4 }}>
                <IconButton
                  aria-label="Notifications"
                  icon={<FaBell />}
                  variant="ghost"
                  color={textColor}
                  size={{ base: "sm", md: "md" }}
                />
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FaCog />}
                    variant="ghost"
                    color={textColor}
                    size={{ base: "sm", md: "md" }}
                  />
                  <MenuList>
                    <MenuItem onClick={toggleColorMode}>
                      <Icon as={useColorModeValue(FaMoon, FaSun)} mr={2} />
                      Toggle {useColorModeValue("Dark", "Light")} Mode
                    </MenuItem>
                    <MenuItem>Settings</MenuItem>
                    <MenuItem>Profile</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </Flex>
            
            {/* Main Content Outlet */}
            <Box>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default MainLayout;