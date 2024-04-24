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
      handleAPIError(error)
      return { success: false }
    }
  }

  const handleAPIError = (error) => {
    if (error.response.data.field) {
        const { field, message } = error.response.data;
        setErrorMessages({ [field]: message });
    } else if (error.response.data.message) {
        setErrorMessages({ general: error.response.data.message });
    } else {
        setErrorMessages({ serverError: 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.' });
    }
};


  return { getUserByEmail, getUsers, changeRole, errorMessages, setErrorMessages }
};

export default UserService;