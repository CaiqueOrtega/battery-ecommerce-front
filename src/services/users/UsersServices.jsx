import ConnectionAPI from "../ConnectionAPI";

const UserService = {
  getUserByEmail: async (email) => {
    try {
      const response = await ConnectionAPI.get(`users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao pegar usuário:', error);
      throw error;
    }
  },
};

export default UserService;