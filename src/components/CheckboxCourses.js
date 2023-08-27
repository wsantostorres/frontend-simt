const CheckboxCourses = ({ name, id, valueLabel, handleChange, checked = false, validationClass }) => {
  return (
    <>
      <input className={`form-check-input ${validationClass}`} 
      type="checkbox" 
      name={id} 
      id={id}
      checked={checked} 
      onChange={(e) => handleChange(e, id)}/>
      <label className="ms-2 form-check-label" htmlFor={name}>{valueLabel}</label>
    </>
  )
}

export default CheckboxCourses