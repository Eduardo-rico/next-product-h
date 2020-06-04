export default function validarCrearProducto(valores) {
  let errores = {};
  //validar nombre del usuario
  if (!valores.nombre) {
    errores.nombre = 'El nombre es obligatorio';
  }

  //validar empresa
  if (!valores.empresa) {
    errores.empresa = 'El nombre de la empresa es obligatorio';
  }

  //validar url
  if (!valores.url) {
    errores.url = 'La url del producto es obligatoria';
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
    errores.url = 'URL mal formateada o no valida';
  }

  //validar descripcion
  if (!valores.descripcion) {
    errores.descripcion = 'Agrega una descripcion ';
  }

  return errores;
}
