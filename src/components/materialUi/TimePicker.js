/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


export default function TimePickers(props) {
  let [time, setTime] = useState(props.defaultValue);

    const classes = makeStyles((theme) => ({
        container: {
          display: 'flex',
          flexWrap: 'wrap',
        },
        textField: {
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          width: 100,
        },
      }))();
  
    return (
      <form className={classes.container} noValidate>
        <TextField
          id={props.id}
          label={props.label}
          type="time"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          onChange={(e) => {
            setTime(e.target.value)
            props.onChange(e);
          }}
          value={time}
        />
      </form>
    );
  }