import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignupForm } from "@/components/auth/signup-form";
import { useAuthStore } from '@/stores/useAuthStores';

const SignUpPage = () => {
  const navigate = useNavigate();
  
  // Lấy hàm signUp và trạng thái loading từ Zustand Store
  const { signUp, loading } = useAuthStore();

  // Hàm trung gian nhận dữ liệu từ Form con và gửi lên Store
  const handleRegisterSubmit = async (username, password, email, firstName, lastName) => {
    try {
      // Gọi API đăng ký qua Store
      await signUp(username, password, email, firstName, lastName);
      
      // Đăng ký thành công thì tự động chuyển hướng người dùng sang trang Đăng nhập
      navigate('/signin');
    } catch (err) {
      console.error("Lỗi xử lý điều hướng tại Page:", err);
    }
  };

  return (
    // Truyền hàm và trạng thái loading xuống component con qua props
    <div className="font-sans">
      <SignupForm signUpFn={handleRegisterSubmit} isLoading={loading} />
    </div>
  );
};

export default SignUpPage;