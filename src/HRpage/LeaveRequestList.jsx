import React, { useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  useColorModeValue,
  Text,
  Container,
  List,
  ListItem,
  HStack,
  Divider,
  Icon,
  Flex,
  TabPanel,
  TabPanels,
  Tab,
  TabList,
  Tabs,
  Tooltip,
} from "@chakra-ui/react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { getleaveId } from "../store/Reducer/HRReducer/InformationEmplyee";
import { useParams } from "react-router-dom";
import { CalendarIcon, PanelLeftInactiveIcon } from "lucide-react";

const LeaveRequestList = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { getleaveIdreis } = useSelector((state) => state.information);

  // Colors
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.400");

  useEffect(() => {
    dispatch(
      getleaveId({
        idOne: id,
      })
    );
  }, [dispatch, id]);

  // Custom tile to mark leave dates
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      // เอา date ของ react-calendar (ซึ่งเป็น local time) แปลงเป็น UTC date string
      ////Sy may 2025 20:000:00
      const tileDayUTC = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
        .toISOString()
        .split("T")[0];

      const leave = getleaveIdreis?.find((d) => {
        if (!d?.startDate) return false;
        ///2025-05-13T00:00:00.000+00:00
        const leaveStartDate = d.startDate.split("T")[0];
        return leaveStartDate === tileDayUTC;
      });

      if (leave) {
        const colorClass =
          leave.leaveType === "ລາກິດ"
            ? "yellow"
            : leave.leaveType === "ລາພັກຜ່ອນ"
            ? "green"
            : leave.leaveType === "ຂາດວຽກ"
            ? "red"
            : leave.leaveType === "ລາປ່ວຍ"
            ? "green"
            : "grey.700";

        return `leave-${colorClass}`;
      }
    }

    return null;
  };
  const titleContent = ({ date, view }) => {
    if (view === "month") {
      const tileDayUTC = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
        .toISOString()
        .split("T")[0];

      const leave = getleaveIdreis?.find((d) => {
        if (!d?.startDate) return false;
        const leaveStartDate = d.startDate.split("T")[0];
        return leaveStartDate === tileDayUTC;
      });

      if (leave) {
        return (
          <>
            <Tooltip fontSize="xs" mt={1} textAlign="center" color="gray.600">
              -{leave.leaveType}
            </Tooltip>
          </>
        );
      }
    }
  };
  return (
    <Container maxW="container.lg" py={8}>
      <Box
        p={6}
        borderRadius="xl"
        boxShadow="lg"
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading   fontFamily="Noto Sans Lao, serif" as="h1" size="xl" color={textColor} fontWeight="bold">
              ລາຍງານການລາທີ່ໄດ້ຮັບອະນຸມັດ
            </Heading>
            <Flex>
              {["ລາກິດ", "ລາພັກຜ່ອນ", "ລາປ່ວຍ", "ຂາດວຽກ"].map((type) => (
                <HStack key={type} mx={2}>
                  <Box w={3} h={3} borderRadius="full" />
                  <Text fontSize="xs" color={subtitleColor}>
                    {type}
                  </Text>
                </HStack>
              ))}
            </Flex>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="blue" size="md">
            <TabList mb={4}>
              <Tab _selected={{ color: "white", bg: "blue.500" }}>
               ປະຕິທິນວັນລາ
              </Tab>
              <Tab _selected={{ color: "white", bg: "blue.500" }}>
                ລາຍການປະຫວັດການລາ
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <Box
                  p={6}
                  borderRadius="lg"
                  boxShadow="sm"
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={borderColor}
                  className="calendar-container"
                >
                  <Calendar
                    tileContent={titleContent}
                    tileClassName={tileClassName}
                    className="modern-calendar"
                  />
                </Box>
              </TabPanel>

              <TabPanel p={0}>
                <Box>
                  {!getleaveIdreis || getleaveIdreis.length === 0 ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={10}
                    >
                      <Icon as={CalendarIcon} w={12} h={12} color="gray.400" />
                      <Text mt={4} color={subtitleColor}>
                        No leave requests found
                      </Text>
                    </Flex>
                  ) : (
                    <List spacing={4}>
                      {getleaveIdreis.map((item, index) => {
                        return (
                          <ListItem key={`leave-item-${index}`}>
                            <Box
                              p={4}
                              borderRadius="md"
                              borderLeftWidth="4px"
                              boxShadow="sm"
                              _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "md",
                                transition: "all 0.2s ease-in-out",
                              }}
                              transition="all 0.2s ease-in-out"
                            >
                              <Flex justify="space-between">
                                <HStack spacing={4}>
                                  <Box>
                                    <Text fontWeight="bold" color={textColor}>
                                      {item.emplyeeCode}
                                    </Text>
                                    <HStack mt={1}>
                                      <Icon as={CalendarIcon} w={4} h={4} />
                                      <Text fontSize="sm" color={subtitleColor}>
                                        {new Date(
                                          item.startDate
                                        ).toLocaleDateString("lo-LA", {
                                          weekday: "short",
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </Text>
                                    
                                    </HStack>
                                  </Box>
                                </HStack>
                                <HStack spacing={2}>
                                  <Icon
                                    as={PanelLeftInactiveIcon}
                                    w={3.5}
                                    h={3.5}
                                  />
                                  <Text color={"red"} fontSize="sm" fontWeight="medium">
                                    {item.leaveType}
                                  </Text>
                                </HStack>
                              </Flex>
                              <Divider my={3} />
                              <Text fontSize="sm" color={subtitleColor}>
                                <Text as="span" fontWeight="medium">
                                  ໝາຍເຫດ:
                                </Text>{" "}
                                {item.reason}
                              </Text>
                            </Box>
                          </ListItem>
                        );
                      })}
                    </List>
                  )}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>

      {/* Custom CSS for calendar */}
      <style jsx global>{`
        .calendar-container {
          width: 100%;
          max-width: 100%;
        }

        .modern-calendar {
          width: 100%;
          border: none;
          border-radius: 10px;
          font-family: inherit;
          padding: 10px;
        }

        .react-calendar__tile {
          padding: 1em 0.5em;
          height: 3.5em;
          border-radius: 8px;
          margin: 2px;
          font-weight: 500;
        }

        .react-calendar__tile:enabled:hover {
          background-color: #f0f4f8 !important;
        }

        .react-calendar__tile--active {
          background-color: #3182ce !important;
          color: white !important;
        }

        .react-calendar__month-view__weekdays {
          font-weight: bold;
          font-size: 0.8em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .react-calendar__navigation {
          margin-bottom: 16px;
        }

        .react-calendar__navigation button {
          border-radius: 8px;
          min-width: 44px;
          background: none;
        }

        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #f0f4f8;
        }

        .leave-yellow {
          background: #fef3c7 !important;
          position: relative;
        }

        .leave-green {
          background: #d1fae5 !important;
          position: relative;
        }

        .leave-red {
          background: #fee2e2 !important;
          position: relative;
        }

        .leave-blue {
          background: #dbeafe !important;
          position: relative;
        }

        .leave-grey {
          background: #f3f4f6 !important;
          position: relative;
        }

        .leave-yellow::after,
        .leave-green::after,
        .leave-red::after,
        .leave-blue::after,
        .leave-grey::after {
          content: "✓";
          position: absolute;
          font-size: 0.7em;
          top: 5px;
          right: 5px;
          color: #4a5568;
        }
      `}</style>
    </Container>
  );
};

