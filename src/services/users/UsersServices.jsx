import React, { useContext, useState } from "react";
import ConnectionAPI from "../ConnectionAPI";

const UserService = () => {
  const [errorMessages, setErrorMessages] = useState({});

  const getUserByEmail = async (email) => {

    try {
      const response = await ConnectionAPI.get(`users/email/${email}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao pegar usuário:', error);
    }
  }

  const getUsers = async () => {
    try {
      const response = await ConnectionAPI.get('users')
      return response.data
    } catch (error) {
      console.log("DEU PAU")
    }
  }

  const changeRole = async (userId, selectedRole) => {
    try {
      await ConnectionAPI.put(`users/changeRole/${userId}/${selectedRole}`);

      return { success: true }
    } catch (error) {
      return error;
    }
  }


  return { getUserByEmail, getUsers, changeRole, errorMessages, setErrorMessages }
};

export default UserService;