import ConnectionAPI from "../ConnectionAPI";

const UserService = () => {

  const getUserByEmail = async (email) => {

    try {
      const response = await ConnectionAPI.get(`users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao pegar usuário:', error);
    }
  }

  const getUsers = async () => {
    try{
      const response = await ConnectionAPI.get('users')
      return response.data
    } catch (error){
      console.log("DEU PAU")
    }
  }

  const changeRole = async (userId, selectedRole) => {
    try{
      const response = await ConnectionAPI.put(`users/changeRole/${userId}`,{
        role: selectedRole
      })
      return response.status
    } catch (error) {
      console.log("DEU PAU")
    }
  }

  return {getUserByEmail, getUsers, changeRole}
};

export default UserService;