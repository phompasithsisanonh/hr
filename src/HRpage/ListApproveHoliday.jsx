import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { View } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  getleave,
  messageClear,
  postleave,
} from "../store/Reducer/HRReducer/InformationEmplyee";
import toast from "react-hot-toast";
const ListApproveHoliday = () => {
  // ตัวอย่างข้อมูลคำขอวันลา

  const dispatch = useDispatch();
  const { getleavris, errorMessage, successMessage } = useSelector(
    (state) => state.information
  );
  const { userInfo } = useSelector((state) => state.auth);

  // ฟังก์ชันคืน badge ตามสถานะ
  const statusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge colorScheme="green">ອະນຸຍາດແລ້ວ</Badge>;
      case "rejected":
        return <Badge colorScheme="red">ບໍ່ອະນຸຍາດ</Badge>;
      case "cancel":
        return <Badge colorScheme="gray">ຍົກເລີກ</Badge>;
      default:
        return <Badge colorScheme="yellow">ລໍຖ້າອະນຸຍາດ</Badge>;
    }
  };
  const approveLeave = (item, status) => {
    dispatch(
      postleave({
        leaveId: item._id,
        status: status,
      })
    ).then(() => dispatch(getleave()));
  };
  useEffect(() => {
    dispatch(getleave());
  }, [dispatch]);
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
    <Box p={6} borderRadius="lg" boxShadow="md" borderWidth="1px">
      <Heading
        fontFamily="Noto Sans Lao, serif"
        as="h2"
        size="lg"
        mb={6}
        textAlign="center"
      >
        ລານການອະນຸມັດລາພະນັກງານ
      </Heading>
      <Box
        paddingBottom={"20px"}
      >
       your userID: <Badge>{userInfo._id}</Badge>
      </Box>
      <VStack spacing={4} align="stretch">
        <Table variant="simple" size="md">
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center">#</Th>
              <Th fontFamily="Noto Sans Lao, serif">ລະຫັດພະນັກງານ</Th>
              <Th fontFamily="Noto Sans Lao, serif">ປະເພດລາ</Th>
              <Th fontFamily="Noto Sans Lao, serif">ວັນທີລາ</Th>
              <Th fontFamily="Noto Sans Lao, serif">ວັນທີ່ສິ້ນສຸດ</Th>
              <Th fontFamily="Noto Sans Lao, serif">ເຫດຜົນ</Th>
              <Th fontFamily="Noto Sans Lao, serif">ສະຖານະ</Th>
              <Th fontFamily="Noto Sans Lao, serif" textAlign="center">
                ການຈັດການ
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {getleavris.map((item, index) => (
              <Tr key={index}>
                <Td textAlign="center">{index + 1}</Td>
                <Td>{item.emplyeeCode}</Td>
                <Td>{item.leaveType}</Td>
                <Td>{item.startDate.split("T")[0]}</Td>
                <Td>{item.endDate.split("T")[0]}</Td>
                <Td>{item.reason}</Td>
                <Td>{statusBadge(item.status)}</Td>
                <Td textAlign="center">
                  <Tooltip label="review">
                    <IconButton
                      icon={<View />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => approveLeave(item)}
                      aria-label="review"
                      mr={2}
                    />
                  </Tooltip>
                  {item.status === "pending" ? (
                    <>
                      <Tooltip label="อนุมัติ">
                        <IconButton
                          icon={<IoCheckmark />}
                          colorScheme="green"
                          size="sm"
                          onClick={() => approveLeave(item, "approved")}
                          aria-label="Approve"
                          mr={2}
                        />
                      </Tooltip>
                    </>
                  ) : item.status === "approved" ? (
                    <Tooltip label="ไม่อนุมัติ">
                      <IconButton
                        icon={<IoClose />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => approveLeave(item, "rejected")}
                        aria-label="Reject"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip label="อนุมัติ">
                      <IconButton
                        icon={<IoCheckmark />}
                        colorScheme="green"
                        size="sm"
                        onClick={() => approveLeave(item, "approved")}
                        aria-label="Approve"
                        mr={2}
                      />
                    </Tooltip>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default ListApproveHoliday;
