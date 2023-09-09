import { createContext, useState, useContext, useEffect } from "react"

export const MessageContext = createContext();

export const MessageContextProvider = ({children}) => {

    const [vacancyMessage, setVacancyMessage] = useState("");
    const [courseMessage, setCourseMessage] = useState("");
    const [resumeMessage, setResumeMessage] = useState("");

    useEffect(() => {
        if(vacancyMessage.type === "success" || resumeMessage.type === "success" ){
            const timer = setTimeout(() => {
                setVacancyMessage("");
                setResumeMessage("");
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [vacancyMessage, resumeMessage])

    return (<MessageContext.Provider value={{ vacancyMessage, setVacancyMessage, courseMessage, setCourseMessage, resumeMessage, setResumeMessage}}>
        {children}
    </MessageContext.Provider>
    )
}

export const useMessage = () =>{
    const context = useContext(MessageContext)
    return context
}

export default MessageContext;
