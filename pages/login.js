import React, { useState } from 'react';
import Router from 'next/router';
import { css } from '@emotion/core';
import Layout from '../components/layout/Layout';
import {
  Formulario,
  Campo,
  InputSubmit,
  Error
} from '../components/ui/Formulario';
//validaciones
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';
//firebase
import firebase from '../firebase';

const STATE_INICIAL = {
  email: '',
  password: ''
};

const Login = () => {
  const [error, guardarError] = useState(false);

  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  async function iniciarSesion() {
    try {
      const usuario = await firebase.login(email, password);
      //guardar sesion del usuario con un hook nuevo y ponerlo en el provider
      Router.push('/');
    } catch (error) {
      console.error('hubo un error al autenticar el usuario', error.message);
      guardarError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
            Iniciar Sesión
          </h1>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                id='email'
                placeholder='email'
                name='email'
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor='password'>password</label>
              <input
                type='password'
                id='password'
                placeholder='password'
                name='password'
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type='submit' value='Iniciar Sesión' />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default Login;
