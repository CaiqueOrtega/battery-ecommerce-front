import ConnectionAPI from "../ConnectionAPI";

const UserService = () => {

  const getUserByEmail = async (email) => {
    
    try {
      const response = await ConnectionAPI.get(`users/email/${email}`);
      console.log(response.data);
      return response.data;

    } catch (error) {
      console.error('Erro ao pegar usuário:', error);
    }
  }

  return { getUserByEmail };
};

export default UserService;