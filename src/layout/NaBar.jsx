import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Collapse,
  useColorModeValue,
  Heading,
  Icon,
  List,
  ListItem,
  Link,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, HamburgerIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import {
  HiHome,
  HiUsers,
  HiClipboardList,
  HiUserAdd,
  HiDatabase,
  HiAcademicCap,
} from "react-icons/hi";
import {
  FaBusinessTime,
  FaFileInvoiceDollar,
  FaClock,
  FaCalculator,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { getNav } from "../navigation";
import { CgProfile } from "react-icons/cg";

// Map string icon names to actual React icons
const iconMap = {
  HiHome,
  HiUsers,
  HiClipboardList,
  HiUserAdd,
  HiDatabase,
  HiAcademicCap,
  FaBusinessTime,
  FaFileInvoiceDollar,
  FaClock,
  FaCalculator,
  CgProfile,
};

// Motion component
const MotionBox = motion(Box);

const NavbarItem = ({ item, isActive, onClick, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.details && item.details.length > 0;
  const IconComponent = item.icon ? iconMap[item.icon] : null;
  
  const handleClick = () => {
    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick(item);
    }
  };

  const activeBg = useColorModeValue("blue.50", "blue.900");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <Box mb={isMobile ? 2 : 3} width="100%">
      <Flex
        py={isMobile ? 2 : 3}
        px={isMobile ? 3 : 4}
        rounded="md"
        bg={isActive ? activeBg : "transparent"}
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        boxShadow={isMobile ? "none" : "xs"}
        onClick={handleClick}
        transition="all 0.2s"
        _hover={{ bg: isActive ? activeBg : hoverBg }}
        borderLeft={isActive && !isMobile ? "4px solid" : "none"}
        borderLeftColor="blue.500"
      >
        <Flex alignItems="center">
          {IconComponent && (
            <Icon
              as={IconComponent}
              mr={isMobile ? 2 : 3}
              boxSize={isMobile ? 4 : 5}
              color={isActive ? "blue.500" : "gray.500"}
            />
          )}
          <Text
            fontSize={isMobile ? "xs" : "sm"}
            fontWeight={isActive ? "semibold" : "medium"}
            color={isActive ? "blue.700" : "gray.700"}
          >
            {item.title}
          </Text>
        </Flex>

        {hasSubItems && (
          <Icon
            as={isOpen ? ChevronUpIcon : ChevronDownIcon}
            w={isMobile ? 4 : 5}
            h={isMobile ? 4 : 5}
            color="gray.500"
            transition="transform 0.2s"
          />
        )}
      </Flex>

      {hasSubItems && (
        <Collapse in={isOpen} animateOpacity>
          <List spacing={1} pl={isMobile ? 4 : 6} pt={2} pb={1}>
            {item.details.map((subItem, index) => {
              const SubIconComponent = subItem.icon
                ? iconMap[subItem.icon]
                : null;

              return (
                <ListItem
                  key={index}
                  py={isMobile ? 1 : 2}
                  px={isMobile ? 2 : 3}
                  fontSize={isMobile ? "xs" : "sm"}
                  cursor="pointer"
                  _hover={{ bg: hoverBg, borderRadius: "md" }}
                  onClick={() => onClick && onClick(subItem)}
                  display="flex"
                  alignItems="center"
                  color="gray.600"
                >
                  {SubIconComponent && (
                    <Icon
                      as={SubIconComponent}
                      mr={2}
                      boxSize={isMobile ? 3 : 4}
                      color="gray.500"
                    />
                  )}
                  <Link
                    href={subItem.path || "#"}
                    _hover={{ textDecoration: "none" }}
                    width="100%"
                  >
                    {subItem.title}
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

// Desktop Sidebar Component
const DesktopSidebar = ({ activeItemId, onItemClick, allNav }) => {
  const bgColor = useColorModeValue("gray.50", "gray.800");

  return (
    <MotionBox
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      as="nav"
      h="100vh"
      w={{ base: "250px", lg: "300px" }}
      bg={bgColor}
      boxShadow="sm"
      p={4}
      position="sticky"
      top="0"
      overflowY="auto"
      display={{ base: "none", md: "block" }}
    >
      {/* Header */}
      <Box textAlign="center" mb={8} mt={6}>
        <Heading size={{ base: "md", lg: "lg" }} letterSpacing="tight">
          LOGO
        </Heading>
      </Box>

      {/* Menu Items */}
      <VStack spacing={1} align="stretch" mt={4}>
        {allNav.map((item) => (
          <NavbarItem
            key={item.id}
            item={item}
            isActive={activeItemId === item.id}
            onClick={onItemClick}
          />
        ))}
      </VStack>
    </MotionBox>
  );
};

// Mobile Drawer Component
const MobileDrawer = ({ isOpen, onClose, activeItemId, onItemClick, allNav }) => {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
      <DrawerOverlay />
      <DrawerContent bg={bgColor}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading size="md" letterSpacing="tight">
            LOGO
          </Heading>
        </DrawerHeader>

        <DrawerBody p={4}>
          <VStack spacing={1} align="stretch">
            {allNav.map((item) => (
              <NavbarItem
                key={item.id}
                item={item}
                isActive={activeItemId === item.id}
                onClick={(clickedItem) => {
                  onItemClick(clickedItem);
                  if (!clickedItem.details || clickedItem.details.length === 0) {
                    onClose(); // Close drawer when navigating to a page (not expanding submenu)
                  }
                }}
                isMobile={true}
              />
            ))}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

// Mobile Header Component
const MobileHeader = ({ onMenuClick }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex
      display={{ base: "flex", md: "none" }}
      position="sticky"
      top="0"
      zIndex="sticky"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={3}
      alignItems="center"
      justifyContent="space-between"
      boxShadow="sm"
    >
      <IconButton
        aria-label="Open menu"
        icon={<HamburgerIcon />}
        variant="ghost"
        onClick={onMenuClick}
        size="md"
      />
      <Heading size="sm" letterSpacing="tight">
        LOGO
      </Heading>
      <Box w="40px" /> {/* Spacer for centering */}
    </Flex>
  );
};

const NavBar = ({ activeItemId = null, onItemClick = () => {} }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [allNav, setAllNav] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const navs = getNav(userInfo.role);
    setAllNav(navs);
  }, [userInfo.role]);

  return (
    <>
      {/* Mobile Header */}
      <MobileHeader onMenuClick={onOpen} />

      {/* Desktop Sidebar */}
      <DesktopSidebar
        activeItemId={activeItemId}
        onItemClick={onItemClick}
        allNav={allNav}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isOpen}
        onClose={onClose}
        activeItemId={activeItemId}
        onItemClick={onItemClick}
        allNav={allNav}
      />
    </>
  );
};

// Updated responsive usage example
const HRDashboard = () => {
  const [activeItem, setActiveItem] = useState(1);

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    console.log(`Navigating to: ${item.path}`);
  };

  return (
    <Flex minH="100vh">
      <NavBar activeItemId={activeItem} onItemClick={handleItemClick} />
      <Box 
        flex="1" 
        p={{ base: 4, md: 6 }}
        ml={{ base: 0, md: 0 }} // No margin since sidebar is now sticky
        w={{ base: "100%", md: "calc(100% - 250px)", lg: "calc(100% - 300px)" }}
      >
        <Heading size={{ base: "md", lg: "lg" }}>HR Dashboard Content</Heading>
        {/* Your main content goes here */}
      </Box>
    </Flex>
  );
};

export { NavBar, HRDashboard };
export default NavBar;