export default LeaveRequestList;

// import React, { useState } from "react";
// import {
//   Box,
//   Heading,
//   List,
//   ListItem,
//   VStack,
//   HStack,
//   Badge,
//   useColorModeValue,
//   Button,
//   Text,
//   Container,
//   SimpleGrid,
//   Flex,
//   IconButton,
//   Tooltip,
// } from "@chakra-ui/react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { CheckIcon } from "lucide-react";
// import { IoClose } from "react-icons/io5";

// const LeaveRequestList = () => {
//   const [holidays, setHolidays] = useState([]); // array for storing selected holidays
//   const [value, setValue] = useState(new Date()); // current date value

//   // Colors
//   const holidayBgColor = useColorModeValue("red.100", "red.900");
//   const holidayColor = useColorModeValue("red.500", "red.200");
//   const cardBg = useColorModeValue("white", "gray.700");
//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const datauser = {
//     id: 1,
//     name: "phome",
//     date: new Date(),
//   };
//   // Function to handle date selection
//   const handleDayClick = (date) => {
//     const dateStr = date.toDateString();
//     if (holidays.includes(dateStr)) {
//       // Remove if clicked again
//       setHolidays(holidays.filter((d) => d !== dateStr));
//     } else {
//       // Add to array
//       setHolidays([...holidays, dateStr]);
//     }
//     setValue(date);
//   };

