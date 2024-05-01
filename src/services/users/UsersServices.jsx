import React, { useContext, useState } from "react";
import ConnectionAPI from "../ConnectionAPI";
import ErrorServices from "../error/ErrorServices"

const UserService = () => {
  const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();


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

  const changeRole = async (userId, selectedRole, loggedUserId) => {
    try {
      await ConnectionAPI.put(`users/changeRole/${userId}/${selectedRole}`, {
        loggedUserId: loggedUserId
      });
      return { success: true }
    } catch (error) {
      handleAPIError(error);
    }
  }


  return { getUserByEmail, getUsers, changeRole, errorMessages, setErrorMessages }
};

export default UserService;