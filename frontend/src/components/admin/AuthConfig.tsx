interface StoredUserInfo {
  token?: string;
}

const getToken = () => {
  try {
    const stored = localStorage.getItem('gharflavour_userInfo');
    const userInfo = stored ? (JSON.parse(stored) as StoredUserInfo) : null;
    return userInfo?.token || '';
  } catch {
    return '';
  }
};

const authConfig = () => ({
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken() ? `Bearer ${getToken()}` : '',
    },
  });

  export default authConfig;
