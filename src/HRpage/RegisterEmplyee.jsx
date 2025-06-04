import React, { useCallback, useEffect, useState } from "react"; // Fixed capitalization
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Select,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  DataEmplyee,
  registerEmployee,
} from "../store/Reducer/HRReducer/InformationEmplyee";
import { useNavigate } from "react-router-dom";

const RegisterEmployee = () => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.700");
  const dispatch = useDispatch();
  const navigate =useNavigate()
  const toast = useToast();
  const { getdatabase, loading } = useSelector((state) => state.information);
  const get = getdatabase[0];
  // State สำหรับเก็บ URL ชั่วคราวของรูปภาพที่เลือก เพื่อแสดง preview
  const [imagePreviews, setImagePreviews] = useState({
    profileImage: null,
    idCardImage: null,
  });
  const [department, setDepartment] = useState({});
  const [position, setPosition] = useState({});
  // State for personal information  // State สำหรับเก็บข้อมูลส่วนตัวของพนักงาน
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dob: "",
    gender: "",
    ethnicity: "",
    nationality: "",
    religion: "",
    village: "",
    district: "",
    maritalStatus: "",
    phone: "",
    address: "",
    documentType: "",
    issueDate: "",
    expiryDate: "",
    documentNumber: "",
    profileImage: null, // ไฟล์รูปโปรไฟล์ที่เลือก
    idCardImage: null, // ไฟล์รูปบัตรที่เลือก
  });

  // State for education history
  // State สำหรับเก็บประวัติการศึกษา (เป็น Array เพราะอาจมีหลายรายการ)
  const [educationHistory, setEducationHistory] = useState([]);
  // State สำหรับเก็บข้อมูลการศึกษาที่กำลังกรอกในฟอร์ม (ก่อนกด Add)
  const [newEducation, setNewEducation] = useState({
    level: "",
    major: "",
    university: "",
    country: "",
    graduationYear: "",
    gpa: "",
    certificate: null,
    certificatePreview: null, // URL ชั่วคราวสำหรับ preview ใบรับรอง
  });

  // State for work experience  // State สำหรับเก็บประวัติการทำงาน (เป็น Array)
  const [workExperience, setWorkExperience] = useState([]);
  const [newWork, setNewWork] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    referenceFile: null,
    referenceFilePreview: null,
  });

  // State for employment info
  const [employmentInfo, setEmploymentInfo] = useState({
    probationPeriod: "",
    contractType: "",
    startDate: "",
    contractDuration: "",
    workStartTime: "",
    workEndTime: "",
    workplace: "",
    contractFile: null,
    contractFilePreview: null,
  });
  const filterPosition = get?.department?.find(
    (i) => i._id === department._id
  );
  // State for salary and benefits
  const [salaryInfo, setSalaryInfo] = useState({
    baseSalary: "",
    overtimeRate: "",
    commissionType: "",
    commissionRate: "",
    annualHolidays: "",
  });

  // State for social security
  const [socialSecurity, setSocialSecurity] = useState([]);
  // Initialize social security from getdatabase
  useEffect(() => {
    if (getdatabase?.length > 0 && getdatabase[0]?.typeOfSecurity) {
      setSocialSecurity(getdatabase[0].typeOfSecurity);
    } else {
      // Initialize with at least one empty record if no data
      setSocialSecurity([
        {
          type: "",
          rate: "",
          registrationPlace: "",
          registrationDate: "",
        },
      ]);
    }
  }, [getdatabase]);

  // Handle personal info changes
  const handlePersonalInfoChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      setPersonalInfo((prev) => ({ ...prev, [name]: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle education form input changes
  const handleEducationChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "certificate" && files?.[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEducation((prev) => ({
          ...prev,
          certificate: file,
          certificatePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewEducation((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle work experience form input changes
  const handleWorkChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "referenceFile" && files?.[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewWork((prev) => ({
          ...prev,
          referenceFile: file,
          referenceFilePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setNewWork((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle employment info changes
  const handleEmploymentChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "contractFile" && files?.[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmploymentInfo((prev) => ({
          ...prev,
          contractFile: file,
          contractFilePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setEmploymentInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle social security changes
  const handleSocialSecurityChange = (index, field, value) => {
    setSocialSecurity((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Add new social security entry
  // const handleAddSocialSecurity = () => {
  //   setSocialSecurity([
  //     ...socialSecurity,
  //     {
  //       type: "",
  //       accountNumber: "",
  //       registrationPlace: "",
  //       registrationDate: "",
  //     },
  //   ]);
  // };

  // // Remove social security entry
  // const handleRemoveSocialSecurity = (index) => {
  //   if (socialSecurity.length > 1) {
  //     setSocialSecurity(socialSecurity.filter((_, i) => i !== index));
  //   } else {
  //     toast({
  //       title: "ບໍ່ສາມາດລຶບໄດ້",
  //       description: "ຕ້ອງມີຢ່າງໜ້ອຍໜຶ່ງລາຍການ",
  //       status: "warning",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  // Add new education entry
  const handleAddEducation = () => {
    if (
      !newEducation.level ||
      !newEducation.major ||
      !newEducation.university
    ) {
      toast({
        title: "ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຈຳເປັນ",
        description: "ກະລຸນາປ້ອນລະດັບການສຶກສາ, ສາຂາວິຊາຮຽນ, ແລະ ມະຫາວິທະຍາໄລ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setEducationHistory([...educationHistory, { ...newEducation }]);
    setNewEducation({
      level: "",
      major: "",
      university: "",
      country: "",
      graduationYear: "",
      gpa: "",
      certificate: null,
      certificatePreview: null,
    });
  };
 const handlePositon = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === "position") {
        const selectedPosition = filterPosition?.position?.find(
          (p) => p._id === value
        );
        console.log(selectedPosition);
        setPosition(selectedPosition);
      }
    },
    [filterPosition?.position]
  );
  const handleDepartmentAndPositionChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === "department") {
        const selectedDepartment = get?.department?.find(
          (d) => d.type === value
        );
        setDepartment(selectedDepartment);
        // Reset position when department changes
      }
    },
    [get?.department]
  );
  // Remove education entry
  const handleRemoveEducation = (index) => {
    setEducationHistory(educationHistory.filter((_, i) => i !== index));
  };

  // Add new work experience entry
  const handleAddWork = () => {
    if (!newWork.company || !newWork.position) {
      toast({
        title: "ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຈຳເປັນ",
        description: "ກະລຸນາປ້ອນຊື່ບໍລິສັດ ແລະ ຕຳແໜ່ງ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setWorkExperience([...workExperience, { ...newWork }]);
    setNewWork({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      referenceFile: null,
      referenceFilePreview: null,
    });
  };

  // Remove work experience entry
  const handleRemoveWork = (index) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  // Handle salary info changes
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Prepare form data for submission
  const prepareFormData = () => {
    const formData = new FormData();

    // Add personal info
    Object.keys(personalInfo).forEach((key) => {
      if (personalInfo[key] !== null && personalInfo[key] !== undefined) {
        formData.append(`personalInfo[${key}]`, personalInfo[key]);
      }
    });
    //
    Object.entries(department).forEach(([key, value]) =>
        formData.append(`department[${key}]`, department[key])
    );
     Object.entries(position).forEach(([key, value]) =>
        formData.append(`position[${key}]`, position[key])
    );
    //
    // Add education history
    educationHistory.forEach((education, index) => {
      Object.keys(education).forEach((key) => {
        if (
          education[key] !== null &&
          education[key] !== undefined &&
          key !== "certificatePreview"
        ) {
          formData.append(`educationHistory[${index}][${key}]`, education[key]);
        }
      });
    });

    // Add work experience
    workExperience.forEach((work, index) => {
      Object.keys(work).forEach((key) => {
        if (
          work[key] !== null &&
          work[key] !== undefined &&
          key !== "referenceFilePreview"
        ) {
          formData.append(`workExperience[${index}][${key}]`, work[key]);
        }
      });
    });

    // Add employment info
    Object.keys(employmentInfo).forEach((key) => {
      if (
        employmentInfo[key] !== null &&
        employmentInfo[key] !== undefined &&
        key !== "contractFilePreview"
      ) {
        formData.append(`employmentInfo[${key}]`, employmentInfo[key]);
      }
    });

    // Add salary info
    Object.keys(salaryInfo).forEach((key) => {
      if (salaryInfo[key] !== null && salaryInfo[key] !== undefined) {
        formData.append(`salaryInfo[${key}]`, salaryInfo[key]);
      }
    });

    // Add social security
    socialSecurity.forEach((security, index) => {
      Object.keys(security).forEach((key) => {
        if (security[key] !== null && security[key] !== undefined) {
          formData.append(`socialSecurity[${index}][${key}]`, security[key]);
        }
      });
    });
    // ตรวจสอบ FormData หลัง append
    console.log("FormData หลัง append:", Array.from(formData.entries()));
    return formData;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!personalInfo.fullName || !personalInfo.dob) {
      toast({
        title: "ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຈຳເປັນ",
        description: "ກະລຸນາປ້ອນຊື່ ແລະ ວັນເດືອນປີເກີດ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = prepareFormData();

    // Uncomment when ready to implement submission
    dispatch(registerEmployee(formData))
      .unwrap()
      .then(() => {
        toast({
          title: "ການລົງທະບຽນພະນັກງານສຳເລັດແລ້ວ",
          description: "ຂໍ້ມູນພະນັກງານໄດ້ຖືກບັນທຶກສຳເລັດແລ້ວ",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate('/')
        //     // Reset form - implemented in the actual function
      })
      .catch((err) => {
        toast({
          title: "ການລົງທະບຽນລົ້ມເຫລວ",
          description: err.message || "ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });


  };

  useEffect(() => {
    dispatch(DataEmplyee());
    setSalaryInfo({
      baseSalary: "",
      overtimeRate: get?.otTohour,
      commissionType: "",
      commissionRate: "",
      annualHolidays: get?.setAnnualHolidays,
    });
  }, [dispatch, get?.otTohour, get?.setAnnualHolidays]);

  return (
    <Container maxW="container.lg" py={8}>
      <Box
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={6}
        bg={bgColor}
        boxShadow="sm"
      >
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Heading
            fontFamily="Noto Sans Lao, serif"
            size="md"
            textAlign="center"
            mb={4}
          >
            ຂໍ້ມູນເອກະສານປະຈຳໂຕ
          </Heading>

          {/* Section 1: Personal Information */}
          <Box>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ຂໍ້ມູນສ່ວນໂຕ
            </Heading>

            {/* Profile Image Upload */}
            <Box mb={6}>
              <FormControl>
                <FormLabel>ຮູບໂປຣຟາຍ</FormLabel>
                <Flex direction="column" align="center">
                  {imagePreviews.profileImage && (
                    <Image
                      src={imagePreviews.profileImage}
                      alt="Profile Preview"
                      boxSize="150px"
                      objectFit="cover"
                      borderRadius="full"
                      mb={2}
                    />
                  )}
                  <Input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handlePersonalInfoChange}
                  />
                </Flex>
              </FormControl>
            </Box>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ຊື່ ແລະ ນາມສະກຸນ</FormLabel>
                  <Input
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    placeholder="ຊື່ ແລະ ນາມສະກຸນ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ວັນເດືອນປີເກີດ</FormLabel>
                  <Input
                    type="date"
                    name="dob"
                    value={personalInfo.dob}
                    onChange={handlePersonalInfoChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ເພດ</FormLabel>
                  <Select
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                    placeholder="-- ເລືອກ --"
                  >
                    <option value="ຊາຍ">ຊາຍ</option>
                    <option value="ຍິງ">ຍິງ</option>
                    <option value="ອື່ນໆ">ອື່ນໆ</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>

          {/* Section 2: Secondary Information */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>ຊົນເຜົ່າໃດ</FormLabel>
                <Input
                  name="ethnicity"
                  value={personalInfo.ethnicity}
                  onChange={handlePersonalInfoChange}
                  placeholder="ຊົນເຜົ່າ"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>ສັນຊາດໃດ</FormLabel>
                <Input
                  name="nationality"
                  value={personalInfo.nationality}
                  onChange={handlePersonalInfoChange}
                  placeholder="ສັນຊາດ"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>ສາດສະໜາ</FormLabel>
                <Input
                  name="religion"
                  value={personalInfo.religion}
                  onChange={handlePersonalInfoChange}
                  placeholder="ສາດສະໜາ"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Section 3: Address Information */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>ບ້ານເກີດເດີມ</FormLabel>
                <Input
                  name="village"
                  value={personalInfo.village}
                  onChange={handlePersonalInfoChange}
                  placeholder="ບ້ານເກີດເດີມ"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>ເມືອງກຳເນີດ</FormLabel>
                <Input
                  name="district"
                  value={personalInfo.district}
                  onChange={handlePersonalInfoChange}
                  placeholder="ເມືອງກຳເນີດ"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Section 4: Family Information */}
          <Box>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>ສະຖານະພາບ</FormLabel>
                  <Select
                    name="maritalStatus"
                    value={personalInfo.maritalStatus}
                    onChange={handlePersonalInfoChange}
                    placeholder="-- ເລືອກ --"
                  >
                    <option value="ໂສດ">ໂສດ</option>
                    <option value="ແຕ່ງງານ">ແຕ່ງງານ</option>
                    <option value="ແມ່ຮ້າງ">ແມ່ຮ້າງ</option>
                    <option value="ໝ້າຍ">ໝ້າຍ</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ເບີໂທລະສັບ</FormLabel>
                  <Input
                    name="phone"
                    value={personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                    placeholder="020..."
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ທີ່ຢູ່ບັດຈຸບັນ</FormLabel>
                  <Input
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                    placeholder="ບ້ານ, ເມືອງ, ແຂວງ"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>

          {/* Section 6: Document Information */}
          <Box>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ຂໍ້ມູນເອກະສານປະຈຳໂຕ/ພາສປອດ
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>ເອກະສານຢືນຢັນຕົວຕົນ</FormLabel>
                  <Select
                    name="documentType"
                    value={personalInfo.documentType}
                    onChange={handlePersonalInfoChange}
                    placeholder="-- ເລືອກ --"
                  >
                    <option value="ID-card">ບັດປະຈຳຕົວ</option>
                    <option value="passport">ພາສປອດ</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ວັນອອກບັດ</FormLabel>
                  <Input
                    type="date"
                    name="issueDate"
                    value={personalInfo.issueDate}
                    onChange={handlePersonalInfoChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ວັນໝົດອາຍຸ</FormLabel>
                  <Input
                    type="date"
                    name="expiryDate"
                    value={personalInfo.expiryDate}
                    onChange={handlePersonalInfoChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ເລກທີ່ບັດ</FormLabel>
                  <Input
                    name="documentNumber"
                    value={personalInfo.documentNumber}
                    onChange={handlePersonalInfoChange}
                    placeholder="ເລກທີ່ບັດ"
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl>
                  <FormLabel>ເພີ່ມຮູບພາບ</FormLabel>
                  {imagePreviews.idCardImage && (
                    <Image
                      src={imagePreviews.idCardImage}
                      alt="ID Card Preview"
                      maxH="200px"
                      mb={2}
                    />
                  )}
                  <Input
                    type="file"
                    name="idCardImage"
                    onChange={handlePersonalInfoChange}
                    accept="image/*"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>

          {/* Section 7: Education Information */}
          <Box>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ປະຫວັດການສຶກສາ
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ລະດັບການສຶກສາ</FormLabel>
                  <Select
                    name="level"
                    value={newEducation.level}
                    onChange={handleEducationChange}
                    placeholder="-- ເລືອກ --"
                  >
                    <option value="ຊັ້ນສູງ">ຊັ້ນສູງ</option>
                    <option value="ປະລິນຍາຕີ">ປະລິນຍາຕີ</option>
                    <option value="ປະລິນຍາໂທ">ປະລິນຍາໂທ</option>
                    <option value="ປະລິນຍາເອກ">ປະລິນຍາເອກ</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ສາຂາວິຊາຮຽນ</FormLabel>
                  <Input
                    name="major"
                    value={newEducation.major}
                    onChange={handleEducationChange}
                    placeholder="ສາຂາວິຊາຮຽນ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ມະຫາວິທະຍາໄລ</FormLabel>
                  <Input
                    name="university"
                    value={newEducation.university}
                    onChange={handleEducationChange}
                    placeholder="ມະຫາວິທະຍາໄລ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ປະເທດທີ່ສຶກສາ</FormLabel>
                  <Input
                    name="country"
                    value={newEducation.country}
                    onChange={handleEducationChange}
                    placeholder="ປະເທດ"
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
              gap={6}
              mt={4}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>ປີຈົບການສຶກສາ</FormLabel>
                  <Input
                    type="number"
                    name="graduationYear"
                    value={newEducation.graduationYear}
                    onChange={handleEducationChange}
                    placeholder="ປີຈົບ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ຄ່າຄະແນນສະເລ່ຍ</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    name="gpa"
                    value={newEducation.gpa}
                    onChange={handleEducationChange}
                    placeholder="ຄະແນນ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ເພີ່ມຮູບພາບ</FormLabel>
                  {newEducation.certificatePreview && (
                    <Image
                      src={newEducation.certificatePreview}
                      alt="Certificate Preview"
                      maxH="100px"
                      mb={2}
                    />
                  )}
                  <Input
                    type="file"
                    name="certificate"
                    onChange={handleEducationChange}
                    accept="image/*,application/pdf"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel> </FormLabel>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="red"
                    onClick={handleAddEducation}
                    w="full"
                  >
                    ເພີ່ມ
                  </Button>
                </FormControl>
              </GridItem>
            </Grid>

            {/* Education History Table */}
            {educationHistory.length > 0 && (
              <Box mt={6} overflowX="auto">
                <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
                  ລາຍການປະຫວັດການສຶກສາ
                </Heading>

                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th fontFamily="Noto Sans Lao, serif">ລະດັບ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ສາຂາວິຊາ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ມະຫາວິທະຍາໄລ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ປະເທດ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ປີຈົບ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ຄະແນນ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ໃບຢັ້ງຢືນ</Th>
                      <Th fontFamily="Noto Sans Lao, serif" width="80px">
                        ຈັດການ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {educationHistory.map((edu, index) => (
                      <Tr key={index}>
                        <Td>{edu.level}</Td>
                        <Td>{edu.major}</Td>
                        <Td>{edu.university}</Td>
                        <Td>{edu.country}</Td>
                        <Td>{edu.graduationYear}</Td>
                        <Td>{edu.gpa}</Td>
                        <Td>
                          {edu.certificatePreview && (
                            <Image
                              src={edu.certificatePreview}
                              alt="Certificate"
                              height="40px"
                              width="40px"
                              objectFit="cover"
                            />
                          )}
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Delete education"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveEducation(index)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </Box>

          {/* Work Experience Section */}
          <Box mt={8}>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ປະຫວັດການເຮັດວຽກ
            </Heading>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ຊື່ບໍລິສັດ</FormLabel>
                  <Input
                    name="company"
                    value={newWork.company}
                    onChange={handleWorkChange}
                    placeholder="ຊື່ບໍລິສັດ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ຕຳແໜ່ງ</FormLabel>
                  <Input
                    name="position"
                    value={newWork.position}
                    onChange={handleWorkChange}
                    placeholder="ຕຳແໜ່ງ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ວັນທີເລີ່ມ</FormLabel>
                  <Input
                    type="date"
                    name="startDate"
                    value={newWork.startDate}
                    onChange={handleWorkChange}
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              mt={4}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>ວັນທີສິ້ນສຸດ</FormLabel>
                  <Input
                    type="date"
                    name="endDate"
                    value={newWork.endDate}
                    onChange={handleWorkChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ເອກະສານອ້າງອີງ</FormLabel>
                  {newWork.referenceFilePreview && (
                    <Image
                      src={newWork.referenceFilePreview}
                      alt="Reference File Preview"
                      maxH="100px"
                      mb={2}
                    />
                  )}
                  <Input
                    type="file"
                    name="referenceFile"
                    onChange={handleWorkChange}
                    accept="image/*,application/pdf"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel> </FormLabel>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="red"
                    onClick={handleAddWork}
                    w="full"
                  >
                    ເພີ່ມ
                  </Button>
                </FormControl>
              </GridItem>
            </Grid>

            {/* Work Experience Table */}
            {workExperience.length > 0 && (
              <Box mt={6} overflowX="auto">
                <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
                  ລາຍການປະຫວັດການເຮັດວຽກ
                </Heading>

                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th fontFamily="Noto Sans Lao, serif">ຊື່ບໍລິສັດ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ຕຳແໜ່ງ</Th>
                      <Th fontFamily="Noto Sans Lao, serif"> ວັນທີເລີ່ມ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">�วັນທີສິ້ນສຸດ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ເອກະສານອ້າງອີງ</Th>
                      <Th fontFamily="Noto Sans Lao, serif" width="80px">
                        ຈັດການ
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {workExperience.map((work, index) => (
                      <Tr key={index}>
                        <Td>{work.company}</Td>
                        <Td>{work.position}</Td>
                        <Td>{work.startDate}</Td>
                        <Td>{work.endDate || "ປັດຈຸບັນ"}</Td>
                        <Td>
                          {work.referenceFilePreview && (
                            <Image
                              src={work.referenceFilePreview}
                              alt="Reference"
                              height="40px"
                              width="40px"
                              objectFit="cover"
                            />
                          )}
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="Delete work experience"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveWork(index)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </Box>

          {/* Employment Information Section */}
          <Box mt={8}>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ຂໍ້ມູນການຈ້າງງານ
            </Heading>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ພະແນກ</FormLabel>
                  <Select
                    name="department"
                     value={department?.type}
                    onChange={handleDepartmentAndPositionChange}
                    placeholder="-- ເລືອກ --"
                  >
                    {get?.department?.map((items, i) => (
                      <option key={i} value={items.type}>
                        {items.type}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel>ຕຳແໜ່ງ</FormLabel>
                  <Select
                     name="position"
                    value={position.type}
                    onChange={handlePositon}
                    placeholder="ຕຳແໜ່ງ"
                  >
                    {filterPosition?.position?.map((items, index) => (
                      <option value={items?._id}>{items?.type}</option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ໄລຍະທົດລອງງານ (ເດືອນ)</FormLabel>
                  <Input
                    type="number"
                    name="probationPeriod"
                    value={employmentInfo.probationPeriod}
                    onChange={handleEmploymentChange}
                    placeholder="ໄລຍະທົດລອງ"
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              mt={4}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>ປະເພດສັນຍາ</FormLabel>
                  <Select
                    name="contractType"
                    value={employmentInfo.contractType}
                    onChange={handleEmploymentChange}
                    placeholder="-- ເລືອກ --"
                  >
                    <option value="ສັນຍາມີກຳນົດ">ສັນຍາມີກຳນົດ</option>
                    <option value="ສັນຍາບໍ່ມີກຳນົດ">ສັນຍາບໍ່ມີກຳນົດ</option>
                    <option value="ຈ້າງຊົ່ວຄາວ">ຈ້າງຊົ່ວຄາວ</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ວັນເລີ່ມສັນຍາ</FormLabel>
                  <Input
                    type="date"
                    name="startDate"
                    value={employmentInfo.startDate}
                    onChange={handleEmploymentChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ໄລຍະເວລາສັນຍາ (ເດືອນ)</FormLabel>
                  <Input
                    type="number"
                    name="contractDuration"
                    value={employmentInfo.contractDuration}
                    onChange={handleEmploymentChange}
                    placeholder="ໄລຍະສັນຍາ"
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              mt={4}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>ເວລາເລີ່ມວຽກ</FormLabel>
                  <Input
                    type="time"
                    name="workStartTime"
                    value={employmentInfo.workStartTime}
                    onChange={handleEmploymentChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ເວລາເລີກວຽກ</FormLabel>
                  <Input
                    type="time"
                    name="workEndTime"
                    value={employmentInfo.workEndTime}
                    onChange={handleEmploymentChange}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ສະຖານທີ່ເຮັດວຽກ</FormLabel>
                  <Input
                    name="workplace"
                    value={employmentInfo.workplace}
                    onChange={handleEmploymentChange}
                    placeholder="ສະຖານທີ່ເຮັດວຽກ"
                  />
                </FormControl>
              </GridItem>
            </Grid>

            <Box mt={4}>
              <FormControl>
                <FormLabel>ສັນຍາການຈ້າງງານ</FormLabel>
                {employmentInfo.contractFilePreview && (
                  <Image
                    src={employmentInfo.contractFilePreview}
                    alt="Contract Preview"
                    maxH="150px"
                    mb={2}
                  />
                )}
                <Input
                  type="file"
                  name="contractFile"
                  onChange={handleEmploymentChange}
                  accept="image/*,application/pdf"
                />
              </FormControl>
            </Box>
          </Box>

          {/* Salary and Benefits Section */}
          <Box mt={8}>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ເງິນເດືອນ ແລະ ຜົນປະໂຫຍດ
            </Heading>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>ເງິນເດືອນພື້ນຖານ (LAK)</FormLabel>
                  <Input
                    type="number"
                    name="baseSalary"
                    value={salaryInfo.baseSalary}
                    onChange={handleSalaryChange}
                    placeholder="ເງິນເດືອນ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ອັດຕາຊົ່ວໂມງລ່ວງເວລາ</FormLabel>
                  <Input
                    type="number"
                    name="overtimeRate"
                    value={salaryInfo.overtimeRate}
                    onChange={handleSalaryChange}
                    placeholder="ອັດຕາຊົ່ວໂມງລ່ວງເວລາ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ປະເພດຄ່າຄອມມິຊັນ</FormLabel>
                  <Select
                    name="commissionType"
                    value={salaryInfo.commissionType}
                    onChange={handleSalaryChange}
                    placeholder="-- ເລືອກ --"
                  >
                    <option value="ບໍ່ມີ">ບໍ່ມີ</option>
                    <option value="ອັດຕາເປີເຊັນ">ອັດຕາເປີເຊັນ</option>
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              mt={4}
            >
              <GridItem>
                <FormControl>
                  <FormLabel>ອັດຕາໄດ້</FormLabel>
                  <Input
                    type="number"
                    name="commissionRate"
                    value={salaryInfo.commissionRate}
                    onChange={handleSalaryChange}
                    placeholder="ອັດຕາຄ່າຄອມມິຊັນ"
                    isDisabled={salaryInfo.commissionType === "ບໍ່ມີ"}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ວັນພັກປະຈຳປີ (ວັນ)</FormLabel>
                  <Input
                    type="number"
                    name="annualHolidays"
                    value={salaryInfo.annualHolidays}
                    onChange={handleSalaryChange}
                    placeholder="ຈຳນວນວັນພັກ"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>

          {/* Social Security Section */}
          <Box mt={8}>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ປະກັນສັງຄົມ
            </Heading>
            {socialSecurity.length > 0 ? (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th fontFamily="Noto Sans Lao, serif">ປະເພດປະກັນສັງຄົມ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ອັດຕາຫັກປະກັນ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ສະຖານທີ່ລົງທະບຽນ</Th>
                    <Th fontFamily="Noto Sans Lao, serif">ວັນລົງທະບຽນ</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {socialSecurity.map((security, index) => (
                    <Tr key={index}>
                      <Td>
                        <Select
                          value={security.type || ""}
                          onChange={(e) =>
                            handleSocialSecurityChange(
                              index,
                              "type",
                              e.target.value
                            )
                          }
                          placeholder="-- ເລືອກ --"
                        >
                          <option value={security.type}>{security.type}</option>
                        </Select>
                      </Td>
                      <Td>
                        <Input
                          value={security.rate || ""}
                          onChange={(e) =>
                            handleSocialSecurityChange(
                              index,
                              "rate",
                              e.target.value
                            )
                          }
                          placeholder="ອັດຕາຫັກ %"
                        />
                      </Td>
                      <Td>
                        <Input
                          value={security.registrationPlace || ""}
                          onChange={(e) =>
                            handleSocialSecurityChange(
                              index,
                              "registrationPlace",
                              e.target.value
                            )
                          }
                          placeholder="ສະຖານທີ່ລົງທະບຽນ"
                        />
                      </Td>
                      <Td>
                        <Input
                          type="date"
                          value={security.registrationDate || ""}
                          onChange={(e) =>
                            handleSocialSecurityChange(
                              index,
                              "registrationDate",
                              e.target.value
                            )
                          }
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text color="gray.500">ບໍ່ມີຂໍ້ມູນປະກັນສັງຄົມ</Text>
            )}
          </Box>

          {/* Submit Button */}
          <Flex justify="center" mt={10}>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="ກຳລັງບັນທຶກ..."
            >
              ບັນທຶກຂໍ້ມູນພະນັກງານ
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
};

export default RegisterEmployee;
