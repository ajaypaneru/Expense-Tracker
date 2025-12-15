import { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths"; // <-- Make sure this path is correct

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserOnRefresh = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    // 1. Set the token for all future axios requests
                    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                    // 2. Use the CORRECT path from your apiPaths.js file
                    const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO); 

                    // 3. Set the user in state
                    //    (Check your console to see the response structure, 
                    //    it might be response.data.user or just response.data)
                    if (response.data) {
                        setUser(response.data.user); // <-- This assumes the user object is nested under 'user'
                    }

                } catch (error) {
                    console.error("Failed to fetch user on refresh:", error);
                    // If token is invalid, clear it
                    localStorage.removeItem("token");
                    delete axiosInstance.defaults.headers.common["Authorization"];
                }
            }
            // 4. We are done loading
            setLoading(false);
        };

        loadUserOnRefresh();
    }, []); // Empty array runs this only once on app load

    //Function to update user data
    const updateUser = (userData) => {
        setUser(userData);
    };

    //function to clear user data
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
        delete axiosInstance.defaults.headers.common["Authorization"];
    };

    return (
        <UserContext.Provider
        value={{
            user,
            updateUser,
            clearUser,
            loading, // <-- Pass loading state
        }}
        >
            {/* Don't render the app until we've checked for a user */}
            {!loading && children}
        </UserContext.Provider>
    );
}

export default UserProvider;