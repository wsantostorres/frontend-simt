const Select = ({ name, handleChange, valueLabel, value, messageError, validationClass }) => {
  return (
    <div>
        <label htmlFor={name}>{valueLabel}</label>
        <select className={`form-control ${validationClass}`} 
        name={name} 
        id={name}
        onChange={handleChange}
        value={value}>
            <option value="0"> -- Selecione uma opção -- </option>
            <option value="1">Estágio</option>
            <option value="2">Jovem Aprendiz</option>
        </select>
        {messageError && (<small className="invalid-feedback d-block fw-bold" >{messageError}</small>)}
    </div>
  )
}

export default Select