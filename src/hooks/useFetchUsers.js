import { useCallback } from "react";
import { apiSimt } from "../services/api"

export const useFetchUsers = () => {

    const url = apiSimt();

    const getDataUserSimt = useCallback(async (tokenToGetData) => {
        const response = await fetch(`${url}/user-data`, {
          method: "GET",
          headers: {
              "Authorization": `Baerer ${tokenToGetData}`,
              "Content-Type": "application/json",
          }
        })
    
        const dataUserSIMT = response.json();
        return dataUserSIMT;
    }, [url])
    
    const saveUserSimt = async (id, registration, fullName, bondType, course) => {
        if(bondType === "Aluno"){
    
          let data = {
            id: id,
            registration: registration,
            fullName: fullName,
            bondType: bondType,
            course: course
          }
    
          const response = await fetch(`${url}/students`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
    
          return response;
        }else if(bondType === "Servidor"){
          
          let data = {
            id: id,
            registration: registration,
            fullName: fullName,
            bondType: bondType
          }
    
          const response = await fetch(`${url}/employees`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
    
          return response;
    
        }else{
    
        }
    }

  return { getDataUserSimt, saveUserSimt }
}