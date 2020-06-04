import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

import { Campo, InputSubmit } from '../../components/ui/Formulario';

import { FirebaseContext } from '../../firebase';

import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import Boton from '../../components/ui/Boton';

const CreadorProducto = styled.p`
  padding: 0.5rem 2rem;
  background-color: #da552f;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: centar;
`;

const ContenedorProducto = styled.div`
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`;

const Producto = (props) => {
  //state del componente
  const [producto, guardarProducto] = useState({});
  const [error, guardarError] = useState(false);
  const [comentario, guardarComentario] = useState({});
  const [consultarDB, guardarConsultarDB] = useState(true);
  //routing para obtener el id de la url actual
  const router = useRouter(); //aqui esta query: {id: 2934809234823094820384}
  const {
    query: { id }
  } = router;

  //context de firebase
  const { firebase, usuario } = useContext(FirebaseContext);

  useEffect(() => {
    if (id && consultarDB) {
      const obtenerProducto = async () => {
        const productoQuery = await firebase.db.collection('productos').doc(id);
        const producto = await productoQuery.get();
        if (producto.exists) {
          guardarProducto(producto.data());
          guardarConsultarDB(false);
        } else {
          guardarError(true);
          guardarConsultarDB(false);
        }
      };

      obtenerProducto();
    }
  }, [id]);

  if (Object.keys(producto).length === 0 && !error) return 'Cargamdo';

  const {
    comentarios,
    creado,
    descripcion,
    empresa,
    nombre,
    url,
    urlimagen,
    votos,
    creador,
    haVotado
  } = producto;

  //administrar y validar los votos
  const votarProducto = () => {
    if (!usuario) {
      return router.push('/login');
    }

    //obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //verificar si el usuario actual ha votado
    if (haVotado.includes(usuario.uid)) return null;

    //guardar id del usuario que ha votado
    const nuevoHaVotado = [...haVotado, usuario.uid];
    console.log(usuario.uid);

    //actualizar en db
    firebase.db
      .collection('productos')
      .doc(id)
      .update({ votos: nuevoTotal, haVotado: nuevoHaVotado });
    //actualizar el state
    guardarProducto({
      ...producto,
      votos: nuevoTotal,
      haVotado: nuevoHaVotado
    });
    guardarConsultarDB(true); // hay un voto por lo tanto se consulta a db
    // console.log(nuevoTotal);
  };

  //funciones para crear comentarios
  const comentarioChange = (e) => {
    guardarComentario({
      ...comentario,
      [e.target.name]: e.target.value
    });
  };

  const agregarComentario = (e) => {
    e.preventDefault();
    if (!usuario) {
      return router.push('/login');
    }
    //informacion extra al comentario:
    comentario.usuarioId = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //tomar copia de comentario y agregarlos al arreglo
    const nuevosComentarios = [...comentarios, comentario];

    //actualizar la db
    firebase.db.collection('productos').doc(id).update({
      comentarios: nuevosComentarios
    });
    //actualizar state
    guardarProducto({
      ...producto,
      comentarios: nuevosComentarios
    });
    guardarConsultarDB(true);
  };

  //IDENTIFICA SI EL COMENTARIO ES DEL CREADOR DEL PRODUCTO
  const esCreador = (id) => {
    if (creador.id === id) {
      return true;
    }
  };

  //FUNCION QUE REVISA QUE EL CREADOR DEL PRODUCTO ES EL MISMO QUE ESTA AUTENTICADO
  const puedeBorrar = () => {
    if (!usuario) return false;

    if (creador.id === usuario.uid) {
      return true;
    }
  };

  //elimina producto de db
  const eliminarProducto = async () => {
    if (!usuario) {
      return router.push('/login');
    }

    if (creador.id !== usuario.uid) {
      return router.push('/');
    }
    try {
      await firebase.db.collection('productos').doc(id).delete();
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <>
        {error ? (
          <Error404 />
        ) : (
          <div
            css={css`
              max-width: 1200px;
              width: 95%;
              padding: 5rem 0;
              margin: 0 auto;
            `}
          >
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >
              {nombre}
            </h1>

            <ContenedorProducto>
              <div>
                <p>
                  Publicado:{' '}
                  {formatDistanceToNow(new Date(creado), { locale: es })}
                </p>
                <p>
                  Publicado por: {creador.nombre} - {empresa}
                </p>
                <img src={urlimagen} />
                <p>{descripcion}</p>

                {usuario && (
                  <>
                    <h2>Agrega tu comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input
                          type='text'
                          name='mensaje'
                          onChange={comentarioChange}
                        />
                      </Campo>

                      <InputSubmit type='submit' value='Agregar Comentario' />
                    </form>
                  </>
                )}

                <h2
                  css={css`
                    margin: 2rem 0;
                  `}
                >
                  Comentarios
                </h2>
                {comentarios.length === 0 ? (
                  'No hay comentarios aun'
                ) : (
                  <ul>
                    {comentarios.map((comentario, i) => (
                      <li
                        key={`${comentario.usuarioId}-${i}`}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 2rem;
                        `}
                      >
                        <p>{comentario.mensaje}</p>
                        <p>
                          Escrito por: {'  '}
                          <span
                            css={css`
                              font-weight: bold;
                            `}
                          >
                            {comentario.usuarioNombre}
                          </span>
                        </p>
                        {esCreador(comentario.usuarioId) && (
                          <CreadorProducto>Es Creador</CreadorProducto>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside>
                <Boton target='_blank' bgColor='true' href={url}>
                  Visitar URL
                </Boton>

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  {usuario && <Boton onClick={votarProducto}>¡¡Votar!!</Boton>}
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >
                    {votos} Votos!
                  </p>
                </div>
              </aside>
            </ContenedorProducto>

            {puedeBorrar() && (
              <Boton onClick={eliminarProducto}>Eliminar producto</Boton>
            )}
          </div>
        )}
      </>
    </Layout>
  );
};

export default Producto;
