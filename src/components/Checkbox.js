const Checkbox = ({ name, id, valueLabel, handleChange, checked = false }) => {
  return (
    <div className="d-flex align-items-center mb-2">
        <input className="form-check-input" type="checkbox" 
        name={id} 
        id={id}
        checked={checked} 
        onChange={(e) => handleChange(e)} />
        <label className="ms-2 form-check-label" htmlFor={name}>{valueLabel}</label>
    </div>
  )
}

export default Checkbox