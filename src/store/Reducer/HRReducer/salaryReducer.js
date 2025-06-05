import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../API/api";
///addfileInOutWork
export const addfileInOutWork = createAsyncThunk(
  "salary/addfileInOutWork",
  async ({ file }, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log("FormData ที่จะส่ง:", file); // Log FormData เพื่อตรวจสอบ
      const { data } = await api.post(
        `/informationEmplyee/InAndout`,
        file, // ส่ง FormData โดยตรงเป็น data
        {
          headers: {
            // ไม่ต้องตั้งค่า Content-Type เองเมื่อส่ง FormData
          },
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//getAllfileOt

export const getAllot = createAsyncThunk(
  "salary/getAllot",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/informationEmplyee/getAllot`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
///addDataFormData
//getAllfileOt

export const addFormData = createAsyncThunk(
  "salary/addFormData",
  async (
    { emplyeebarCode, inTime, outTime, fullName, filtercheckIdcode, date },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.post(
        `/informationEmplyee/addFormData`,
        {
          emplyeebarCode,
          fullName,
          filtercheckIdcode,
          date,
          inTime,
          outTime,
        },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//addDataSalary
export const addDataSalary = createAsyncThunk(
  "salary/addDataSalary",
  async (item, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(item);
      const { data } = await api.post(
        `/informationEmplyee/addDataAlreadySalary`,
        {
          emplyeecode: item.emplyeecode,
          calculateTimeLateHour: item.calculateTimeLateHour,
          calculateTimeLateMinute: item.calculateTimeLateMinute,
          calculateTimeOThour: item.calculateTimeOThour,
          calculateTimeOTminute: item.calculateTimeOTminute,
          incomeNet: item.incomeNet,
          date: item.date,
          month: item.month,
          year: item.year,
          salaryfirst: item.salaryfirst,
          baseSalary: item.salaryInfo.baseSalary,
          socialSecurity: item.socialSecurity,
          personalInfo: item.personalInfo,
          otId: item.id,
          bennifits: item?.bennifits,
        },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//getAllSalary

export const getAllSalary = createAsyncThunk(
  "salary/getAllSalary",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/informationEmplyee/getAllDataSalary`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//saveTax
export const getTax = createAsyncThunk(
  "salary/getTax",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/informationEmplyee/getTax`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//getTax
export const saveTax = createAsyncThunk(
  "salary/saveTax",
  async (incomes, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log("FormData ที่จะส่ง:", incomes); // Log FormData เพื่อตรวจสอบ
      const { data } = await api.post(
        `/informationEmplyee/saveTax`,
        {
          incomes: incomes,
        },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//editTax
export const deleteTax = createAsyncThunk(
  "salary/deleteTax",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/informationEmplyee/deleteTax/${id}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//delete tax
export const updateTax = createAsyncThunk(
  "salary/updateTax",
  async (formData, { rejectWithValue, fulfillWithValue }) => {
    try {
      console.log(formData);
      const { data } = await api.post(
        `/informationEmplyee/editTax`,
        {
          id: formData.id,
          minAmount: formData.minAmount,
          maxAmount: formData.maxAmount,
          rate: formData.rate,
        },
        {
          withCredentials: true,
        }
      );
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

//cardsummary
export const cardsummary = createAsyncThunk(
  "salary/cardsummary",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/informationEmplyee/cardsummary`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
///postsalary
export const postsalary = createAsyncThunk(
  "salary/postsalary",
  async (salaryData, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/informationEmplyee/receiptsalary`,
        {
          employeeCode: salaryData?.employeeCode,
          personalInfo: salaryData?.personalInfo,
          date: salaryData?.date,
          basicSalary: salaryData?.basicSalary,
          salaryFirst: salaryData?.salaryFirst,
          socialSecurity: salaryData?.socialSecurity,
          socialSecurityMoney: salaryData?.socialSecurityMoney,
          tax: salaryData?.tax,
          netExpense: salaryData?.netExpense,
          netIncome: salaryData?.netIncome,
          netSalary: salaryData?.netSalary,
          incomeItems: salaryData?.incomeItems,
          expenseItems: salaryData?.expenseItems,
          taxBracket: salaryData?.taxBracket,
          year: salaryData?.year,
          month: salaryData?.month,
          NetBennifits: salaryData?.NetBennifits,
          totalTimeLate: salaryData?.totalTimeLate,
          totalTimeOt: salaryData?.totalTimeOt,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//getSalary
export const getSalary = createAsyncThunk(
  "salary/getSalary",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/informationEmplyee/getSalary`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//CancelCardSummary
export const CancelCardSummary = createAsyncThunk(
  "salary/cancelCardSummary",
  async ({ id }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/informationEmplyee/CancelCardSummary/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
// addFormDataEdit
export const addFormDataEdit = createAsyncThunk(
  "salary/addFormDataEdit",
  async (
    { id, emplyeebarCode, fullName, filtercheckIdcode, date, inTime, outTime },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.patch(
        `/informationEmplyee/addFormDataEdit/${id}`,
        {
          emplyeebarCode: emplyeebarCode,
          fullName: fullName,
          filtercheckIdcode: filtercheckIdcode,
          date: date,
          inTime: inTime,
          outTime: outTime,
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
//deletefinnally
export const deletesalarycalu = createAsyncThunk(
  "salary/deletesalarycalu ",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(
        `/informationEmplyee/deletesalarycalu/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log("Error response:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
export const salaryReducer = createSlice({
  name: "salary",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: true,
    dataOt: [],
    getAllSalaries: [],
    getTaxeis: [],
    cardsummaries: [],
    getSalaries: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addfileInOutWork.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(addfileInOutWork.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(addfileInOutWork.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      //dataot
      .addCase(getAllot.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.dataOt = payload?.data || []; // แก้ไขให้ใช้ payload?.data
      })
      //addDataSalary
      .addCase(addDataSalary.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(addDataSalary.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(addDataSalary.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      //getAllSalary
      .addCase(getAllSalary.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getAllSalaries = payload?.data || []; // แก้ไขให้ใช้ payload?.data
      })
      //saveTax
      .addCase(saveTax.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(saveTax.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(saveTax.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      //getTax
      .addCase(getTax.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getTaxeis = payload?.data || []; // แก้ไขให้ใช้ payload?.data
      })
      //updateTax
      .addCase(updateTax.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(updateTax.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(updateTax.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      ///deleteTax
      .addCase(deleteTax.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(deleteTax.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(deleteTax.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      //cardsummary
      .addCase(cardsummary.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.cardsummaries = payload?.data || "ເກີດຂໍ້ຜິດຜາດ";
      })
      ///addFormData
      .addCase(addFormData.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(addFormData.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(addFormData.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      ///postsalary
      .addCase(postsalary.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(postsalary.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(postsalary.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      // getSalary
      .addCase(getSalary.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getSalaries = payload?.data || "ເກີດຂໍ້ຜິດຜາດ";
      })
      //CancelCardSummary
      .addCase(CancelCardSummary.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(CancelCardSummary.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(CancelCardSummary.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      // addFormDataEdit
      .addCase(addFormDataEdit.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(addFormDataEdit.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(addFormDataEdit.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      //deletesalarycalu
      .addCase(deletesalarycalu.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(deletesalarycalu.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      })
      .addCase(deletesalarycalu.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload?.message || "ເກີດຂໍ້ຜິດຜາດ";
      });
  },
});

export const { messageClear } = salaryReducer.actions;
export default salaryReducer.reducer;
