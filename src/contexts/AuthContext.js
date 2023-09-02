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

    // authentication
    try{
      responseAuthentication = await authenticationSuap(data)
      
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

    // save or update user
    try{
      const tokenResp = await responseAuthentication.json();
      const dataUserSUAP = await getDataUserSuap(tokenResp.access);
      const dataUserSIMT = await getDataUserSimt(tokenResp.access); 

      if(dataUserSUAP.tipoVinculo === "Aluno"){

        localStorage.setItem('tokenSUAP', JSON.stringify(tokenResp))

        if(dataUserSIMT.bondType === undefined || dataUserSIMT.bondType === null){
          let response = await saveUserSimt(dataUserSIMT.id, dataUserSUAP.matricula, dataUserSUAP.nomeCompleto, dataUserSUAP.tipoVinculo, dataUserSUAP.curso)
          
          if(response.status !== 201){
            localStorage.removeItem('tokenSUAP');
            setError("Não foi possível estabelecer conexão com o servidor.")
            return;
          }
        }

        setToken(tokenResp)
        setId(dataUserSIMT.id)
        setName(dataUserSUAP.nomeCompleto)
        setBondType(dataUserSUAP.tipoVinculo)
        setCourse(dataUserSUAP.curso)
        setStudentVacancies(dataUserSIMT.vacanciesIds)
        
      }else if(dataUserSUAP.tipoVinculo === "Servidor"){
        localStorage.setItem('tokenSUAP', JSON.stringify(tokenResp))

        if(dataUserSIMT.bondType === undefined || dataUserSIMT.bondType === null){
          let response = await saveUserSimt(dataUserSIMT.id, dataUserSUAP.matricula, dataUserSUAP.nomeCompleto, dataUserSUAP.tipoVinculo)

          if(response.status !== 201){
            localStorage.removeItem('tokenSUAP');
            setError("Não foi possível estabelecer conexão com o servidor.")
            return;
          }
        }

        setToken(tokenResp.access)
        setId(dataUserSIMT.id)
        setName(dataUserSUAP.nomeCompleto)
        setBondType(dataUserSUAP.tipoVinculo)

      }else{
        setError("Você não possui um vínculo válido.")
      }

      setError("") // clear error if login has occurred
    }catch(err){
      localStorage.removeItem('tokenSUAP');
      setError("Não foi possível estabelecer conexão com o servidor.")
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
  }

  useEffect(() => {
    const tokenStoraged = JSON.parse(localStorage.getItem('tokenSUAP'));

    if(tokenStoraged){
        (async () => {
            setLoading(true)

            try{
              const status = await verifyToken(tokenStoraged.access);
              const dataUserSIMT = await getDataUserSimt(tokenStoraged.access);
              
              if(status === 200){
                setId(dataUserSIMT.id);
                setToken(tokenStoraged);
                setName(dataUserSIMT.fullName);
                setBondType(dataUserSIMT.bondType);

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

                    const dataUserSIMT = await getDataUserSimt(newToken.access);
                    setId(dataUserSIMT.id);
                    setToken(newToken);
                    setName(dataUserSIMT.fullName);
                    setBondType(dataUserSIMT.bondType);

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

}, [getDataUserSimt, verifyToken, refreshToken])

  return (
    <AuthContext.Provider value={{ token, id, name, bondType, course, studentVacancies, setStudentVacancies, error, loading, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context;
}
