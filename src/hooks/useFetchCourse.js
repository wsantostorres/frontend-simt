import { useCallback, useState } from "react";

import { useMessage } from "../contexts/MessageContext";

import { apiSimt } from "../services/api"

export const useFetchCourse = () => {
    const url = apiSimt();
    const { setCourseMessage } = useMessage();

    const [courseLoading, setCourseLoading] = useState(false);

    const getCourses = useCallback(async() => {
      setCourseLoading(true)
        return fetch(`${url}/cursos/`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then( async (response) => {
          if (response.status !== 200) {
            throw new Error('Erro com o servidor');
          }
          return response.json();
        })
        .then((responseJson) => {
          setCourseMessage("");
          setCourseLoading(false)
          return responseJson;
        })
        .catch((err) => {
          setCourseMessage({msg:"Não foi possível carregar cursos.", type:"error"});
          setCourseLoading(false)
          return null;
        });

    }, [url, setCourseMessage])

  return { getCourses, courseLoading }
}