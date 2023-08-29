import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchVacancies } from "../../hooks/useFetchVacancies";
import { useFetchCourse } from "../../hooks/useFetchCourse";

import { useMessage } from "../../contexts/MessageContext";

import Input from "../../components/Input";
import Checkbox from "../../components/Checkbox";
import CheckboxCourses from "../../components/CheckboxCourses";
import Select from "../../components/Select";
import EditorDescription from "../../components/EditorDescription";
import Loading from '../../components/Loading';

import styles from './Post.module.css';

import { LuSave } from 'react-icons/lu';
import { BsTrash } from 'react-icons/bs';
import { IoMdArrowRoundBack } from 'react-icons/io'

const Post = () => {
  const { id } = useParams();
  const { vacancyMessage, setVacancyMessage, courseMessage, setCourseMessage } = useMessage();
  const { getVacancy, postVacancy, putVacancy, deleteVacancy, vacancyLoading, errorValidation } = useFetchVacancies();
  const { getCourses, courseLoading } = useFetchCourse();
  
  const [validation, setValidation] = useState("");
  const [vacancyErrorMessage, setVacancyErrorMessage] = useState("");
  const [courseErrorMessage, setCourseErrorMessage] = useState("");
  const [courses, setCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [vacancy, setVacancy] = useState({
    tipo: 1,
    cursos:[]
  });

  useEffect(() => {
    (async () => {
      if(id){
        const vacancyData = await getVacancy(id);

        if(vacancyData !== null){
          // setVacancy(vacancyData)
          let dataEncerra = formatDate(vacancyData.dataEncerramento)
          setVacancy({...vacancyData, dataEncerramento:dataEncerra})
          setSelectedCourses(vacancyData.cursos)
        }
      
      }
    })()
  }, [id, getVacancy])

  useEffect(() => {
    (async () => {
        const coursesData = await getCourses();
        setCourse(coursesData)
    })()
  }, [getCourses])

  useEffect(() => {
    if (vacancyMessage) {
      setVacancyErrorMessage(vacancyMessage);
      setVacancyMessage("");
    }

    if(errorValidation){
      setValidation(errorValidation)
    }
    
    if (courseMessage) {
      setCourseErrorMessage(courseMessage);
      setCourseMessage("");
    }
  }, [vacancyMessage, setVacancyMessage, setVacancyErrorMessage, 
    errorValidation, setValidation, 
    courseMessage, setCourseMessage, setCourseErrorMessage])

  const handleSubmit = async (e) => {
    e.preventDefault();
    vacancy.cursos = selectedCourses;
    if(id){
      await putVacancy(vacancy, id)
    }else{
      await postVacancy(vacancy)
    }
  }
  
  const handleDelete = async (id) => {
    await deleteVacancy(id)
  }

  const handleDescriptionChange = (content) => {
    setVacancy({ ...vacancy, descricao: content });
  }

  const handleOnChange = (e, cursoId) => {
    if(cursoId){
      const { checked } = e.target;
      const cursoIndex = selectedCourses.findIndex(curso => curso.id === cursoId);
    
      if (checked && cursoIndex === -1) {
        setSelectedCourses(prevState => [...prevState, { id: cursoId }]);
      } else if (!checked && cursoIndex !== -1) {
        setSelectedCourses(prevState => prevState.filter(curso => curso.id !== cursoId));
      }

    }else{
      let name = e.target.name;
      let value;
    
      if (e.target.type === 'checkbox') {
        value = e.target.checked ? 1 : 0;
      } else if (e.target.type === 'select-one') {
        value = Number(e.target.options[e.target.selectedIndex].value);
      } else {
        value = e.target.value;
      }
  
      setVacancy({ ...vacancy, [name]: value });
    }
  }

  // FUNÇÃO TEMPORÁRIA PARA CORRIGIR PROBLEMA DA DATA NO INPUT AO RESGATAR DADOS DA VAGA
  function formatDate(dataEncerramento) {
    let dataSelecionada = new Date(dataEncerramento);
    let dia = dataSelecionada.getDate().toString().padStart(2, '0');
    let mes = (dataSelecionada.getMonth() + 1).toString().padStart(2, '0');
    let ano = dataSelecionada.getFullYear();
    let dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada;
  }

  if(vacancyLoading){
    return (<Loading />)
  }

  return (
    <div className={styles.postContainer}>
      <nav>
        <div>
          <Link to="/"><img src="/logo.svg" alt="Home"/></Link>
          <Link className={styles.buttonBackToHome} to="/"><IoMdArrowRoundBack /> <span>Voltar</span></Link>
        </div>
      </nav>
      <form onSubmit={handleSubmit}>
          {vacancyErrorMessage && vacancyErrorMessage.type === "error" && (<p className="alert alert-danger p-2 m-0 mb-3 text-center">{vacancyErrorMessage.msg}</p>)}
          { vacancy && vacancy.id ? (<h2>Editar Publicação</h2>) : (<h2>Nova Publicação</h2>) }
          <hr />
          <div className={styles.containerTitleDate}>
              <Input name="titulo"
              type="text"
              placeholder="Função, nome da empresa"
              handleChange={handleOnChange}
              valueLabel="Titulo: "
              value={ vacancy ? vacancy.titulo : "" }
              messageError={validation && validation.titulo} 
              validationClass={validation && validation.titulo ? 'is-invalid' : ''}/>

              <Input name="dataEncerramento"
              type="date"
              handleChange={handleOnChange}
              valueLabel="Data de Encerramento: "
              value={ vacancy ? vacancy.dataEncerramento : "" }
              messageError={validation && validation.dataEncerramento} 
              validationClass={validation && validation.dataEncerramento ? 'is-invalid' : ''}/>
          </div>
          
          <div>
            <EditorDescription name="descricao" 
                placeholder="Requisítos, valor a bolsa"
                cols="5"
                rows="5"
                handleChange={handleDescriptionChange}
                valueLabel="Descrição: "
                value={vacancy ? vacancy.descricao : ""} 
                messageError={validation && validation.descricao} />
          </div>

          <Select name="tipo"
          handleChange={handleOnChange}
          valueLabel="Tipo: "
          value={vacancy ? vacancy.tipo : 0 } 
          validationError={validation && validation.tipo} />
        

          <div className={styles.available}>
            <p>Disponibilidade: </p>
            <div>
              <Checkbox name="dispManha"
                    id="dispManha"
                    checked={vacancy && vacancy.dispManha === 1 ? true : false}
                    valueLabel="Manhã"
                    handleChange={handleOnChange} />
              <Checkbox name="dispTarde"
                    id="dispTarde"
                    checked={vacancy && vacancy.dispTarde === 1 ? true : false}
                    valueLabel="Tarde"
                    handleChange={handleOnChange} />
              <Checkbox name="dispNoite"
                    id="dispNoite"
                    checked={vacancy && vacancy.dispNoite === 1 ? true : false}
                    valueLabel="Noite"
                    handleChange={handleOnChange} />
            </div>
          </div>

          <div className={styles.courses}>
            <p>Cursos:</p>
            <p>{courseLoading && <span>Carregando cursos...</span> }</p>
            <p>{!courseLoading && courseErrorMessage && courseErrorMessage.msg}</p>
            <div>
              {courses && courses.map((course) => {
                  const isChecked = selectedCourses.some((registredCourse) => registredCourse.id === course.id);
                  return (
                  <div className="d-flex align-items-center mb-2" key={course.id}>
                    <CheckboxCourses
                    name={course.id}
                    id={course.id}
                    checked={isChecked}
                    valueLabel={course.nome}
                    handleChange={handleOnChange}
                    messageError={validation && validation.cursos}
                    validationClass={validation && validation.cursos ? 'is-invalid' : ''} />
                  </div>
                  );
              })}
            </div>
          </div>
          {validation && (<small className="invalid-feedback d-block fw-bold" >{validation.cursos}</small>)}

          <div className={styles.buttonsFormPost}>
            {vacancy && vacancy.id && (<button className={styles.buttonDelete } onClick={() => handleDelete(vacancy.id)}><BsTrash /> <span>Excluir</span></button>)}
            <button type="submit" className={styles.buttonSave } ><LuSave /> <span>Salvar</span></button>
          </div>
      </form>

    </div>
  )
}

export default Post;