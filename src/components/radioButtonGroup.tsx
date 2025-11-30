import React, { useState } from 'react';

function RadioButtonGroup(options: { [key:string]: string }, 
  onChange: (s: string) => string, 
  name: string,
  value: string
): JSX.Element 
{
  const [selectedValue, setSelectedValue] = useState(options.value);

  const styles = options.styles ?? {"display": "grid"}
  
  return (
    <div>
      {
        Object.entries(options.options).map((k) => {
          return <div 
            key={k[0]}
          >
            <label>
              <input
                type="radio"
                name={options.name}
                value={k[0]}
                checked={selectedValue === k[0]}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSelectedValue(event.target.value);
                  options.onChange(event.target.value);
                }}
              />
              {k[1]}
            </label>
          </div>
        })
          
       }
    </div>
  );
}

export default RadioButtonGroup;