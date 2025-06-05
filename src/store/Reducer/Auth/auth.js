import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../API/api";
// import { jwtDecode } from "jwt-decode";
const returnRole = (token) => {
  if (token) {
    // const decodeToken = jwtDecode(token);
    // const expireTime = new Date(decodeToken.exp * 1000);
    const expireTime = token.exp * 1000; // Assuming token.exp is in seconds, convert to milliseconds
    if (new Date() > expireTime) {
      localStorage.removeItem("authToken");
      return "";
    } else {
      return token.role;
    }
  } else {
    return "";
  }
};
//check token

export const check_token = createAsyncThunk(
  "auth/ check_token",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/auth/check", {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);
export const register = createAsyncThunk(
  "auth/register",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/auth",
        {
          name: info.name,
          email: info.email,
          tel: info.tel,
          password: info.password,
          role: info.role,
        },
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("authToken", data.token);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ tel, password }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        "/login",
        {
          tel: tel,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("authToken", data.token);
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_user_info = createAsyncThunk(
  "auth/get_user_info",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get("/get-user", { withCredentials: true });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_all_user = createAsyncThunk(
  "auth/get-all_user",
  async (page, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-all-user?page=${page}`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_Id_user = createAsyncThunk(
  "auth/get_Id_user",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-emlyee-Id/${id}`, {
        withCredentials: true,
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);
//editProfile
export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async ({ id, formData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      // ดูค่าที่อยู่ใน formData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }
      const { data } = await api.patch(`/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);
//postNotice
export const postNotice = createAsyncThunk(
  "auth/postNotice",
  async ({ formData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(`/postNotice`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
      });
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);
//getPostNotice
export const getPostNotice = createAsyncThunk(
  "auth/getPostNotice",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/get-notice`, {
        withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
      });
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);
//editPostNotice
export const editPostNotice = createAsyncThunk(
  "auth/editPostNotice",
  async ({ id, formData }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.patch(`/edit-postNotice/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
      });
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);
//deletePostNotice
export const deletePostNotice = createAsyncThunk(
  "auth/deletePostNotice",
  async ({ id }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.delete(`/delete-postNotice/${id}`, {
        withCredentials: true, // ตรงนี้ต้องอยู่ใน object เดียวกัน
      });
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);
//logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post(
        `/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        localStorage.removeItem("authToken"); // ลบ localStorage ด้วย
        window.location.href = "/login";
      }
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);
export const authReducer = createSlice({
  name: "auth",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: true,
    userInfo: "",
    role: "",
    token: {},
    get_all_user_em: [],
    get_id_emplyee: [],
    get_all_user_block: [],
    totaled: 0,
    getPostNoti: [],
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.token;
        state.role = returnRole(payload.token);
      })
      ///admin-login
      .addCase(login.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = payload.token;
        state.role = returnRole(payload.token);
      })
      .addCase(get_user_info.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.userInfo = payload.userInfo;
      })
      .addCase(get_all_user.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.get_all_user_em = payload.users;
        state.get_all_user_block = payload.usersBlock;
        state.totaled = payload.total;
      })
      .addCase(get_Id_user.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.get_id_emplyee = payload.data;
      })
      //editProfile
      .addCase(editProfile.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(editProfile.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(editProfile.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      //postNotice
      .addCase(postNotice.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(postNotice.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(postNotice.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      //getPostNotice
      .addCase(getPostNotice.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.getPostNoti = payload.data;
      })
      //editPostNotice
      .addCase(editPostNotice.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(editPostNotice.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(editPostNotice.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      //deletePostNotice
      .addCase(deletePostNotice.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(deletePostNotice.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(deletePostNotice.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      })
      //check_token
      .addCase(check_token.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(check_token.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(check_token.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
        state.token = returnRole(payload.user);
        state.role = returnRole(payload.user);
      })
      //logout
      .addCase(logout.pending, (state, { payload }) => {
        state.loader = true;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload.message;
      })
      .addCase(logout.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = payload.message;
      });
  },
});
export const { messageClear } = authReducer.actions;
export default authReducer.reducer;
