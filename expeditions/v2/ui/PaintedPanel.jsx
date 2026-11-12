import React from 'react';
export default function PaintedPanel({as:Tag='section',className='',children,...props}){
  return <Tag {...props} className={`ov-painted-panel ${className}`}>{children}</Tag>;
}
