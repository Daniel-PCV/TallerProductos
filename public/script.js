const API = '/api/productos';

const $ = (s) => document.querySelector(s);

function rowHTML(p) {
  return `
    <tr>
      <td>${p.id}</td>
      <td>${escapeHtml(p.nombre)}</td>
      <td class="text-end">$${Number(p.precio).toFixed(2)}</td>
      <td>${escapeHtml(p.categoria ?? '')}</td>
      <td>
        <button class="btn btn-sm btn-outline-info me-1" onclick="editar(${p.id})">Editar</button>
        <button class="btn btn-sm btn-outline-danger" onclick="eliminar(${p.id})">Eliminar</button>
      </td>
    </tr>
  `;
}

function escapeHtml(s) {
  return (s ?? '').toString()
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}

async function listar(q = '') {
  try {
    const url = q ? `${API}?q=${encodeURIComponent(q)}` : API;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    const data = await res.json();
    $('#tbody').innerHTML = data.map(rowHTML).join('');
    

    if (data.length === 0) {
      $('#tbody').innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted py-4">
            ${q ? 'No se encontraron productos con ese criterio' : 'No hay productos registrados'}
          </td>
        </tr>
      `;
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
    $('#tbody').innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-danger py-4">
          Error al cargar productos: ${error.message}
        </td>
      </tr>
    `;
  }
}

$('#btn-buscar').addEventListener('click', () => {
  listar($('#buscar').value.trim());
});

$('#btn-limpiar').addEventListener('click', limpiarForm);

$('#form-producto').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = $('#btn-guardar');
  const originalText = submitBtn.textContent;
  
  try {
  
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';
    
    const id = $('#id').value || null;
    const body = {
      nombre: $('#nombre').value.trim(),
      precio: parseFloat($('#precio').value) || 0,
      categoria: ($('#categoria').value || '').toString().trim() || null
    };

    if (!body.nombre) {
      throw new Error('El nombre del producto es obligatorio');
    }
    if (!body.categoria) {
      throw new Error('La categoría del producto es obligatoria');
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API}/${id}` : API;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
      throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
    }


    limpiarForm();
    listar($('#buscar').value.trim());
    
 
    showNotification(`Producto ${id ? 'actualizado' : 'creado'} exitosamente`, 'success');
    
  } catch (error) {
    console.error('Error en operación:', error);
    showNotification(error.message, 'error');
  } finally {
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

function limpiarForm() {
  $('#id').value = '';
  $('#nombre').value = '';
  $('#precio').value = '';
  $('#categoria').value = '';
  $('#btn-guardar').textContent = 'Guardar';
}

window.editar = async (id) => {
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error('No se pudo cargar el producto');
    
    const p = await res.json();
    $('#id').value = p.id;
    $('#nombre').value = p.nombre;
    $('#precio').value = p.precio;
    $('#categoria').value = p.categoria ?? '';
    $('#btn-guardar').textContent = 'Actualizar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error al editar:', error);
    showNotification('No se pudo cargar el producto para editar', 'error');
  }
};

window.eliminar = async (id) => {
  if (!confirm('¿Eliminar este producto?')) return;
  
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    
    if (res.ok) {
      listar($('#buscar').value.trim());
      showNotification('Producto eliminado exitosamente', 'success');
    } else {
      throw new Error('No se pudo eliminar el producto');
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    showNotification('No se pudo eliminar el producto', 'error');
  }
};


function showNotification(message, type = 'info') {

  const notification = document.createElement('div');
  notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
  notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(notification);
  
 
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}


$('#buscar').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    listar($('#buscar').value.trim());
  }
});


document.addEventListener('DOMContentLoaded', () => {
  listar();
});