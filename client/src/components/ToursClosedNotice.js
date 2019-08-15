import React from 'react';

const ToursClosedNotice = (props) => {
  return (
    <div className="closed-notice">
      <p className="closed-notice-message"> {props.toursClosedMessage && props.toursClosedMessage.content} </p>
      <p className="subscribe"> To get notified with all museum news including when new exhibits open, please <a href="#register=true">subscribe</a> to the <span> rennie museum </span> newsletter. </p>
    </div>
  )
}

export default ToursClosedNotice;

