const Select = ({ name, handleChange, valueLabel, value }) => {
  return (
    <div>
        <label htmlFor={name}>{valueLabel}</label>
        <select className="form-control" 
        name={name} 
        id={name}
        onChange={handleChange}
        value={value}>
            <option value="0" disabled> -- Selecione uma opção -- </option>
            <option value="1">Estágio</option>
            <option value="2">Jovem Aprendiz</option>
        </select>
    </div>
  )
}

export default Select