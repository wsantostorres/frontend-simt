const Input = ({ name, type, placeholder, handleChange, valueLabel, value, messageError, validationClass }) => {
  return (
    <div>
        <label htmlFor={name}>{valueLabel}</label>
        <input className={`form-control ${validationClass}`}
        name={name} 
        id={name} 
        type={type} 
        placeholder={placeholder}
        onChange={(e) => handleChange(e)}
        value={value} />
        {messageError && (<small className="invalid-feedback d-block fw-bold" >{messageError}</small>)}
    </div>
  )
}

export default Input