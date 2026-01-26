import React, { useId } from 'react'
function Input({
    label,
    type="text",
    className="",
    ...props
},ref) {
    const id=useId();
  return (
    <div className='inputContainer'>
        {label && <label className='label' htmlFor={id}>{label}</label>}
        <input type={type} className={className} ref={ref} {...props} id={id} />
    </div>
  )
}

export default React.forwardRef(Input);