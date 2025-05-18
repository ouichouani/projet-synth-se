import { useState } from "react";
import { UserContext } from "./userContext";

const UserProvider  = ({children}) => {
 
    const [storedUser, SetStoredUser] = useState(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null
    });


    const setStoredUserfunction = (user) => {
        if(user){
            localStorage.setItem('user' , JSON.stringify(user)) ;
        }else{
            localStorage.removeItem('user') ;
        }
        SetStoredUser(user) ;
    }

    return (
        <UserContext.Provider value={{ storedUser, setStoredUserfunction }}>
            {children}
        </UserContext.Provider>
    )
}
export default UserProvider ;
