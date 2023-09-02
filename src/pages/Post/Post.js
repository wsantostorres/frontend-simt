import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchVacancies } from "../../hooks/useFetchVacancies";
import { useFetchCourses } from "../../hooks/useFetchCourses";

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
  const { getVacancy, postVacancy, putVacancy, deleteVacancy, vacancyLoading } = useFetchVacancies();
  const { getCourses, courseLoading } = useFetchCourses();
  
  const [titleErrorValidation, setTitleErrorValidation] = useState("");
  const [validation, setValidation] = useState("");
  const [vacancyErrorMessage, setVacancyErrorMessage] = useState("");
  const [courseErrorMessage, setCourseErrorMessage] = useState("");
  const [courses, setCourse] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [vacancy, setVacancy] = useState({
    title: "",
    closingDate: "",
    description: "",
    type: 0,
    morning: 0,
    afternoon: 0,
    night: 0,
    courses:[]
  });

  // page title
  if(id){
    document.title = "Editar Publicação"
  }else{
    document.title = "Nova Publicação";
  }

  useEffect(() => {
    (async () => {
      if(id){
        const vacancyData = await getVacancy(id);

        if(vacancyData !== null){
          setVacancy(vacancyData)
          setSelectedCourses(vacancyData.courses)
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
    
    if (courseMessage) {
      setCourseErrorMessage(courseMessage);
      setCourseMessage("");
    }
  }, [vacancyMessage, setVacancyMessage, setVacancyErrorMessage, setValidation, 
    courseMessage, setCourseMessage, setCourseErrorMessage])

  // general functions
  const handleDescriptionChange = (content) => {
    setVacancy({ ...vacancy, description: content });
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

  const validateFields = () => {
    const errors = {};

    if (!vacancy.title) {
      errors.title = "O título é obrigatório.";
    }else if (vacancy.title.length > 100) {
      errors.title = "O título não pode ter mais de 100 caracteres";
    }
  
    if (!vacancy.description) {
      errors.description = "A descrição é obrigatória.";
    }else if(vacancy.description.length > 500){
      errors.description = "A descrição pode ter no máximo 500 caracteres";
    }
  
    if (selectedCourses.length === 0) {
      errors.courses = "Selecione pelo menos um curso.";
    }
  
    if (!vacancy.closingDate) {
      errors.closingDate = "A data de encerramento é obrigatória.";
    }

    if (!vacancy.type) {
      errors.type = "Selecione um tipo.";
    }else if(vacancy.type !== 1 && vacancy.type !== 2){
      errors.type = "Selecione um tipo válido.";
    }
  
    return errors;
  };

  // request functions
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateFields();

    if (Object.keys(errors).length > 0) {
      setTitleErrorValidation("Verifique os campos do formulário.")
      setValidation(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setTitleErrorValidation("")
    setValidation({});

    vacancy.courses = selectedCourses;
    if(id){
      await putVacancy(vacancy, id)
    }else{
      await postVacancy(vacancy)
    }
  }
  
  const handleDelete = async (id) => {
    await deleteVacancy(id)
  }

  // loading
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
          {titleErrorValidation && (<p className="alert alert-danger p-2 m-0 mb-3 text-center">{titleErrorValidation}</p>)}
          {vacancyErrorMessage && vacancyErrorMessage.type === "error" && (<p className="alert alert-danger p-2 m-0 mb-3 text-center">{vacancyErrorMessage.msg}</p>)}
          { vacancy && vacancy.id ? (<h2>Editar Publicação</h2>) : (<h2>Nova Publicação</h2>) }
          <hr />
          <div className={styles.containerTitleDate}>
              <Input name="title"
              type="text"
              placeholder="Função, nome da empresa"
              handleChange={handleOnChange}
              valueLabel="Titulo: "
              value={vacancy.title}
              messageError={validation && validation.title} 
              validationClass={validation && validation.title ? 'is-invalid' : ''}/>

              <Input name="closingDate"
              type="date"
              handleChange={handleOnChange}
              valueLabel="Data de Encerramento: "
              value={vacancy.closingDate}
              messageError={validation && validation.closingDate} 
              validationClass={validation && validation.closingDate ? 'is-invalid' : ''}/>
          </div>
          
          <div>
            <EditorDescription name="description" 
                placeholder="Requisítos, valor a bolsa"
                cols="5"
                rows="5"
                handleChange={handleDescriptionChange}
                valueLabel="Descrição: "
                value={vacancy.description} 
                messageError={validation && validation.description} />
          </div>

          <Select name="type"
          handleChange={handleOnChange}
          valueLabel="Tipo: "
          value={vacancy.type} 
          messageError={validation && validation.type} 
          validationClass={validation && validation.type ? 'is-invalid' : ''} />
        
          <div className={styles.available}>
            <p>Disponibilidade: </p>
            <div>
              <Checkbox name="morning"
                    id="morning"
                    checked={vacancy.morning === 1 ? true : false}
                    valueLabel="Manhã"
                    handleChange={handleOnChange} />
              <Checkbox name="afternoon"
                    id="afternoon"
                    checked={vacancy.afternoon === 1 ? true : false}
                    valueLabel="Tarde"
                    handleChange={handleOnChange} />
              <Checkbox name="night"
                    id="night"
                    checked={vacancy.night === 1 ? true : false}
                    valueLabel="Noite"
                    handleChange={handleOnChange} />
            </div>
          </div>

          <div className={styles.courses}>
            <p>Cursos:</p>
            <p>{courseLoading && <span>Carregando courses...</span> }</p>
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
                    valueLabel={course.name}
                    handleChange={handleOnChange}
                    messageError={validation && validation.courses}
                    validationClass={validation && validation.courses ? 'is-invalid' : ''} />
                  </div>
                  );
              })}
            </div>
          </div>
          {validation && (<small className="invalid-feedback d-block fw-bold" >{validation.courses}</small>)}

          <div className={styles.buttonsFormPost}>
            {vacancy && vacancy.id && (<button type="button" className={styles.buttonDelete } onClick={() => handleDelete(vacancy.id)}><BsTrash /> <span>Excluir</span></button>)}
            <button type="submit" className={styles.buttonSave } ><LuSave /> <span>Salvar</span></button>
          </div>
      </form>

    </div>
  )
}

export default Post;