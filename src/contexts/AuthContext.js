import { createContext, useContext, useState, useEffect } from 'react';

import { useFetchUsers } from '../hooks/useFetchUsers';
import { useFetchSuap } from '../hooks/useFetchSuap';

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {

  // data hooks
  const { getDataUserSimt, saveUserSimt} = useFetchUsers();
  const { authenticationSuap, getDataUserSuap, verifyToken, refreshToken } = useFetchSuap();
  
  // states
  const [token, setToken] = useState();
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [bondType, setBondType] = useState();
  const [course, setCourse] = useState();
  const [resumeId, setResumeId] = useState(null);
  const [studentVacancies, setStudentVacancies] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState();

  const login = async (registration, password) => {
    setLoading(true)
    
    const data = {
        "username":registration,
        "password":password
    }

    let responseAuthentication;
    let tokenResponse;
    let responseDataSuap;
    let responseDataSimt;

    // autenticação
    try{
      responseAuthentication = await authenticationSuap(data)
      tokenResponse = await responseAuthentication.json();
      
      if(responseAuthentication.status === 401){
        setError("Credenciais inválidas.")
        setLoading(false)
        return;
      }

      if(responseAuthentication.status !== 200 && responseAuthentication.status !== 401){
        setError("Ocorreu um erro.")
        setLoading(false)
        return;
      }
      
    }catch(err){
      setError("Não foi possível estabelecer conexão com o servidor.")
      setLoading(false)
      return;
    }

    // pegando dados do suap
    try {
      responseDataSuap = await getDataUserSuap(tokenResponse.access)
    } catch (error) {
      setError("Não foi possível estabelecer conexão com o servidor.")
      setLoading(false)
      return;
    }

    // verifica se possui um vínculo válido com o suap
    if(responseDataSuap.bondType === "Nenhum"){
      setError("Você não possui um vínculo válido.")
      setLoading(false)
      return;
    }

    // verifica se o usuário existe e salva
    responseDataSimt = await getDataUserSimt(responseDataSuap.registration);

    if(responseDataSimt !== null){
      localStorage.setItem("tokenSUAP", JSON.stringify(tokenResponse))
      setToken(tokenResponse)
      setId(responseDataSimt.registration)
      setName(responseDataSimt.fullName)
      setBondType(responseDataSimt.bondType)
      setCourse(responseDataSimt.course)
      setResumeId(responseDataSimt.resumeId)
      setStudentVacancies(responseDataSimt.vacanciesIds)
    }else{

      try {
        const responseSaveUserSimt = await saveUserSimt(
          responseDataSuap.registration,
          responseDataSuap.fullName,
          responseDataSuap.bondType,
          responseDataSuap.course
        )

        localStorage.setItem("tokenSUAP", JSON.stringify(tokenResponse))
        setToken(tokenResponse)
        setId(responseSaveUserSimt.registration)
        setName(responseSaveUserSimt.fullName)
        setBondType(responseSaveUserSimt.bondType)
        setCourse(responseSaveUserSimt.course)
        setResumeId(null)
        setStudentVacancies(null)
        
      } catch (error) {
        setError("Não foi possível estabelecer conexão com o servidor.")
        setLoading(false)
        return;
      }
  

    }
    
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('tokenSUAP')
    setToken("")
    setId("")
    setName("")
    setBondType("")
    setCourse("")
    setResumeId(null)
    setStudentVacancies(null)
  }

  useEffect(() => {
    const tokenStoraged = JSON.parse(localStorage.getItem('tokenSUAP'));

    if(tokenStoraged){
        (async () => {
            setLoading(true)

            try{
              const status = await verifyToken(tokenStoraged.access);
              const responseDataSuap = await getDataUserSuap(tokenStoraged.access)
              const dataUserSIMT = await getDataUserSimt(responseDataSuap.registration);
              
              if(status === 200){
                setId(dataUserSIMT.registration);
                setToken(tokenStoraged);
                setName(dataUserSIMT.fullName);
                setBondType(dataUserSIMT.bondType);
                setResumeId(dataUserSIMT.resumeId)

                if(dataUserSIMT.course !== ""){
                  setCourse(dataUserSIMT.course);
                }

                if(dataUserSIMT.vacanciesIds !== null){
                  setStudentVacancies(dataUserSIMT.vacanciesIds)
                }
        
              }else{
                try {
                  // update token
                  const response = await refreshToken(tokenStoraged.refresh);
                  
                  if(response.status === 200){
                    const newAccess = await response.json();                   

                    const newToken = {
                      refresh: tokenStoraged.refresh,
                      access: newAccess.access
                    }

                    localStorage.setItem('tokenSUAP', JSON.stringify(newToken))

                    setId(dataUserSIMT.registration);
                    setToken(newToken);
                    setName(dataUserSIMT.fullName);
                    setBondType(dataUserSIMT.bondType);
                    setResumeId(dataUserSIMT.resumeId)

                    if(dataUserSIMT.course !== ""){
                      setCourse(dataUserSIMT.course);
                    }

                    if(dataUserSIMT.vacanciesIds !== null){
                      setStudentVacancies(dataUserSIMT.vacanciesIds)
                    }

                  }else{
                    logout();
                    setError("Não foi possível validar seu acesso.")
                  }
                }catch (err) {
                  setError("Não foi possível estabelecer conexão com o servidor ou não foi possível validar seu acesso.");
                }
              }

            }catch(err){
              setError("Não foi possível estabelecer conexão com o servidor.");
            }

            setLoading(false)
        })()
    }

}, [getDataUserSuap, getDataUserSimt, verifyToken, refreshToken])


  return (
    <AuthContext.Provider value={{ token, id, name, bondType, course, resumeId, setResumeId, studentVacancies, setStudentVacancies, error, loading, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context;
}
