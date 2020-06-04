import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import useProductos from '../hooks/useProductos';
import DetallesProducto from '../components/layout/DetallesProducto';

const Buscar = () => {
  const router = useRouter();
  const {
    query: { q }
  } = router;

  // console.log(q); //porque asi lo pasamos desde el ui Buscar.js

  //todos los productos
  const { productos } = useProductos('creado');

  const [resultado, guardarResultado] = useState([]);

  useEffect(() => {
    //la busqueda
    const busqueda = q.toLowerCase();

    const filtro = productos.filter((producto) => {
      return (
        producto.nombe.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda)
      );
    });
    guardarResultado(filtro);
  }, [q, productos]);

  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <div className='bg-white'>
              {resultado.map((producto) => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Buscar;
