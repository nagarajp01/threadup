import React from 'react'

function Button({children,
    className="",
    type="button",
    ...props
}) {
  return (
        <button className={className} {...props}>{children}</button>
  )
}

export default Button