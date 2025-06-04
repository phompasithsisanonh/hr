import {
  Text,
  Box,
  Grid,
  GridItem,
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
  Stack,
  Heading,
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
  const [outworkTime, setOutworkTime] = useState(0);
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
    department: [], // Ensure this is initialized as an array
  });
  ///funtion change time
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
      isInitialLoad.current = false; // ปิด flag หลังโหลดครั้งแรก
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
      // Clear inputs after adding
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

  ////funtion for rdit deparment
  const [editedType, setEditedType] = useState("");
  const [editedPosition, setEditedPosition] = useState([]);

  const handleEditDepartment = (dept, index) => {
    setEditedType(dept.type);
    setEditedPosition([...dept.position]); // Clone positions array
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
    <div>
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
            <Text mt={4} fontWeight="medium">
              ກຳລັງໂຫຼດຂໍ້ມູນ...
            </Text>
          </Flex>
        </Box>
      ) : (
        <Box>
          {/* Edit Department Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>ແກ້ໄຂຂໍ້ມູນຕຳແໜ່ງ</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>ຊື່ພະແນກ</FormLabel>
                    <Input
                      name="type"
                      value={editedType}
                      onChange={(e) => setEditedType(e.target.value)}
                      placeholder="ປ້ອນຊື່ພະແນກ"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>ຕຳແໜ່ງທີ່ມີຢູ່</FormLabel>
                    {editedPosition.map((pos, index) => (
                      <Flex key={index} mb={2} align="center">
                        <Input
                          value={pos.type}
                          name="type"
                          onChange={(e) =>
                            handlePositionChange(index, e.target.value)
                          }
                          mr={2}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          // onClick={() => handleRemovePosition(index)}
                        />
                      </Flex>
                    ))}
                  </FormControl>
                </Stack>
              </ModalBody>

              <ModalFooter>
                <Button onClick={saveEdit} colorScheme="blue" mr={3}>
                  ບັນທຶກ
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  ຍົກເລີກ
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Heading
            paddingTop={"30px"}
            fontFamily="Noto Sans Lao, serif"
            fontSize="xl"
            fontWeight="bold"
            mb={4}
          >
            ຖານຂໍ້ມູນ
          </Heading>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {/* Department dropdown */}
            <GridItem>
              <FormControl isRequired>
                <FormLabel>ພະແນກ</FormLabel>
                <Select
                  value={newDepartmentType}
                  onChange={(e) => setNewDepartmentType(e.target.value)}
                >
                  <option value="">ເລືອກພະແນກ</option>
                  {editDataOneid?.department?.map((data, index) => (
                    <option key={index} value={data.type}>
                      {data.type}
                    </option>
                  ))}
                </Select>

                {/* Input field that gets disabled when a department is selected */}

                <Input
                  mt={2}
                  type="text"
                  name="type"
                  value={newDepartmentType}
                  onChange={(e) => setNewDepartmentType(e.target.value)}
                  placeholder="ໍຊື່"
                  isDisabled={editDataOneid?.department?.some(
                    (dept) => dept.type === newDepartmentType
                  )}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ລະຫັດພະແນກ</FormLabel>
                <Input
                  type="text"
                  name="newDepartmenId"
                  value={newDepartmenId}
                  onChange={(e) => setNewDepartmenId(e.target.value)}
                  placeholder="ລະຫັດພະແນກ"
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>ຕຳແໜ່ງ</FormLabel>
                <Input
                  type="text"
                  name="rate"
                  value={newDepartmentRate}
                  onChange={(e) => setNewDepartmentRate(e.target.value)}
                  placeholder="ຊື່ຕຳແໜ່ງ"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ລະຫັດຕຳແໜ່ງ</FormLabel>
                <Input
                  type="text"
                  name="newPosiontionId"
                  value={newPosiontionId}
                  onChange={(e) => setNewPosiontionId(e.target.value)}
                  placeholder="ລະຫັດຕຳແໜ່ງ"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ລະດັບຂັ້ນ</FormLabel>
                <Input
                  type="text"
                  name="levelPosiontion"
                  value={levelPosiontion}
                  onChange={(e) => setLevelPosiontion(e.target.value)}
                  placeholder="ລະດັບຂັ້ນ"
                />
              </FormControl>
              <Button onClick={handleAddDepartment} mt={2} colorScheme="blue">
                ເພີ່ມ
              </Button>
            </GridItem>
            <GridItem colSpan={3}>
              {/* Table to display department and position */}
              {formData?.department?.length > 0 && (
                <Table variant="simple" mt={4}>
                  <Thead>
                    <Tr>
                      <Th fontFamily="Noto Sans Lao, serif">ພະແນກ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ຕຳແໜ່ງ</Th>
                      <Th fontFamily="Noto Sans Lao, serif" width="100px">
                        ຈັດການ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {formData?.department.map((dept, index) => (
                      <Tr key={index}>
                        <Td>{dept.type}</Td>

                        <Td>{dept.position.map((d) => d.type).join(", ")}</Td>
                        <Td>
                          <IconButton
                            aria-label="Delete department"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveDepartment(index)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </GridItem>

            <GridItem colSpan={3}>
              {/* Table to display department and position */}
              {editDataOneid?.department?.length > 0 && (
                <Table variant="simple" mt={4}>
                  <Thead>
                    <Tr>
                      <Th fontFamily="Noto Sans Lao, serif">ພະແນກ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ຕຳແໜ່ງ</Th>
                      <Th fontFamily="Noto Sans Lao, serif" width="100px">
                        ຈັດການ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {editDataOneid?.department.map((dept, index) => (
                      <Tr key={index}>
                        <Td>{dept.type}</Td>

                        <Td>{dept.position.map((d) => d.type).join(", ")}</Td>

                        <Td>
                          <IconButton
                            aria-label="Delete department"
                            icon={<EditIcon />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleEditDepartment(dept, index)}
                          />
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Delete department"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveDepartment(index)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>ກຳນົດເງິນລ່ວງເວລາຊົ່ວໂມງ</FormLabel>
                <Input
                  name="otTohour"
                  value={formData.otTohour}
                  onChange={handleInputChange}
                  placeholder="เงินค่าชั่วโมง"
                  type="number"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ກຳນົດເງິນລ່ວງເວລາເປັນ30ນາທີ</FormLabel>
                <Input
                  name="otminute"
                  value={formData.otminute}
                  onChange={handleInputChange}
                  placeholder="ອັດຕາເງິນລ່ວງເວລາ"
                  type="number"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>ກຳນົດເງິນມາຊ້າເວລາເປັນຊົ່ວໂມງ</FormLabel>
                <Input
                  name="latTohour"
                  value={formData.latTohour}
                  onChange={handleInputChange}
                  placeholder="ເງິນຄ່າຊົ່ວໂມງ"
                  type="number"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ກຳນົດເງິນມາຊ້າເວລາເປັນ30ນາທີ</FormLabel>
                <Input
                  name="latminute"
                  value={formData.latminute}
                  onChange={handleInputChange}
                  placeholder="ອັດຕາເງິນລ່ວງເວລາ"
                  type="number"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isRequired>
                <FormLabel>ກຳນົດໂມງເຮັດວຽກ</FormLabel>
                <Input
                  name="startWorkTime"
                  value={workTime}
                  onChange={(e) => setWorkTime(e.target.value)}
                  placeholder="ກຳນົດໂມງເຮັດວຽກ"
                  type="time"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ກຳນົດໂມງເລີກວຽກ</FormLabel>
                <Input
                  value={outworkTime}
                  onChange={(e) => setOutworkTime(e.target.value)}
                  placeholder="ກຳນົດໂມງເລີກເຮັດວຽກ"
                  type="time"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>ກຳນົດຈັກຊົ່ວໂມງເຮັດວຽກ</FormLabel>
                <Input
                  name="standardTimeWorkHour"
                  value={hours}
                  disabled={true}
                  placeholder="ກຳນົດຈັກຊົ່ວໂມງເຮັດວຽກ"
                  type="number"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <Flex gap={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel>ປະເພດຄ່າຄອມມິຊັ່ນ</FormLabel>
                  <Input
                    value={commissionType}
                    onChange={handleCommissionTypeChange}
                    placeholder="ປະເພດຄ່າຄອມ"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>ອັດຕາ</FormLabel>
                  <Input
                    value={commissionRate}
                    onChange={handleCommissionRateChange}
                    placeholder="rate"
                    type="number"
                  />
                </FormControl>
              </Flex>
            </GridItem>

            <GridItem>
              <FormControl isRequired>
                <FormLabel>ກຳນົດວັນພັກປະຈຳປີ</FormLabel>
                <Input
                  name="setAnnualHolidays"
                  value={formData.setAnnualHolidays}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="ຈຳນວນວັນ"
                />
              </FormControl>
            </GridItem>
          </Grid>
          {/* ///// */}

          <Box mt={8}>
            <Text fontSize="lg" fontWeight="medium" mb={4}>
              ຂໍ້ມູນຈຳນວນລາພັກໄດ້
            </Text>

            <Flex gap={4} mb={4}>
              <FormControl>
                <FormLabel>ປະເພດລາພັກ</FormLabel>
                <Input
                  placeholder="ປະເພດລາພັກ"
                  value={newcontent}
                  name="newcontent"
                  type="string"
                  onChange={(e) => setNewcontent(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>ຈຳນວນວັນພັກ</FormLabel>
                <Input
                  type="number"
                  placeholder=""
                  name="newCountholiday"
                  value={newCountholiday}
                  onChange={(e) => setNewCountholiday(e.target.value)}
                />
              </FormControl>

              <Box alignSelf="flex-end" mb={1}>
                <Button colorScheme="blue" onClick={handleContentHoliday}>
                  ເພີ່ມ
                </Button>
              </Box>
            </Flex>

            {/* Table to display insurance types */}
            {formData?.contentsOfHolidays?.length > 0 && (
              <Table variant="simple" mt={4}>
                <Thead>
                  <Tr>
                    <Th fontFamily="Noto Sans Lao, serif">ຈຳນວນວັນພັກ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ປະເພດວັນພັກ</Th>
                    <Th fontFamily="Noto Sans Lao, serif" width="100px">
                      ຈັດການ
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {formData?.contentsOfHolidays?.map((insurance, index) => (
                    <Tr key={index}>
                      <Td>{insurance.countday}</Td>
                      <Td>{insurance.content}</Td>
                      <Td>
                        <IconButton
                          aria-label="Delete insurance"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRemoveContentHoliday(index)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>

          {/* ///// */}
          <Box mt={8}>
            <Text fontSize="lg" fontWeight="medium" mb={4}>
              ຂໍ້ມູນປະກັນສັງຄົມ
            </Text>

            <Flex gap={4} mb={4}>
              <FormControl>
                <FormLabel>ປະເພດປະກັນສັງຄົມ</FormLabel>
                <Input
                  placeholder="ປະເພດປະກັນສັງຄົມ"
                  value={newInsuranceType}
                  onChange={(e) => setNewInsuranceType(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>ອັດຕາຫັກປະກັນສັງຄົມ</FormLabel>
                <Input
                  type="number"
                  placeholder="%"
                  value={newInsuranceRate}
                  onChange={(e) => setNewInsuranceRate(e.target.value)}
                />
              </FormControl>

              <Box alignSelf="flex-end" mb={1}>
                <Button colorScheme="blue" onClick={handleAddInsurance}>
                  ເພີ່ມຂໍ້ມູນ
                </Button>
              </Box>
            </Flex>

            {/* Table to display insurance types */}
            {Array.isArray(formData.typeOfSecurity) &&
              formData.typeOfSecurity.length > 0 && (
                <Table variant="simple" mt={4}>
                  <Thead>
                    <Tr>
                      <Th fontFamily="Noto Sans Lao, serif">
                        ປະເພດປະກັນສັງຄົມ
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif">
                        ອັດຕາຫັກປະກັນສັງຄົມ(%)
                      </Th>
                      <Th fontFamily="Noto Sans Lao, serif" width="100px">
                        ຈັດການ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {formData.typeOfSecurity.map((insurance, index) => (
                      <Tr key={index}>
                        <Td>{insurance.type}</Td>
                        <Td>{insurance.rate}%</Td>
                        <Td>
                          <IconButton
                            aria-label="Delete insurance"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={() =>
                              handleRemoveInsurance(insurance, index)
                            }
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
          </Box>

          <Flex justifyContent="flex-end" mt={8}>
            <Button onClick={saveEmployeeData} colorScheme="green" size="lg">
              ບັນທຶກ
            </Button>
          </Flex>
        </Box>
      )}
    </div>
  );
};

export default EditdatabaseEmplyee;
