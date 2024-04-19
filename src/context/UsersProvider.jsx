import { useEffect, createContext, useState } from "react";
import UserService from "../services/users/UsersServices";

const UserContext = createContext({})

function UserProvider({children}){
    const { getUsers } = UserService();
    const [users, setUsers] = useState([]);
    const [isContextLoaded, setIsContextLoaded] = useState(false);
    const [updateTable, setUpdateTable] = useState(false);

    const fetchUsers = async () => {
        try{
            const usersData = await getUsers();
            setUsers(usersData)
        }catch (error){
            console.log("ERRO AQUI")
        }
        console.log(users)
        setIsContextLoaded(true);
    }

    useEffect(() => {
        fetchUsers()
    }, [updateTable])

    return isContextLoaded ? (
        <UserContext.Provider value={{users, setUpdateTable}}>
            {children}
        </UserContext.Provider>
    ) : null
}

export {UserContext, UserProvider}