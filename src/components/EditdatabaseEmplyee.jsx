import {
  Text,
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Select,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletedatabaseholidays,
  edit_data,
  edit_deparmentPosition,
  editOneidDataEmplyee,
  messageClear,
  typeOfSecurity,
} from "../store/Reducer/HRReducer/InformationEmplyee";
import { useParams } from "react-router-dom";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import toast from "react-hot-toast";
import moment from "moment";

const EditdatabaseEmplyee = () => {
  const { id } = useParams();
  const { loader, editDataOneid, successMessage, errorMessage } = useSelector(
    (state) => state.information
  );
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const fixoutwork =moment('17:30', "HH:mm");
  const [outworkTime, setOutworkTime] = useState(fixoutwork);
  const [workTime, setWorkTime] = useState(0);

  const outworkTimeMoment = moment(outworkTime, "HH:mm");
  const startWorkTimeMoment = moment(workTime, "HH:mm");
  const timeDifferenceMs =
    outworkTimeMoment.valueOf() - startWorkTimeMoment.valueOf();
  const timeDifference = moment.duration(timeDifferenceMs);
  const hours = timeDifference.hours();
  const [formData, setFormData] = useState({
    otTohour: 0,
    otminute: 0,
    latTohour: 0,
    latminute: 0,
    startWorkTime: "",
    contentsOfHolidays: [],
    setAnnualHolidays: "",
    typeCommission: {},
    typeOfSecurity: [],
    department: [],
  });
  const isInitialLoad = useRef(true);
  const [newInsuranceType, setNewInsuranceType] = useState("");
  const [newInsuranceRate, setNewInsuranceRate] = useState("");
  const [commissionType, setCommissionType] = useState("");
  const [commissionRate, setCommissionRate] = useState("");
  const [newDepartmentType, setNewDepartmentType] = useState("");
  const [newDepartmentRate, setNewDepartmentRate] = useState("");
  const [newDepartmenId, setNewDepartmenId] = useState("");
  const [newPosiontionId, setNewPosiontionId] = useState("");
  const [levelPosiontion, setLevelPosiontion] = useState("");
  const [newCountholiday, setNewCountholiday] = useState(0);
  const [newcontent, setNewcontent] = useState("");

  useEffect(() => {
    dispatch(editOneidDataEmplyee(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (editDataOneid && isInitialLoad.current) {
      setFormData({
        otTohour: editDataOneid.otTohour || 0,
        otminute: editDataOneid.otminute || 0,
        latTohour: editDataOneid.latTohour || 0,
        latminute: editDataOneid.latminute || 0,
        startWorkTime: editDataOneid?.startWorkTime || 0,
        standardTimeWorkHour: editDataOneid?.standardTimeWorkHour || 0,
        setAnnualHolidays: editDataOneid.setAnnualHolidays || "",
        typeOfSecurity: editDataOneid.typeOfSecurity || [],
        department: [],
        contentsOfHolidays: editDataOneid.contentsOfHolidays || [],
      });
      setWorkTime(editDataOneid?.startWorkTime || 0);
      setCommissionType(editDataOneid.typeCommission?.type || "");
      setCommissionRate(editDataOneid.typeCommission?.rate || "");
    } else {
      isInitialLoad.current = false;
    }
  }, [editDataOneid, hours]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleContentHoliday = () => {
    setFormData({
      ...formData,
      contentsOfHolidays: [
        ...formData.contentsOfHolidays,
        {
          countday: newCountholiday,
          content: newcontent,
        },
      ],
    });
  };
  const handleRemoveContentHoliday = (index) => {
    const updatedcontentsOfHolidays = [...formData.contentsOfHolidays];
    updatedcontentsOfHolidays.splice(index, 1);
    setFormData({
      ...formData,
      contentsOfHolidays: updatedcontentsOfHolidays,
    });
    dispatch(
      deletedatabaseholidays({
        settingId: id,
        index: index,
      })
    );
  };
  const handleCommissionTypeChange = (e) => {
    setCommissionType(e.target.value);
  };
  const handleCommissionRateChange = (e) => {
    setCommissionRate(e.target.value);
  };
  const handleAddInsurance = () => {
    if (newInsuranceType && newInsuranceRate) {
      setFormData({
        ...formData,
        typeOfSecurity: [
          ...formData.typeOfSecurity,
          { type: newInsuranceType, rate: newInsuranceRate },
        ],
      });
      setNewInsuranceType("");
      setNewInsuranceRate("");
    }
  };
  const handleRemoveInsurance = (insu, index) => {
    const updatedInsurance = [...formData.typeOfSecurity];
    updatedInsurance.splice(index, 1);
    setFormData({
      ...formData,
      typeOfSecurity: updatedInsurance,
    });
    dispatch(
      typeOfSecurity({
        settingId: id,
        index: index,
      })
    );
  };
  const handleAddDepartment = () => {
    if (newDepartmentType && newDepartmentRate) {
      setFormData({
        ...formData,
        department: [
          ...formData.department,
          {
            type: newDepartmentType,
            departmentId: newDepartmenId,
            position: [
              {
                type: newDepartmentRate,
                positionId: newPosiontionId,
                level: levelPosiontion,
              },
            ],
          },
        ],
      });
      setNewDepartmentType("");
      setNewDepartmentRate("");
    }
  };
  const handleRemoveDepartment = (index) => {
    const updatedDepartment = [...formData.department];
    updatedDepartment.splice(index, 1);
    setFormData({
      ...formData,
      department: updatedDepartment,
    });
  };
  const saveEmployeeData = () => {
    const employeeData = {
      ...formData,
      typeCommission: {
        type: commissionType,
        rate: commissionRate,
      },
      id,
      startWorkTime: workTime,
      standardTimeWorkHour: hours,
    };
    dispatch(edit_data(employeeData)).then(() =>
      dispatch(editOneidDataEmplyee(id))
    );
    setFormData("");
  };
  const [editedType, setEditedType] = useState("");
  const [editedPosition, setEditedPosition] = useState([]);
  const handleEditDepartment = (dept, index) => {
    setEditedType(dept.type);
    setEditedPosition([...dept.position]);
    onOpen();
  };
  const handlePositionChange = (index, newValue) => {
    const updatedPositions = [...editedPosition];
    updatedPositions[index] = { newValue, index };
    setEditedPosition(updatedPositions);
  };
  const saveEdit = () => {
    dispatch(
      edit_deparmentPosition({
        id: id,
        type: editedType,
        editedPosition: editedPosition,
      })
    ).then(() => dispatch(editOneidDataEmplyee(id)));
    onClose();
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
    <Box bg="gray.50" minH="100vh" px={{ base: 4, md: 8 }} py={6}>
      {loader ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          width="100%"
          position="fixed"
          top="0"
          left="0"
          bg="rgba(255, 255, 255, 0.8)"
          zIndex="999"
        >
          <Flex direction="column" alignItems="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
            <Text mt={4} fontWeight="medium" fontSize="md" color="gray.600">
              ກຳລັງໂຫຼດຂໍ້ມູນ...
            </Text>
          </Flex>
        </Box>
      ) : (
        <Stack spacing={6}>
          {/* Heading */}
          <Heading
            fontFamily="Noto Sans Lao, sans-serif"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="bold"
            color="gray.800"
          >
            ຖານຂໍ້ມູນ
          </Heading>

          {/* Accordion for Form Sections */}
          <Accordion allowToggle>
            {/* Department Section */}
            <AccordionItem border="none" bg="white" borderRadius="md" shadow="sm">
              <AccordionButton p={4}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="medium" color="gray.800">
                    ພະແນກ ແລະ ຕຳແໜ່ງ
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ພະແນກ
                    </FormLabel>
                    <Select
                      value={newDepartmentType}
                      onChange={(e) => setNewDepartmentType(e.target.value)}
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.500" }}
                    >
                      <option value="">ເລືອກພະແນກ</option>
                      {editDataOneid?.department?.map((data, index) => (
                        <option key={index} value={data.type}>
                          {data.type}
                        </option>
                      ))}
                    </Select>
                    <Input
                      mt={2}
                      type="text"
                      name="type"
                      value={newDepartmentType}
                      onChange={(e) => setNewDepartmentType(e.target.value)}
                      placeholder="ຊື່ພະແນກ"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                      isDisabled={editDataOneid?.department?.some(
                        (dept) => dept.type === newDepartmentType
                      )}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ລະຫັດພະແນກ
                    </FormLabel>
                    <Input
                      type="text"
                      name="newDepartmenId"
                      value={newDepartmenId}
                      onChange={(e) => setNewDepartmenId(e.target.value)}
                      placeholder="ລະຫັດພະແນກ"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ຕຳແໜ່ງ
                    </FormLabel>
                    <Input
                      type="text"
                      name="rate"
                      value={newDepartmentRate}
                      onChange={(e) => setNewDepartmentRate(e.target.value)}
                      placeholder="ຊື່ຕຳແໜ່ງ"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ລະຫັດຕຳແໜ່ງ
                    </FormLabel>
                    <Input
                      type="text"
                      name="newPosiontionId"
                      value={newPosiontionId}
                      onChange={(e) => setNewPosiontionId(e.target.value)}
                      placeholder="ລະຫັດຕຳແໜ່ງ"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ລະດັບຂັ້ນ
                    </FormLabel>
                    <Input
                      type="text"
                      name="levelPosiontion"
                      value={levelPosiontion}
                      onChange={(e) => setLevelPosiontion(e.target.value)}
                      placeholder="ລະດັບຂັ້ນ"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <Button
                    onClick={handleAddDepartment}
                    colorScheme="blue"
                    size="md"
                    w="full"
                    fontSize="md"
                    fontFamily="Noto Sans Lao, sans-serif"
                  >
                    ເພີ່ມ
                  </Button>
                </Stack>
                {/* Department Table */}
                {(formData?.department?.length > 0 ||
                  editDataOneid?.department?.length > 0) && (
                  <Box overflowX="auto" mt={4}>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th
                            fontFamily="Noto Sans Lao, sans-serif"
                            fontSize="sm"
                            color="gray.600"
                          >
                            ພະແນກ
                          </Th>
                          <Th
                            fontFamily="Noto Sans Lao, sans-serif"
                            fontSize="sm"
                            color="gray.600"
                          >
                            ຕຳແໜ່ງ
                          </Th>
                          <Th
                            fontFamily="Noto Sans Lao, sans-serif"
                            fontSize="sm"
                            color="gray.600"
                            width="120px"
                          >
                            ຈັດການ
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {formData?.department?.map((dept, index) => (
                          <Tr key={index}>
                            <Td fontSize="sm">{dept?.type}</Td>
                            <Td fontSize="sm">
                              {dept?.position?.map((d) => d?.type).join(", ")}
                            </Td>
                            <Td>
                              <IconButton
                                aria-label="Delete department"
                                icon={<DeleteIcon />}
                                colorScheme="red"
                                size="md"
                                fontSize="lg"
                                onClick={() => handleRemoveDepartment(index)}
                              />
                            </Td>
                          </Tr>
                        ))}
                        {editDataOneid?.department.map((dept, index) => (
                          <Tr key={index}>
                            <Td fontSize="sm">{dept.type}</Td>
                            <Td fontSize="sm">
                              {dept.position.map((d) => d.type).join(", ")}
                            </Td>
                            <Td>
                              <Flex gap={2}>
                                <IconButton
                                  aria-label="Edit department"
                                  icon={<EditIcon />}
                                  colorScheme="blue"
                                  size="md"
                                  fontSize="lg"
                                  onClick={() => handleEditDepartment(dept, index)}
                                />
                                <IconButton
                                  aria-label="Delete department"
                                  icon={<DeleteIcon />}
                                  colorScheme="red"
                                  size="md"
                                  fontSize="lg"
                                  onClick={() => handleRemoveDepartment(index)}
                                />
                              </Flex>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                )}
              </AccordionPanel>
            </AccordionItem>

            {/* Overtime Section */}
            <AccordionItem border="none" bg="white" borderRadius="md" shadow="sm">
              <AccordionButton p={4}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="medium" color="gray.800">
                    ຄ່າລ່ວງເວລາ ແລະ ຄ່າມາຊ້າ
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ກຳນົດເງິນລ່ວງເວລາຊົ່ວໂມງ
                    </FormLabel>
                    <Input
                      name="otTohour"
                      value={formData.otTohour}
                      onChange={handleInputChange}
                      placeholder="ເງິນຄ່າຊົ່ວໂມງ"
                      type="number"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ກຳນົດເງິນລ່ວງເວລາເປັນ30ນາທີ
                    </FormLabel>
                    <Input
                      name="otminute"
                      value={formData.otminute}
                      onChange={handleInputChange}
                      placeholder="ອັດຕາເງິນລ່ວງເວລາ"
                      type="number"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ກຳນົດເງິນມາຊ້າເວລາຊົ່ວໂມງ
                    </FormLabel>
                    <Input
                      name="latTohour"
                      value={formData.latTohour}
                      onChange={handleInputChange}
                      placeholder="ເງິນຄ່າຊົ່ວໂມງ"
                      type="number"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ກຳນົດເງິນມາຊ້າເວລາເປັນ30ນາທີ
                    </FormLabel>
                    <Input
                      name="latminute"
                      value={formData.latminute}
                      onChange={handleInputChange}
                      placeholder="ອັດຕາເງິນລ່ວງເວລາ"
                      type="number"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            {/* Work Hours Section */}
            <AccordionItem border="none" bg="white" borderRadius="md" shadow="sm">
              <AccordionButton p={4}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="medium" color="gray.800">
                    ໂມງເຮັດວຽກ
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ກຳນົດໂມງເຮັດວຽກ
                    </FormLabel>
                    <Input
                      name="startWorkTime"
                      value={workTime}
                      onChange={(e) => setWorkTime(e.target.value)}
                      placeholder="ກຳນົດໂມງເຮັດວຽກ"
                      type="time"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ກຳນົດໂມງເລີກວຽກ
                    </FormLabel>
                    <Input
                      value={outworkTime}
                      onChange={(e) => setOutworkTime(e.target.value)}
                      placeholder="ກຳນົດໂມງເລີກເຮັດວຽກ"
                      type="time"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ກຳນົດຈັກຊົ່ວໂມງເຮັດວຽກ
                    </FormLabel>
                    <Input
                      name="standardTimeWorkHour"
                      value={hours}
                      disabled={true}
                      placeholder="ກຳນົດຈັກຊົ່ວໂມງເຮັດວຽກ"
                      type="number"
                      fontSize="sm"
                      bg="gray.100"
                      borderColor="gray.300"
                    />
                  </FormControl>
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            {/* Commission Section */}
            <AccordionItem border="none" bg="white" borderRadius="md" shadow="sm">
              <AccordionButton p={4}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="medium" color="gray.800">
                    ຄ່າຄອມມິຊັ່ນ
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ປະເພດຄ່າຄອມມິຊັ່ນ
                    </FormLabel>
                    <Input
                      value={commissionType}
                      onChange={handleCommissionTypeChange}
                      placeholder="ປະເພດຄ່າຄອມ"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="md" color="gray.600">
                      ອັດຕາ
                    </FormLabel>
                    <Input
                      value={commissionRate}
                      onChange={handleCommissionRateChange}
                      placeholder="ອັດຕາ"
                      type="number"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            {/* Annual Holidays Section */}
            <AccordionItem border="none" bg="white" borderRadius="md" shadow="sm">
              <AccordionButton p={4}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="medium" color="gray.800">
                    ວັນພັກປະຈຳປີ
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="md" color="gray.600">
                    ກຳນົດວັນພັກປະຈຳປີ
                  </FormLabel>
                  <Input
                    name="setAnnualHolidays"
                    value={formData.setAnnualHolidays}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="ຈຳນວນວັນ"
                    fontSize="sm"
                    bg="white"
                    borderColor="gray.300"
                  />
                </FormControl>
              </AccordionPanel>
            </AccordionItem>

            {/* Holiday Types Section */}
            <AccordionItem border="none" bg="white" borderRadius="md" shadow="sm">
              <AccordionButton p={4}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="medium" color="gray.800">
                    ປະເພດວັນພັກ
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="md" color="gray.600">
                      ປະເພດລາພັກ
                    </FormLabel>
                    <Input
                      placeholder="ປະເພດລາພັກ"
                      value={newcontent}
                      name="newcontent"
                      type="string"
                      onChange={(e) => setNewcontent(e.target.value)}
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md" color="gray.600">
                      ຈຳນວນວັນພັກ
                    </FormLabel>
                    <Input
                      type="number"
                      placeholder="ຈຳນວນວັນ"
                      name="newCountholiday"
                      value={newCountholiday}
                      onChange={(e) => setNewCountholiday(e.target.value)}
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    size="md"
                    w="full"
                    fontSize="md"
                    fontFamily="Noto Sans Lao, sans-serif"
                    onClick={handleContentHoliday}
                  >
                    ເພີ່ມ
                  </Button>
                  {formData?.contentsOfHolidays?.length > 0 && (
                    <Box overflowX="auto" mt={4}>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th
                              fontFamily="Noto Sans Lao, sans-serif"
                              fontSize="sm"
                              color="gray.600"
                            >
                              ຈຳນວນວັນພັກ
                            </Th>
                            <Th
                              fontFamily="Noto Sans Lao, sans-serif"
                              fontSize="sm"
                              color="gray.600"
                            >
                              ປະເພດວັນພັກ
                            </Th>
                            <Th
                              fontFamily="Noto Sans Lao, sans-serif"
                              fontSize="sm"
                              color="gray.600"
                              width="100px"
                            >
                              ຈັດການ
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {formData?.contentsOfHolidays?.map((insurance, index) => (
                            <Tr key={index}>
                              <Td fontSize="sm">{insurance.countday}</Td>
                              <Td fontSize="sm">{insurance.content}</Td>
                              <Td>
                                <IconButton
                                  aria-label="Delete holiday"
                                  icon={<DeleteIcon />}
                                  colorScheme="red"
                                  size="md"
                                  fontSize="lg"
                                  onClick={() => handleRemoveContentHoliday(index)}
                                />
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  )}
                </Stack>
              </AccordionPanel>
            </AccordionItem>

            {/* Insurance Section */}
            <AccordionItem border="none" bg="white" borderRadius="md" shadow="sm">
              <AccordionButton p={4}>
                <Box flex="1" textAlign="left">
                  <Text fontSize="lg" fontWeight="medium" color="gray.800">
                    ປະກັນສັງຄົມ
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="md" color="gray.600">
                      ປະເພດປະກັນສັງຄົມ
                    </FormLabel>
                    <Input
                      placeholder="ປະເພດປະກັນສັງຄົມ"
                      value={newInsuranceType}
                      onChange={(e) => setNewInsuranceType(e.target.value)}
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md" color="gray.600">
                      ອັດຕາຫັກປະກັນສັງຄົມ
                    </FormLabel>
                    <Input
                      type="number"
                      placeholder="%"
                      value={newInsuranceRate}
                      onChange={(e) => setNewInsuranceRate(e.target.value)}
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <Button
                    colorScheme="blue"
                    size="md"
                    w="full"
                    fontSize="md"
                    fontFamily="Noto Sans Lao, sans-serif"
                    onClick={handleAddInsurance}
                  >
                    ເພີ່ມຂໍ້ມູນ
                  </Button>
                  {Array.isArray(formData.typeOfSecurity) &&
                    formData.typeOfSecurity.length > 0 && (
                      <Box overflowX="auto" mt={4}>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th
                                fontFamily="Noto Sans Lao, sans-serif"
                                fontSize="sm"
                                color="gray.600"
                              >
                                ປະເພດປະກັນສັງຄົມ
                              </Th>
                              <Th
                                fontFamily="Noto Sans Lao, sans-serif"
                                fontSize="sm"
                                color="gray.600"
                              >
                                ອັດຕາຫັກປະກັນສັງຄົມ(%)
                              </Th>
                              <Th
                                fontFamily="Noto Sans Lao, sans-serif"
                                fontSize="sm"
                                color="gray.600"
                                width="100px"
                              >
                                ຈັດການ
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {formData.typeOfSecurity.map((insurance, index) => (
                              <Tr key={index}>
                                <Td fontSize="sm">{insurance.type}</Td>
                                <Td fontSize="sm">{insurance.rate}%</Td>
                                <Td>
                                  <IconButton
                                    aria-label="Delete insurance"
                                    icon={<DeleteIcon />}
                                    colorScheme="red"
                                    size="md"
                                    fontSize="lg"
                                    onClick={() =>
                                      handleRemoveInsurance(insurance, index)
                                    }
                                  />
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    )}
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {/* Sticky Save Button */}
          <Box
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            bg="white"
            p={4}
            shadow="lg"
            zIndex="10"
            display={{ base: "block", md: "none" }}
          >
            <Button
              onClick={saveEmployeeData}
              colorScheme="green"
              size="lg"
              w="full"
              fontSize="md"
              fontFamily="Noto Sans Lao, sans-serif"
            >
              ບັນທຶກ
            </Button>
          </Box>
          <Flex justifyContent="flex-end" display={{ base: "none", md: "flex" }}>
            <Button
              onClick={saveEmployeeData}
              colorScheme="green"
              size="lg"
              fontSize="md"
              fontFamily="Noto Sans Lao, sans-serif"
            >
              ບັນທຶກ
            </Button>
          </Flex>

          {/* Edit Department Modal */}
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{ base: "full", md: "lg" }}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader fontFamily="Noto Sans Lao, sans-serif" fontSize="lg">
                ແກ້ໄຂຂໍ້ມູນຕຳແໜ່ງ
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="md" color="gray.600">
                      ຊື່ພະແນກ
                    </FormLabel>
                    <Input
                      name="type"
                      isDisabled
                      value={editedType}
                      onChange={(e) => setEditedType(e.target.value)}
                      placeholder="ປ້ອນຊື່ພະແນກ"
                      fontSize="sm"
                      bg="white"
                      borderColor="gray.300"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md" color="gray.600">
                      ຕຳແໜ່ງທີ່ມີຢູ່
                    </FormLabel>
                    {editedPosition.map((pos, index) => (
                      <Flex key={index} mb={2} align="center">
                        <Input
                          value={pos.type}
                          name="type"
                          onChange={(e) =>
                            handlePositionChange(index, e.target.value)
                          }
                          fontSize="sm"
                          bg="white"
                          borderColor="gray.300"
                          mr={2}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="md"
                          fontSize="lg"
                        />
                      </Flex>
                    ))}
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={saveEdit}
                  colorScheme="blue"
                  size="md"
                  fontSize="md"
                  fontFamily="Noto Sans Lao, sans-serif"
                  mr={3}
                >
                  ບັນທຶກ
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  fontSize="md"
                  fontFamily="Noto Sans Lao, sans-serif"
                >
                  ຍົກເລີກ
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Stack>
      )}
    </Box>
  );
};

export default EditdatabaseEmplyee;