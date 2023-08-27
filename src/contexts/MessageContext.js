import { createContext, useState, useContext, useEffect } from "react"

export const MessageContext = createContext();

export const MessageContextProvider = ({children}) => {

    const [vacancyMessage, setVacancyMessage] = useState("");
    const [courseMessage, setCourseMessage] = useState("");

    useEffect(() => {
        if(vacancyMessage.type === "success"){
            const timer = setTimeout(() => {
                setVacancyMessage("");
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [vacancyMessage])

    return (<MessageContext.Provider value={{ vacancyMessage, setVacancyMessage, courseMessage, setCourseMessage }}>
        {children}
    </MessageContext.Provider>
    )
}

export const useMessage = () =>{
    const context = useContext(MessageContext)
    return context
}

export default MessageContext;
