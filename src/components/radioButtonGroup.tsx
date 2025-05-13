import React, { useState } from 'react';

function RadioButtonGroup(options: { [key:string]: string }, 
  onChange: React.ChangeEventHandler<HTMLInputElement>, 
  name: string
): JSX.Element 
{
  const [selectedValue, setSelectedValue] = useState('');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event)
    setSelectedValue(event.target.value);
    //onChange(event.target.value);
  };
  console.log(options)
  console.log(Object.entries(options.options))
  
  return (
    <div>
      {
        Object.entries(options.options).forEach((k) => {
          <>
            <input
              type="radio"
              name={name}
              value={k[0]}
              checked={selectedValue === k[0]}
              onChange={handleRadioChange}
            />
            <label key={k[0]}>
              {k[1]}
            </label>
          </>
        })
          
       }
    </div>
  );
}

export default RadioButtonGroup;