import React, { useState } from 'react';

function RadioButtonGroup(options: { [key:string]: string }, 
  onChange: (s: string) => string, 
  name: string,
  value: string
): JSX.Element 
{
  const [selectedValue, setSelectedValue] = useState(options.value);

  console.log(options)
  console.log(Object.entries(options.options))
  
  return (
    <div>
      {
        Object.entries(options.options).map((k) => {
          return <>
            <input
              type="radio"
              name={name}
              value={k[0]}
              checked={selectedValue === k[0]}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSelectedValue(event.target.value);
                options.onChange(event.target.value);
              }}
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