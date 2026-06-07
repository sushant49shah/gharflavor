import { useAppSelector } from "../../hooks";

const token = useAppSelector((state) => state.user.userInfo?.token);

const authConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  export default authConfig;