import React, { useState, useEffect } from 'react';

//crear cuenta, crear producto, login
const useValidacion = (stateInicial, validar, fn) => {
  //
  const [valores, guardarValores] = useState(stateInicial);
  const [errores, guardarErrores] = useState({});
  const [submitForm, guardarSubmitForm] = useState(false);

  useEffect(() => {
    if (submitForm) {
      const noErrores = Object.keys(errores).length === 0;
      if (noErrores) {
        fn(); //es la funcion que se ejecuta en el componente crear cuenta, crear producto, login
      }
      guardarSubmitForm(false);
    }
  }, [errores]);

  //funcion que se ejecuta conforme el usuario escribe algo
  const handleChange = (e) => {
    guardarValores({
      ...valores,
      [e.target.name]: e.target.value
    });
  };

  //funcion que se ejecuta cuando hace submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
    guardarSubmitForm(true);
  };

  //cuando se realiza el evento de blur
  const handleBlur = () => {
    const erroresValidacion = validar(valores);
    guardarErrores(erroresValidacion);
  };

  return {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur
  };
  //los tres primeros son el state, los dos ultimos son las funciones de cambio y submit
};

export default useValidacion;
