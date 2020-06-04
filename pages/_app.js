//este archivo crea cosas sobre el layout
//se coloca el context
import App from 'next/app'; //App lo usa por defecto next
import firebase, { FirebaseContext } from '../firebase';
//autenticacion
import useAutenticacion from '../hooks/useAutenticacion';

const MyApp = (props) => {
  const usuario = useAutenticacion();

  const { Component, pageProps } = props;

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        usuario
      }}
    >
      <Component {...pageProps} />
    </FirebaseContext.Provider>
  );
};

export default MyApp;
