import React, { useContext, useState } from "react";
import ConnectionAPI from "../ConnectionAPI";
import ErrorServices from "../error/ErrorServices"
import { AuthContext } from "../../context/AuthProvider";

const UserService = () => {
  const { setErrorMessages, errorMessages, handleAPIError } = ErrorServices();
  const { logout } = useContext(AuthContext)

  const getUserByEmail = async (email) => {

    try {
      const response = await ConnectionAPI.get(`users/email/${email}`);
      return response.data;
    } catch (error) {
    }
  }

  const getUsers = async () => {
    try {
      const response = await ConnectionAPI.get('users')
      return response.data
    } catch (error) {    }
  }

  const changeRole = async (userId, selectedRole, loggedUserId) => {  
    try {
      await ConnectionAPI.put(`users/changeRole/${userId}/${selectedRole}/${loggedUserId}`);
      return { success: true }
    } catch (error) {
      handleAPIError(error);
    }
  }

  const desactiveAccount = async (userId, password) => {
    try {
      await ConnectionAPI.delete(`users/${userId}/${password}`);
      logout()
      return { success: true }
    } catch (error) {
      handleAPIError(error)
    }
  }

  const updateUser = async (userId, name, email) => {
    
    try{
      await ConnectionAPI.patch(`users/${userId}`, {
        name: name,
        email: email
      })
      return { success: true }
    } catch (error) {
      handleAPIError(error)
    }
  }

  const getReportData = async (report) => {
    try{
      const response = await ConnectionAPI.get(`users/report/${report}`)
      return response.data
    } catch (error){
      console.log(error)
    }
  }



  return { getUserByEmail, getUsers, changeRole, desactiveAccount, errorMessages, setErrorMessages, updateUser, getReportData }
};

export default UserService;