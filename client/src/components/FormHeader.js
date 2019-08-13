import React from 'react';

const FormHeader = (props) => {

  return(
    <div className="cta-header" onClick={props.stopProp}>
      <p className="header-title"> {props.line1} </p>
      <p className="sub-header"> {props.line2} </p>
    </div>
  )
};

export default FormHeader;