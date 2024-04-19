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
    try{
      const response = await ConnectionAPI.get('users')
      console.log(response.data)
      return response.data
    } catch (error){
      console.log("DEU PAU")
    }
  }

  const turnAdmin = async (userId) => {
    try{
      const response = await ConnectionAPI.put(`users/turnadmin/${userId}`)
      return response.status
      console.log(response.data)
    } catch (error) {
      console.log("DEU PAU")
    }
  }

  return {getUserByEmail, getUsers, turnAdmin}
};

export default UserService;