//   // Custom tile to mark holidays
//   const tileClassName = ({ date, view }) => {
//     if (view === "month") {
//       if (holidays.includes(date.toDateString())) {
//         return "holiday-tile";
//       }
//     }
//   };

//   // Function to format date
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   // Function to remove a holiday
//   const removeHoliday = (dateStr) => {
//     setHolidays(holidays.filter((d) => d !== dateStr));
//   };

//   // Function to clear all holidays
//   const clearHolidays = () => {
//     setHolidays([]);
//   };

//   return (
//     <Container maxW="container.xl" py={8}>
//       <VStack spacing={8} align="stretch">
//         <Heading as="h1" size="xl" textAlign="center">
//           Leave Request Calendar
//         </Heading>

//         <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
//           {/* Calendar Section */}
//           <Box
//             p={6}
//             borderRadius="lg"
//             boxShadow="md"
//             bg={cardBg}
//             borderWidth="1px"
//             borderColor={borderColor}
//           >
//             <Heading as="h2" size="md" mb={4}>
//               Select Leave Days
//             </Heading>
//             <Box className="calendar-container">
//               <Calendar
//                 onChange={setValue}
//                 value={value}
//                 onClickDay={handleDayClick}
//                 tileClassName={tileClassName}
//               />
//               <Box mt={4}>
//                 <Text fontSize="sm" color="gray.500">
//                   Click on dates to mark them as leave days
//                 </Text>
//               </Box>
//             </Box>
//           </Box>

//           {/* Selected Holidays Section */}
//           <Box
//             p={6}
//             borderRadius="lg"
//             boxShadow="md"
//             bg={cardBg}
//             borderWidth="1px"
//             borderColor={borderColor}
//           >
//             <Flex justify="space-between" align="center" mb={4}>
//               <Heading as="h2" size="md">
//                 Selected Leave Days
//               </Heading>
//               {holidays.length > 0 && (
//                 <Button size="sm" colorScheme="red" onClick={clearHolidays}>
//                   Clear All
//                 </Button>
//               )}
//             </Flex>

//             {holidays.length === 0 ? (
//               <Text color="gray.500">No leave days selected yet</Text>
//             ) : (
//               <List spacing={3}>
//                 {holidays.map((date, index) => (
//                   <ListItem key={index}>
//                     <HStack justify="space-between">
//                       <HStack>
//                         <Badge colorScheme="red" p={1} borderRadius="md">
//                           {new Date(date).toLocaleDateString()}
//                         </Badge>
//                         <Text>{formatDate(date)}</Text>
//                       </HStack>
//                       <Tooltip hasArrow label="Remove">
//                         <IconButton
//                           icon={<IoClose size={16} />}
//                           size="sm"
//                           colorScheme="red"
//                           variant="ghost"
//                           onClick={() => removeHoliday(date)}
//                           aria-label="Remove holiday"
//                         />
//                       </Tooltip>
//                     </HStack>
//                   </ListItem>
//                 ))}
//               </List>
//             )}

//             <Box mt={4}>
//               <Text fontWeight="bold">Total leave days: {holidays.length}</Text>
//             </Box>
//           </Box>
//         </SimpleGrid>
//       </VStack>

//       {/* Custom CSS for calendar */}
//       <style jsx global>{`
//         .calendar-container {
//           width: 100%;
//           max-width: 100%;
//         }

//         .react-calendar {
//           width: 100%;
//           border: none;
//           border-radius: 8px;
//           font-family: inherit;
//         }

//         .react-calendar__tile {
//           padding: 1em 0.5em;
//           height: 3em;
//         }

//         .holiday-tile {
//           background: ${holidayBgColor};
//           color: ${holidayColor};
//           font-weight: bold;
//           border-radius: 50%;
//           position: relative;
//         }

//         .holiday-tile::after {
//           content: "✓";
//           position: absolute;
//           font-size: 0.7em;
//           top: 5px;
//           right: 5px;
//         }

//         .react-calendar__tile--now {
//           background: #e6f7ff;
//         }

//         .react-calendar__tile:enabled:hover,
//         .react-calendar__tile:enabled:focus {
//           background-color: #f0f0f0;
//           border-radius: 6px;
//         }
//       `}</style>
//     </Container>
//   );
// };

// export default LeaveRequestList;
