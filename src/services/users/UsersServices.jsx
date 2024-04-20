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

  const getUsers = async () => {
    console.log('teste dentro:')
    try{
      const response = await ConnectionAPI.get('users')
      console.log(response.data)
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