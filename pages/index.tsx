import { useEffect, useState } from "react";
import PageContainer from "../src/components/container/PageContainer";
// components
import { useRouter } from "next/router";

import { Toaster } from 'react-hot-toast';

const Landingpage = () => {
  // getting user data
  interface UserData {
    [key: string]: any;
  }

  const getUserData = (): UserData => {
    if (typeof window !== "undefined") {
      const usrData = typeof window !== "undefined" ? window.localStorage?.getItem('userData') : null;
      return usrData ? JSON.parse(usrData) : {};
    }
    return {};
  };

  const initialUserData: UserData = getUserData();
  const [userData, setUserData] = useState<UserData>(initialUserData);

  const router = useRouter();

  useEffect(() => {
    if (Object.keys(userData).length === 0) {
      router.replace("auth/login");
    } else {
      router.replace("app/dashboard");
    }
  }, []);

  return (
    <>
      <PageContainer>
        <h1></h1>
      </PageContainer>;
    </>
  )
};

Landingpage.layout = "Blank";
export default Landingpage;
