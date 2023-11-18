import { useCallback } from "react";
import { apiSimt } from "../services/api"

export const useFetchUsers = () => {

    const url = apiSimt();

    const getDataUserSimt = useCallback(async (id) => {

      try {
        const response = await fetch(`${url}/users/${id}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          }
        })
   
        const dataUserSIMT = await response.json();

        if(dataUserSIMT === null){
          throw new Error("Error")
        }

        return dataUserSIMT;

      } catch (error) {
        return null;
      }
        
    }, [url])
    
    const saveUserSimt = async (registration, fullName, bondType, course) => {
        if(bondType === "Aluno"){
    
          let data = {
            registration: registration,
            fullName: fullName,
            bondType: bondType,
            course: course
          }
    
          const response = await fetch(`${url}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
    
          return await response.json();
        }else if(bondType === "Servidor"){
          
          let data = {
            registration: registration,
            fullName: fullName,
            bondType: bondType
          }
    
          const response = await fetch(`${url}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
          })
    
          return await response.json();
    
        }else{
    
        }
    }

  return { getDataUserSimt, saveUserSimt }
}