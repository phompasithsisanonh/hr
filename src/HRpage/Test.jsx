
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  IconButton,
  Text,
  useToast,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  getTax,
  messageClear,
  saveTax,
} from "../store/Reducer/HRReducer/salaryReducer";
import { useDispatch, useSelector } from "react-redux";

const TaxIncomeEm = () => {
  const { errorMessage, successMessage, getTaxeis } = useSelector(
    (state) => state.salary
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const [edit, setEdit] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    minAmount: 0,
    maxAmount: 0,
  });
  const dispatch = useDispatch();
  const toast = useToast();
  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }

    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, toast]);
  useEffect(() => {
    dispatch(getTax());
  }, [dispatch]);
  const [incomes, setIncomes] = useState([
    { id: Date.now(), minAmount: 0, maxAmount: 0, rate: 0 },
  ]);

  // Add new income field
  const addIncomeField = () => {
    setIncomes([
      ...incomes,
      { id: Date.now(), minAmount: 0, maxAmount: 0, rate: 0 },
    ]);
  };

  // Remove income field
  const removeIncomeField = (id) => {
    if (incomes.length === 1) {
      toast({
        title: "ບໍ່ສາມາດລົບໄດ້",
        description: "ຕ້ອງມີຢ່າງໜ້ອຍ 1 ຊ່ອງ",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIncomes(incomes.filter((income) => income.id !== id));
  };

  // Update input values
  const handleInputChange = (id, e) => {
    const { name, value } = e.target;
    // Convert string input to number
    const numericValue =
      name === "rate" ? parseFloat(value) : parseInt(value, 10);

    setIncomes((prev) =>
      prev.map((income) =>
        income.id === id ? { ...income, [name]: numericValue || 0 } : income
      )
    );
  };

  // Save tax brackets
  const saveTaxBrackets = () => {
    // Validate inputs before saving

    const isValid = validateTaxBrackets();
    if (isValid) {
      dispatch(saveTax(incomes)).then(() => dispatch(getTax()));
    }
  };

  // Validate tax brackets

  const validateTaxBrackets = () => {
    // Check for negative values
    //ກວດເຊັກວ່າ ຂໍ້ມູນທີ່ປ້ອນນີ້ຕ້ອງຫຼາຍກວ່າຄ່າກ່ອນໜ້າຕົວສຸດທ້າຍ
    for (let i = 0; i < incomes.length; i++) {
      const filterMax = getTaxeis.some(
        (item) => Math.max(item.maxAmount) > incomes[i].minAmount
      );
      if (filterMax) {
        toast({
          title: "Overlapping Brackets",
          description: "ຂໍ້ມູນທີ່ປ້ອນນີ້ຕ້ອງຫຼາຍກວ່າຄ່າກ່ອນໜ້າຕົວສຸດທ້າຍ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
    }
    // ຄ່າໃຫ່ຍສຸດຕ້ອງບໍ່ເທົ່າສູນ
    const hasEmptyValues = incomes.some((income) => income.maxAmount === 0);
    if (hasEmptyValues) {
      toast({
        title: "Invalid Input",
        description: "ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    //  ຫ້າມນ້ອຍກວ້າສູນ
    const hasNegativeValues = incomes.some(
      (income) =>
        income.minAmount < 0 || income.maxAmount < 0 || income.rate < 0
    );

    if (hasNegativeValues) {
      toast({
        title: "Invalid Input",
        description: "ຄ່າບໍ່ສາມາດຕິດລົບໄດ້",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    // ຫ້າມຄ່ານ້ອຍ ໃຫ່ຍກວ່າຄ່າ ຫລາຍກວ່າເດັດຂາດ ແລະ ບໍ່ເທົ່າສູນ
    // Check if min is greater than max
    const hasInvalidRange = incomes.some(
      (income) => income.minAmount > income.maxAmount && income.maxAmount !== 0
    );

    if (hasInvalidRange) {
      toast({
        title: "Invalid Range",
        description: "ຄ່າຕໍ່າສຸດຫ້າມສູງກວ່າຄ່າຫຼາຍສຸດ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    //max[0] != min[1]
    for (let i = 0; i < incomes.length - 1; i++) {
      //ຮອບບແລກ
      for (let j = i + 1; j < incomes.length; j++) {
        //ຮອບບສອງ
        const rangeA = incomes[i].maxAmount; ///0-1,300,000
        const rangeB = incomes[j].minAmount; //1,300,000-2,000,000

        if (incomes[j].rate === 0 || rangeB === 0) {
          toast({
            title: "Invalid Range",
            description: "ກະລຸນາເພີ່ມຂໍ້ມູນ",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
        if (rangeB !== rangeA) {
          toast({
            title: "Invalid Range",
            description: "ຫາ ຕ້ອງຄືກັນກັບ ແຕ່",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return false;
        }
      }
    }

    return true;
  };
  const openAddModal = () => {
   
  };
  const editMode = (item, index) => {
    setEdit((prev) => !prev);
    setEditIndex(index);
    setFormData({
      id: item.id,
      minAmount: item.minAmount,
      maxAmount: item.maxAmount,
    });
  };
  console.log(formData);
  return (
    <Box p={6} mt={8} borderWidth={1} borderRadius="lg">
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg" fontFamily="Noto Sans Lao, serif">
          ການຈັດການຖານຄິດໄລ່ອາກອນລາຍໄດ້
        </Heading>
        <Tooltip label="ເພີ່ມຊ່ວງອາກອນໃໝ່">
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={openAddModal}
            size="md"
          >
            ເພີ່ມຊ່ວງອາກອນ
          </Button>
        </Tooltip>
      </Flex>

      {/* <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">
          ຈັດເກັບຖານຄິດໄລ່ອາກອນລາຍໄດ້
        </Text>
        <Button colorScheme="blue" onClick={addIncomeField} width="20%">
          ເພີ່ມ
        </Button>
        {incomes.map((income, index) => (
          <HStack key={income.id} w="100%" spacing={2} align="flex-end">
            <FormControl>
              <FormLabel>ແຕ່ {index + 1}</FormLabel>
              <Input
                type="number"
                name="minAmount"
                disabled={getTaxeis.length < 0 ? true : false}
                value={income.minAmount}
                onChange={(e) => handleInputChange(income.id, e)}
                placeholder="กรอกจำนวนเงิน"
              />
            </FormControl>

            <Text mt={2}>-</Text>

            <FormControl>
              <FormLabel>ຫາ {index + 1}</FormLabel>
              <Input
                type="number"
                name="maxAmount"
                value={income.maxAmount}
                onChange={(e) => handleInputChange(income.id, e)}
                placeholder="กรอกจำนวนเงิน"
              />
            </FormControl>

            <Text mt={2}>-</Text>

            <FormControl>
              <FormLabel>ອັດຕາ {index + 1} (%)</FormLabel>
              <Input
                type="number"
                name="rate"
                disabled={getTaxeis.length < 0 ? true : false}
                value={income.rate}
                onChange={(e) => handleInputChange(income.id, e)}
                placeholder="กรอกอัตราภาษี"
                step="0.01"
              />
            </FormControl>

            <IconButton
              aria-label="Delete income"
              icon={<DeleteIcon />}
              disabled={getTaxeis.length < 0 ? true : false}
              onClick={() => removeIncomeField(income.id)}
              colorScheme="red"
            />
          </HStack>
        ))}

        <Box w="100%" p={4} bg="gray.100" borderRadius="md">
          <Button onClick={saveTaxBrackets} colorScheme="teal" width="100%">
            ບັນທຶກຂໍ້ມູນ
          </Button>
        </Box>
      </VStack>

      <Box mt={4} p={4} bg="gray.50" borderRadius="md">
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          ມາດຕະຖານອັດຕາອາກອນລາຍໄດ້ຂອງພະນັກງານ
        </Text>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th fontFamily={"Noto Sans Lao, serif"}>ລະດັບ</Th>
              <Th fontFamily={"Noto Sans Lao, serif"}>ຖານລາຍໄດ້ຕໍ່ເດືອນ</Th>
              <Th fontFamily={"Noto Sans Lao, serif"}>ອັດຕາ</Th>
              <Th fontFamily={"Noto Sans Lao, serif"}>ແກ້ໄຂ້</Th>
              <Th fontFamily={"Noto Sans Lao, serif"}>ລົບອອກ</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getTaxeis.map((item, index) => (
              <Tr key={index}>
                {edit && editIndex === index ? (
                  <HStack w="100%" spacing={2} align="flex-end">
                    <Td>{index + 1}</Td>

                    <Input
                      name="minAmount"
                      type="number"
                      value={formData.minAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minAmount: Number(e.target.value),
                        })
                      }
                    />
                    <Input
                      name="maxAmount"
                      type="number"
                      value={formData.maxAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxAmount: Number(e.target.value),
                        })
                      }
                    />

                    <Input
                      name="rate"
                      type="number"
                      step="0.01"
                      value={formData.rate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rate: Number(e.target.value),
                        })
                      }
                    />
                  </HStack>
                ) : (
                  <>
                    <Td>{index + 1}</Td>
                    <Td>
                      {item.minAmount.toLocaleString()} -
                      {item.maxAmount.toLocaleString()}
                    </Td>
                    <Td>{item.rate} %</Td>
                  </>
                )}
                <Td>
                  <IconButton
                    colorScheme="blue"
                    onClick={() => editMode(item, index)}
                    icon={<EditIcon />}
                  />
                </Td>
                <Td>
                  <IconButton colorScheme="red" icon={<DeleteIcon />} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box> */}
    </Box>
  );
};

export default TaxIncomeEm;
