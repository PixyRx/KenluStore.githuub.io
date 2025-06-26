
const productos = {
  "Orejas de Lobo": 20,
  "Orejas de Conejo": 30,
  "Orejas de Gato": 20,
  "Orejas de Gato Amarillo": 20,
  "Orejas de Zorro": 20
};


function agregarAlCarrito(nombre) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(nombre);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${nombre} añadido al carrito`);
}


function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("lista-carrito");
  const totalSpan = document.getElementById("total");

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach((nombre, index) => {
    const precio = productos[nombre] || 0;
    total += precio;

    const item = document.createElement("div");
    item.innerHTML = `
      <p>${nombre} - Bs. ${precio} 
        <button onclick="eliminarDelCarrito(${index})" class="btn btn-sm btn-danger ms-2">X</button>
      </p>
    `;
    contenedor.appendChild(item);
  });

  totalSpan.textContent = `Bs. ${total}`;
}

function eliminarDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function mostrarPago(metodo) {
  const qrImg = document.getElementById("imagen-qr");
  const efectivoBox = document.getElementById("efectivo-box");

  qrImg.style.display = metodo === "qr" ? "block" : "none";
  efectivoBox.style.display = metodo === "efectivo" ? "block" : "none";
}
function filtrarProductos() {
  const filtro = document.getElementById("busqueda").value.toLowerCase();
  const productos = document.querySelectorAll(".product-box");

  productos.forEach(producto => {
    const texto = producto.textContent.toLowerCase();
    producto.style.display = texto.includes(filtro) ? "inline-block" : "none";
  });
}
function enviarPedido() {
  const nombre = document.querySelector('[placeholder="Nombre"]').value;
  const apellidos = document.querySelector('[placeholder="Apellidos"]').value;
  const celular = document.querySelector('[placeholder="Número de celular"]').value;
  const provincia = document.querySelector('[placeholder="Provincia"]').value;
  const ciudad = document.querySelector('[placeholder="Ciudad"]').value;
  const direccion = document.querySelector('[placeholder="Dirección"]').value;
  const referencia = document.querySelector('[placeholder="Referencia"]').value;
  const efectivo = document.querySelector('[placeholder="Monto en efectivo"]')?.value || "";

  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const total = carrito.reduce((acc, nombre) => acc + (productos[nombre] || 0), 0);
  const listaProductos = carrito.map(p => `- ${p}`).join("%0A");

  let mensaje = `Pedido Kelu Store%0A%0A`;
  mensaje += `Nombre: ${nombre} ${apellidos}%0ACelular: ${celular}%0AProvincia: ${provincia}%0ACiudad: ${ciudad}%0ADirección: ${direccion}%0AReferencia: ${referencia}%0A%0A`;
  mensaje += `🛒 Productos:%0A${listaProductos}%0A%0ATotal: Bs. ${total}`;

  if (document.getElementById("imagen-qr").style.display === "block") {
    mensaje += "%0AMétodo de pago: QR";
  } else if (document.getElementById("efectivo-box").style.display === "block") {
    mensaje += `%0AMétodo de pago: Efectivo (monto entregado: Bs. ${efectivo})`;
  } else {
    mensaje += "%0AMétodo de pago: Tarjeta de crédito";
  }

  const numero = "59177550083";
  const url = `https://wa.me/${numero}?text=${mensaje}`;
  window.open(url, "_blank");
}