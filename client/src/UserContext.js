import axios from 'axios';

const { createContext, useState, useEffect } = require("react");

export const UserContext = createContext({});

export function UserContextProvider({children}){
    const [user, setUser] = useState(null);
    useEffect(()=>{
        if (!user) {
            axios.get('/profile').then(({data})=>{
                setUser(data);
            });
        }
    }, []);
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}