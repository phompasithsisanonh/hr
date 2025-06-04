import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
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
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  DataEmplyee,
  editEmployee,
  getDepartment,
  getIdEmlyee,
  messageClear,
} from "../store/Reducer/HRReducer/InformationEmplyee";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const EditDocEmlyee = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("white", "gray.700");
  const {
    getdatabase,
    loading,
    getIdEmlyries,
    successMessage,
    errorMessage,
    //drop
    getDepartmentries,
  } = useSelector((state) => state.information);
  const get = getdatabase[0];
  const navigate = useNavigate();
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/hr/all-employees");
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [navigate, successMessage, errorMessage, dispatch]);
  // Flag เพื่อตรวจสอบว่าโหลดข้อมูลครั้งแรก
  const isInitialLoad = useRef(true);
  // Utility to format MongoDB dates
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  // Form states
  const [imagePreviews, setImagePreviews] = useState({
    profileImage: null,
    idCardImage: null,
  });
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
    profileImage: null,
    idCardImage: null,
  });
  const [educationHistory, setEducationHistory] = useState([]);
  const [newEducation, setNewEducation] = useState({
    level: "",
    major: "",
    university: "",
    country: "",
    graduationYear: "",
    gpa: "",
    certificate: null,
    certificatePreview: null,
  });
  const [workExperience, setWorkExperience] = useState([]);
  const [newWork, setNewWork] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    referenceFile: null,
    referenceFilePreview: null,
  });
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
  const [department, setDepartment] = useState({});
  const [position, setPosition] = useState({});
  const filterPosition = get?.department?.find(
    (i) => i?.type === department?.type
  );

  const [salaryInfo, setSalaryInfo] = useState({
    baseSalary: "",
    overtimeRate: "",
    commissionType: "",
    commissionRate: "",
    annualHolidays: "",
  });
  const [socialSecurity, setSocialSecurity] = useState([
    { type: "", rate: "", registrationPlace: "", registrationDate: "" },
  ]);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    dispatch(DataEmplyee());
    dispatch(getIdEmlyee(id));
    dispatch(getDepartment());
  }, [dispatch, id]);
  // Initialize data from getIdEmlyries and getdatabase
  useEffect(() => {
    // Update states when getIdEmlyries is available
    if (getIdEmlyries && getIdEmlyries && isInitialLoad.current) {
      setPersonalInfo({
        fullName: getIdEmlyries?.personalInfo?.fullName || "",
        dob: formatDate(getIdEmlyries?.personalInfo?.dob) || "",
        gender: getIdEmlyries?.personalInfo?.gender || "",
        ethnicity: getIdEmlyries?.personalInfo?.ethnicity || "",
        nationality: getIdEmlyries?.personalInfo?.nationality || "",
        religion: getIdEmlyries?.personalInfo?.religion || "",
        village: getIdEmlyries?.personalInfo?.village || "",
        district: getIdEmlyries?.personalInfo?.district || "",
        maritalStatus: getIdEmlyries?.personalInfo?.maritalStatus || "",
        phone: getIdEmlyries?.personalInfo?.phone || "",
        address: getIdEmlyries?.personalInfo?.address || "",
        documentType: getIdEmlyries?.personalInfo?.documentType || "",
        issueDate: formatDate(getIdEmlyries?.personalInfo?.issueDate) || "",
        expiryDate: formatDate(getIdEmlyries?.personalInfo?.expiryDate) || "",
        documentNumber: getIdEmlyries?.personalInfo?.documentNumber || "",
        profileImage: null,
        idCardImage: null,
      });
      setImagePreviews({
        profileImage: getIdEmlyries?.personalInfo?.profileImage || null,
        idCardImage: getIdEmlyries?.personalInfo?.idCardImage || null,
      });
      setEducationHistory(
        getIdEmlyries?.educationHistory?.map((edu) => ({
          ...edu,
          graduationYear: edu.graduationYear?.toString() || "",
          gpa: edu.gpa?.toString() || "",
          certificatePreview: edu.certificate || null,
        })) || []
      );
      setWorkExperience(
        getIdEmlyries?.workExperience?.map((work) => ({
          ...work,
          startDate: formatDate(work.startDate) || "",
          endDate: formatDate(work.endDate) || "",
          referenceFilePreview: work.referenceFile || null,
        })) || []
      );
      setEmploymentInfo({
        probationPeriod:
          getIdEmlyries?.employmentInfo?.probationPeriod?.toString() || "",
        contractType: getIdEmlyries?.employmentInfo?.contractType || "",
        startDate: formatDate(getIdEmlyries?.employmentInfo?.startDate) || "",
        contractDuration:
          getIdEmlyries?.employmentInfo?.contractDuration?.toString() || "",
        workStartTime: getIdEmlyries?.employmentInfo?.workStartTime || "",
        workEndTime: getIdEmlyries?.employmentInfo?.workEndTime || "",
        workplace: getIdEmlyries?.employmentInfo?.workplace || "",
        contractFile: null,
        contractFilePreview:
          getIdEmlyries?.employmentInfo?.contractFile || null,
      });
      setSalaryInfo({
        baseSalary: getIdEmlyries?.salaryInfo?.baseSalary?.toString() || "",
        overtimeRate: getIdEmlyries?.salaryInfo?.overtimeRate?.toString() || "",
        commissionType: getIdEmlyries?.salaryInfo?.commissionType || "",
        commissionRate:
          getIdEmlyries?.salaryInfo?.commissionRate?.toString() || "",
        annualHolidays:
          getIdEmlyries?.salaryInfo?.annualHolidays?.toString() || "",
      });
      setSocialSecurity(
        getIdEmlyries?.socialSecurity?.map((security) => ({
          ...security,
          registrationDate: formatDate(security.registrationDate) || "",
        })) || [
          { type: "", rate: "", registrationPlace: "", registrationDate: "" },
        ]
      );
    } else {
      isInitialLoad.current = false; // ปิด flag หลังโหลดครั้งแรก
    }

    // Update salary defaults from getdatabase
    if (getdatabase?.length > 0 && isInitialLoad.current) {
      const get = getdatabase[0];
      setSalaryInfo((prev) => ({
        ...prev,
        overtimeRate: get?.otTohour?.toString() || prev.overtimeRate,
        annualHolidays:
          get?.setAnnualHolidays?.toString() || prev.annualHolidays,
      }));
    } else {
      isInitialLoad.current = false; // ปิด flag หลังโหลดครั้งแรก
    }
  }, [dispatch, getdatabase, getIdEmlyries]);

  // Validation functions
  const validatePersonalInfo = useCallback(() => {
    const newErrors = {};
    if (!personalInfo.fullName)
      newErrors.fullName = "ກະລຸນາປ້ອນຊື່ ແລະ ນາມສະກຸນ";
    if (!personalInfo.dob) newErrors.dob = "ກະລຸນາປ້ອນວັນເດືອນປີເກີດ";
    if (personalInfo.phone && !/^\d{8,}$/.test(personalInfo.phone)) {
      newErrors.phone = "ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ";
    }
    return newErrors;
  }, [personalInfo]);

  const validateEducation = useCallback((education) => {
    const newErrors = {};
    if (!education.level) newErrors.level = "ກະລຸນາປ້ອນລະດັບການສຶກສາ";
    if (!education.major) newErrors.major = "ກະລຸນາປ້ອນສາຂາວິຊາຮຽນ";
    if (!education.university) newErrors.university = "ກະລຸນາປ້ອນມະຫາວິທະຍາໄລ";
    return newErrors;
  }, []);

  const validateWork = useCallback((work) => {
    const newErrors = {};
    if (!work.company) newErrors.company = "ກະລຸນາປ້ອນຊື່ບໍລິສັດ";
    if (!work.position) newErrors.position = "ກະລຸນາປ້ອນຕຳແໜ່ງ";
    return newErrors;
  }, []);

  // File handling with size validation
  const handleFileUpload = useCallback((file, maxSizeMB = 5) => {
    if (file && file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: `ໄຟລ໌ມີຂະໜາດໃຫຍ່ເກີນ ${maxSizeMB}MB`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return null;
    }
    return file;
  }, []);

  // Handlers
  const handlePersonalInfoChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;
      setPersonalInfo((prev) => ({
        ...prev,
        [name]: files ? handleFileUpload(files[0]) : value,
      }));

      if (files && files[0]) {
        const file = handleFileUpload(files[0]);
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
      }
    },
    [handleFileUpload]
  );

  const handleEducationChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;
      setNewEducation((prev) => ({
        ...prev,
        [name]: files ? handleFileUpload(files[0]) : value,
        ...(files && {
          certificatePreview: files[0] ? URL.createObjectURL(files[0]) : null,
        }),
      }));
    },
    [handleFileUpload]
  );

  const handleWorkChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;
      setNewWork((prev) => ({
        ...prev,
        [name]: files ? handleFileUpload(files[0]) : value,
        ...(files && {
          referenceFilePreview: files[0] ? URL.createObjectURL(files[0]) : null,
        }),
      }));
    },
    [handleFileUpload]
  );
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
  const handleEmploymentChange = useCallback(
    (e) => {
      const { name, value, files } = e.target;

      // ถ้าเปลี่ยนตำแหน่ง
      // if (name === "position") {
      //   const selectedPosition = filterPosition.position.find(
      //     (p) => p._id === value
      //   );
      //   setEmploymentInfo((prev) => ({
      //     ...prev,
      //     [name]: selectedPosition,
      //   }));
      // }
      //    if (name === "department") {
      //   const selectedDepartment = get?.department?.find(
      //     (d) => d.type === value
      //   );
      //   setEmploymentInfo((prev) => ({
      //     ...prev,
      //     [name]: selectedDepartment,
      //   }));
      // }
      // ถ้าเปลี่ยนไฟล์
      if (files) {
        setEmploymentInfo((prev) => ({
          ...prev,
          [name]: handleFileUpload(files[0]),
          contractFilePreview: files[0] ? URL.createObjectURL(files[0]) : null,
        }));
      }
      // อย่างอื่น (string ปกติ)
      else {
        setEmploymentInfo((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    [handleFileUpload]
  );

  const handleSalaryChange = useCallback((e) => {
    const { name, value } = e.target;
    setSalaryInfo((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSocialSecurityChange = useCallback((index, field, value) => {
    setSocialSecurity((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }, []);

  const handleRemoveSocialSecurity = useCallback(
    (index) => {
      if (socialSecurity.length > 1) {
        setSocialSecurity((prev) => prev.filter((_, i) => i !== index));
      } else {
        toast({
          title: "ບໍ່ສາມາດລຶບໄດ້",
          description: "ຕ້ອງມີຢ່າງໜ້ອຍໜຶ່ງລາຍການ",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [socialSecurity.length]
  );

  const handleAddEducation = useCallback(() => {
    const educationErrors = validateEducation(newEducation);
    if (Object.keys(educationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...educationErrors }));
      toast({
        title: "ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຈຳເປັນ",
        description: "ກະລຸນາປ້ອນລະດັບການສຶກສາ, ສາຂາວິຊາຮຽນ, ແລະ ມະຫາວິທະຍາໄລ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setEducationHistory((prev) => [...prev, { ...newEducation }]);
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
    setErrors((prev) => ({ ...prev, level: "", major: "", university: "" }));
  }, [newEducation, validateEducation]);

  const handleRemoveEducation = useCallback((index) => {
    setEducationHistory((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddWork = useCallback(() => {
    const workErrors = validateWork(newWork);
    if (Object.keys(workErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...workErrors }));
      toast({
        title: "ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຈຳເປັນ",
        description: "ກະລຸນາປ້ອນຊື່ບໍລິສັດ ແລະ ຕຳແໜ່ງ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setWorkExperience((prev) => [...prev, { ...newWork }]);
    setNewWork({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      referenceFile: null,
      referenceFilePreview: null,
    });
    setErrors((prev) => ({ ...prev, company: "", position: "" }));
  }, [newWork, validateWork]);

  const handleRemoveWork = useCallback((index) => {
    setWorkExperience((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const prepareFormData = useCallback(() => {
    const formData = new FormData();
    const appendIfValid = (key, value, prefix = "") => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(prefix ? `${prefix}[${key}]` : key, value);
      }
    };

    // Personal Info
    Object.entries(personalInfo).forEach(([key, value]) =>
      appendIfValid(key, value, "personalInfo")
    );
    //
    Object.entries(department).forEach(([key, value]) =>
      appendIfValid(key, value, "department")
    );
    //
    Object.entries(position).forEach(([key, value]) =>
      appendIfValid(key, value, "position")
    );
    // Education History
    educationHistory.forEach((edu, index) => {
      Object.entries(edu).forEach(([key, value]) => {
        if (key !== "certificatePreview")
          appendIfValid(key, value, `educationHistory[${index}]`);
      });
    });
    // Work Experience
    workExperience.forEach((work, index) => {
      Object.entries(work).forEach(([key, value]) => {
        if (key !== "referenceFilePreview")
          appendIfValid(key, value, `workExperience[${index}]`);
      });
    });
    // Employment Info
    Object.entries(employmentInfo).forEach(([key, value]) => {
      if (key !== "contractFilePreview")
        appendIfValid(key, value, "employmentInfo");
    });
    // Salary Info
    Object.entries(salaryInfo).forEach(([key, value]) =>
      appendIfValid(key, value, "salaryInfo")
    );
    // Social Security
    socialSecurity.forEach((security, index) => {
      Object.entries(security).forEach(([key, value]) =>
        appendIfValid(key, value, `socialSecurity[${index}]`)
      );
    });

    console.log("FormData:", Array.from(formData.entries()));
    return formData;
  }, [
    personalInfo,
    educationHistory,
    workExperience,
    employmentInfo,
    salaryInfo,
    socialSecurity,
    department,
    position,
  ]);

  const handleSubmit = useCallback(() => {
    const personalErrors = validatePersonalInfo();
    if (Object.keys(personalErrors).length > 0) {
      setErrors(personalErrors);
      toast({
        title: "ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຈຳເປັນ",
        description: "ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຕ້ອງການທັງໝົດ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = prepareFormData();
    dispatch(
      editEmployee({
        id: id,
        formData: formData,
      })
    );
  }, [dispatch, prepareFormData, validatePersonalInfo, id]);

  // Memoized options
  const genderOptions = useMemo(
    () => [
      { value: "ຊາຍ", label: "ຊາຍ" },
      { value: "ຍິງ", label: "ຍິງ" },
      { value: "ອື່ນໆ", label: "ອື່ນໆ" },
    ],
    []
  );

  const maritalStatusOptions = useMemo(
    () => [
      { value: "ໂສດ", label: "ໂສດ" },
      { value: "ແຕ່ງງານ", label: "ແຕ່ງງານ" },
      { value: "ແມ່ຮ້າງ", label: "ແມ່ຮ້າງ" },
      { value: "ໝ້າຍ", label: "ໝ້າຍ" },
    ],
    []
  );

  const educationLevelOptions = useMemo(
    () => [
      { value: "ຊັ້ນສູງ", label: "ຊັ້ນສູງ" },
      { value: "ປະລິນຍາຕີ", label: "ປະລິນຍາຕີ" },
      { value: "ປະລິນຍາໂທ", label: "ປະລິນຍາໂທ" },
      { value: "ປະລິນຍາເອກ", label: "ປະລິນຍາເອກ" },
    ],
    []
  );

  const contractTypeOptions = useMemo(
    () => [
      { value: "ສັນຍາມີກຳນົດ", label: "ສັນຍາມີກຳນົດ" },
      { value: "ສັນຍາບໍ່ມີກຳນົດ", label: "ສັນຍາບໍ່ມີກຳນົດ" },
      { value: "ຈ້າງຊົ່ວຄາວ", label: "ຈ້າງຊົ່ວຄາວ" },
    ],
    []
  );

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
          <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
            ຂໍ້ມູນເອກະສານປະຈຳໂຕ
          </Heading>

          {/* Personal Information */}
          <Box>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ຂໍ້ມູນສ່ວນໂຕ
            </Heading>
            <Box mb={6}>
              <FormControl isInvalid={errors.profileImage}>
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
                    aria-label="ອັບໂຫຼດຮູບໂປຣຟາຍ"
                  />
                </Flex>
                <FormErrorMessage>{errors.profileImage}</FormErrorMessage>
              </FormControl>
            </Box>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl isRequired isInvalid={errors.fullName}>
                  <FormLabel>ຊື່ ແລະ ນາມສະກຸນ</FormLabel>
                  <Input
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                    placeholder="ຊື່ ແລະ ນາມສະກຸນ"
                    aria-label="ຊື່ ແລະ ນາມສະກຸນ"
                    isDisabled={false} // ตรวจสอบว่าไม่ได้ตั้งค่าเป็น true
                    readOnly={false} // ตรวจสอบว่าไม่ได้ตั้งค่าเป็น true
                  />
                  <FormErrorMessage>{errors.fullName}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired isInvalid={errors.dob}>
                  <FormLabel>ວັນເດືອນປີເກີດ</FormLabel>
                  <Input
                    type="date"
                    name="dob"
                    value={personalInfo.dob}
                    onChange={handlePersonalInfoChange}
                    aria-label="ວັນເດືອນປີເກີດ"
                  />
                  <FormErrorMessage>{errors.dob}</FormErrorMessage>
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
                    aria-label="ເລືອກເພດ"
                  >
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>

          {/* Secondary Information */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>ຊົນເຜົ່າ</FormLabel>
                <Input
                  name="ethnicity"
                  value={personalInfo.ethnicity}
                  onChange={handlePersonalInfoChange}
                  placeholder="ຊົນເຜົ່າ"
                  aria-label="ຊົນເຜົ່າ"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>ສັນຊາດ</FormLabel>
                <Input
                  name="nationality"
                  value={personalInfo.nationality}
                  onChange={handlePersonalInfoChange}
                  placeholder="ສັນຊາດ"
                  aria-label="ສັນຊາດ"
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
                  aria-label="ສາດສະໜາ"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Address Information */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>ບ້ານ</FormLabel>
                <Input
                  name="village"
                  value={personalInfo.village}
                  onChange={handlePersonalInfoChange}
                  placeholder="ບ້ານ"
                  aria-label="ບ້ານ"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>ເມືອງ</FormLabel>
                <Select
                  name="district"
                  value={personalInfo.district}
                  onChange={handlePersonalInfoChange}
                  placeholder="-- ເລືອກ --"
                  aria-label="ເລືອກເມືອງ"
                >
                  {/* Add dynamic districts here */}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>ທີ່ຢູ່ປັດຈຸບັນ</FormLabel>
                <Input
                  name="address"
                  value={personalInfo.address}
                  onChange={handlePersonalInfoChange}
                  placeholder="ບ້ານ, ເມືອງ, ແຂວງ"
                  aria-label="ທີ່ຢູ່ປັດຈຸບັນ"
                />
              </FormControl>
            </GridItem>
          </Grid>

          {/* Family Information */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>ສະຖານະພາບ</FormLabel>
                <Select
                  name="maritalStatus"
                  value={personalInfo.maritalStatus}
                  onChange={handlePersonalInfoChange}
                  placeholder="-- ເລືອກ --"
                  aria-label="ເລືອກສະຖານະພາບ"
                >
                  {maritalStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={errors.phone}>
                <FormLabel>ເບີໂທລະສັບ</FormLabel>
                <Input
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  placeholder="020..."
                  aria-label="ເບີໂທລະສັບ"
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>

          {/* Document Information */}
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
                  <FormLabel>ປະເພດເອກະສານ</FormLabel>
                  <Select
                    name="documentType"
                    value={personalInfo.documentType}
                    onChange={handlePersonalInfoChange}
                    placeholder="-- ເລືອກ --"
                    aria-label="ເລືອກປະເພດເອກະສານ"
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
                    aria-label="ວັນອອກບັດ"
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
                    aria-label="ວັນໝົດອາຍຸ"
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
                    aria-label="ເລກທີ່ບັດ"
                  />
                </FormControl>
              </GridItem>
              <GridItem colSpan={4}>
                <FormControl>
                  <FormLabel>ຮູບພາບເອກະສານ</FormLabel>
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
                    aria-label="ອັບໂຫຼດຮູບພາບເອກະສານ"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>

          {/* Education Information */}
          <Box>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ປະຫວັດການສຶກສາ
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl isRequired isInvalid={errors.level}>
                  <FormLabel>ລະດັບການສຶກສາ</FormLabel>
                  <Select
                    name="level"
                    value={newEducation.level}
                    onChange={handleEducationChange}
                    placeholder="-- ເລືອກ --"
                    aria-label="ເລືອກລະດັບການສຶກສາ"
                  >
                    {educationLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.level}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired isInvalid={errors.major}>
                  <FormLabel>ສາຂາວິຊາຮຽນ</FormLabel>
                  <Input
                    name="major"
                    value={newEducation.major}
                    onChange={handleEducationChange}
                    placeholder="ສາຂາວິຊາຮຽນ"
                    aria-label="ສາຂາວິຊາຮຽນ"
                  />
                  <FormErrorMessage>{errors.major}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired isInvalid={errors.university}>
                  <FormLabel>ມະຫາວິທະຍາໄລ</FormLabel>
                  <Input
                    name="university"
                    value={newEducation.university}
                    onChange={handleEducationChange}
                    placeholder="ມະຫາວິທະຍາໄລ"
                    aria-label="ມະຫາວິທະຍາໄລ"
                  />
                  <FormErrorMessage>{errors.university}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ປະເທດ</FormLabel>
                  <Input
                    name="country"
                    value={newEducation.country}
                    onChange={handleEducationChange}
                    placeholder="ປະເທດ"
                    aria-label="ປະເທດ"
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
                    aria-label="ປີຈົບການສຶກສາ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ຄະແນນສະເລ່ຍ</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    name="gpa"
                    value={newEducation.gpa}
                    onChange={handleEducationChange}
                    placeholder="ຄະແນນ"
                    aria-label="ຄະແນນສະເລ່ຍ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ໃບຢັ້ງຢືນ</FormLabel>
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
                    aria-label="ອັບໂຫຼດໃບຢັ້ງຢືນ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="red"
                  onClick={handleAddEducation}
                  w="full"
                  aria-label="ເພີ່ມປະຫວັດການສຶກສາ"
                >
                  ເພີ່ມ
                </Button>
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
                      <Th fontFamily="Noto Sans Lao, serif"> ລະດັບ</Th>
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
                            aria-label="ລຶບປະຫວັດການສຶກສາ"
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

          {/* Work Experience */}
          <Box>
            <Heading fontFamily="Noto Sans Lao, serif" size="sm" mb={4}>
              ປະຫວັດການເຮັດວຽກ
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
            >
              <GridItem>
                <FormControl isRequired isInvalid={errors.company}>
                  <FormLabel>ຊື່ບໍລິສັດ</FormLabel>
                  <Input
                    name="company"
                    value={newWork.company}
                    onChange={handleWorkChange}
                    placeholder="ຊື່ບໍລິສັດ"
                    aria-label="ຊື່ບໍລິສັດ"
                  />
                  <FormErrorMessage>{errors.company}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired isInvalid={errors.position}>
                  <FormLabel>ຕຳແໜ່ງ</FormLabel>
                  <Input
                    name="position"
                    value={newWork.position}
                    onChange={handleWorkChange}
                    placeholder="ຕຳແໜ່ງ"
                    aria-label="ຕຳແໜ່ງ"
                  />
                  <FormErrorMessage>{errors.position}</FormErrorMessage>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ວັນເລີ່ມ</FormLabel>
                  <Input
                    type="date"
                    name="startDate"
                    value={newWork.startDate}
                    onChange={handleWorkChange}
                    aria-label="ວັນເລີ່ມທຳງານ"
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
                  <FormLabel>ວັນສິ້ນສຸດ</FormLabel>
                  <Input
                    type="date"
                    name="endDate"
                    value={newWork.endDate}
                    onChange={handleWorkChange}
                    aria-label="ວັນສິ້ນສຸດທຳງານ"
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
                    aria-label="ອັບໂຫຼດເອກະສານອ້າງອີງ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="red"
                  onClick={handleAddWork}
                  w="full"
                  aria-label="ເພີ່ມປະຫວັດການເຮັດວຽກ"
                >
                  ເພີ່ມ
                </Button>
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
                      <Th fontFamily="Noto Sans Lao, serif">ວັນເລີ່ມ</Th>
                      <Th fontFamily="Noto Sans Lao, serif">ວັນສິ້ນສຸດ</Th>
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
                            aria-label="ລຶບປະຫວັດການເຮັດວຽກ"
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

          {/* Employment Information */}
          <Box>
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
                    aria-label="ເລືອກພະແນກ"
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
                      <option key={index} value={items._id}>
                        {items?.type}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ໄລຯະທົດລອງງານ (ເດືອນ)</FormLabel>
                  <Input
                    type="number"
                    name="probationPeriod"
                    value={employmentInfo.probationPeriod}
                    onChange={handleEmploymentChange}
                    placeholder="ໄລຯະທົດລອງ"
                    aria-label="ໄລຯະທົດລອງງານ"
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
                    aria-label="ເລືອກປະເພດສັນຍາ"
                  >
                    {contractTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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
                    aria-label="ວັນເລີ່ມສັນຍາ"
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel>ໄລຯະເວລາສັນຍາ (ເດືອນ)</FormLabel>
                  <Input
                    type="number"
                    name="contractDuration"
                    value={employmentInfo.contractDuration}
                    onChange={handleEmploymentChange}
                    placeholder="ໄລຯະສັນຍາ"
                    aria-label="ໄລຯະເວລາສັນຍາ"
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
                    aria-label="ເວລາເລີ່ມວຽກ"
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
                    aria-label="ເວລາເລີກວຽກ"
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
                    aria-label="ສະຖານທີ່ເຮັດວຽກ"
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
                  aria-label="ອັບໂຫຼດສັນຍາການຈ້າງງານ"
                />
              </FormControl>
            </Box>
          </Box>

          {/* Salary and Benefits */}
          <Box>
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
                    aria-label="ເງິນເດືອນພື້ນຖານ"
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
                    placeholder="ອັດຕາຊົ່ວໂຮັດລ່ວງເວລາ"
                    aria-label="ອັດຕາຊົ່ວໂມງລ່ວງເວລາ"
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
                    aria-label="ເລືອກປະເພດຄ່າຄອມມິຊັນ"
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
                  <FormLabel>ອັດຕາຄ່າຄອມມິຊັນ</FormLabel>
                  <Input
                    type="number"
                    name="commissionRate"
                    value={salaryInfo.commissionRate}
                    onChange={handleSalaryChange}
                    placeholder="ອັດຕາຄ່າຄອມມິຊັນ"
                    isDisabled={salaryInfo.commissionType === "ບໍ່ມີ"}
                    aria-label="ອັດຕາຄ່າຄອມມິຊັນ"
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
                    aria-label="ວັນພັກປະຈຳປີ"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>

          {/* Social Security */}
          <Box>
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
                    <Th fontFamily="Noto Sans Lao, serif" width="80px">
                      ຈັດການ
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {socialSecurity.map((security, index) => (
                    <Tr key={index}>
                      <Td>
                        <Input
                          placeholder="ປະເພດປະກັນສັງຄົມ"
                          value={security.type}
                          onChange={(e) =>
                            handleSocialSecurityChange(
                              index,
                              "type",
                              e.target.value
                            )
                          }
                        />
                      </Td>
                      <Td>
                        <Input
                          type="number"
                          step="0.01"
                          value={security.rate}
                          onChange={(e) =>
                            handleSocialSecurityChange(
                              index,
                              "rate",
                              e.target.value
                            )
                          }
                          placeholder="ອັດຕາຫັກ %"
                          aria-label="ອັດຕາຫັກປະກັນສັງຄົມ"
                        />
                      </Td>
                      <Td>
                        <Input
                          value={security.registrationPlace}
                          onChange={(e) =>
                            handleSocialSecurityChange(
                              index,
                              "registrationPlace",
                              e.target.value
                            )
                          }
                          placeholder="ສະຖານທີ່ລົງທະບຽນ"
                          aria-label="ສະຖານທີ່ລົງທະບຽນປະກັນສັງຄົມ"
                        />
                      </Td>
                      <Td>
                        <Input
                          type="date"
                          value={security.registrationDate}
                          onChange={(e) =>
                            handleSocialSecurityChange(
                              index,
                              "registrationDate",
                              e.target.value
                            )
                          }
                          aria-label="ວັນລົງທະບຽນປະກັນສັງຄົມ"
                        />
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="ລຶບປະກັນສັງຄົມ"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleRemoveSocialSecurity(index)}
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
              aria-label="ບັນທຶກຂໍ້ມູນພະນັກງານ"
            >
              ບັນທຶກຂໍ້ມູນພະນັກງານ
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Container>
  );
};

EditDocEmlyee.propTypes = {
  id: PropTypes.string,
};

export default EditDocEmlyee;
