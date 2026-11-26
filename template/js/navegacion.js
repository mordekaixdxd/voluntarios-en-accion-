
(function () {
  var CLAVE_SESION = 'emergencias_chile_session';

  // data-path del menú -> página real
  var RUTAS = {
    'explorar-emergencias': 'ExplorarEmergencia.html',
    'mis-emergencias': 'EmergenciasVoluntariado.html',
    'panel-organizacion': 'PanelOrganizacion.html',
    'publicar-emergencia': 'PublicarEmergencia.html',
    'portal-publico': 'InicioSesion.html',
    'registro-brigadista': 'RegistroVoluntario.html',
    'acceso-coordinacion': 'InicioSesion.html'
  };

  // Opciones del menú interno que dependen del rol
  var MENU_INTERNO = ['explorar-emergencias', 'mis-emergencias', 'panel-organizacion', 'publicar-emergencia'];
  var MENU_POR_ROL = {
    voluntario: ['explorar-emergencias', 'mis-emergencias'],
    organizacion: ['explorar-emergencias', 'panel-organizacion', 'publicar-emergencia']
  };

  // A qué opción del menú pertenece cada página (para marcarla activa)
  var SECCION_DE_PAGINA = {
    'ExplorarEmergencia.html': 'explorar-emergencias',
    'DetalleEmergencia.html': 'explorar-emergencias',
    'EmergenciasVoluntariado.html': 'mis-emergencias',
    'PerfilVoluntariado.html': 'mis-emergencias',
    'PanelOrganizacion.html': 'panel-organizacion',
    'GestionEmergencia.html': 'panel-organizacion',
    'PerfilOrganizacionl.html': 'panel-organizacion',
    'PublicarEmergencia.html': 'publicar-emergencia',
    'InicioSesion.html': 'portal-publico',
    'RegistroVoluntario.html': 'registro-brigadista',
    'RegistroOrganizacion.html': 'registro-brigadista'
  };

  function leerSesion() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_SESION) || 'null');
    } catch (e) {
      return null;
    }
  }

  var pagina = decodeURIComponent(location.pathname.split('/').pop() || 'index.html');
  var sesion = leerSesion();

  document.querySelectorAll('nav[data-active-classes]').forEach(function (nav) {
    var claseActiva = nav.getAttribute('data-active-classes');
    var enlaces = Array.prototype.slice.call(nav.querySelectorAll('a[data-path]'));
    var claseInactiva = '';
    enlaces.forEach(function (a) {
      if (!a.hasAttribute('aria-current') && !claseInactiva) claseInactiva = a.className;
    });
    var relleno = claseInactiva.split(' ').filter(function (c) {
      return c.indexOf('px-') === 0 || c.indexOf('py-') === 0;
    }).join(' ');

    enlaces.forEach(function (a) {
      var ruta = a.getAttribute('data-path');
      if (RUTAS[ruta]) a.setAttribute('href', RUTAS[ruta]);

      if (SECCION_DE_PAGINA[pagina] === ruta) {
        a.setAttribute('aria-current', 'page');
        a.className = relleno + ' transition-colors ' + claseActiva;
      } else {
        a.removeAttribute('aria-current');
        if (claseInactiva) a.className = claseInactiva;
      }

      if (sesion && MENU_POR_ROL[sesion.rol] &&
          MENU_INTERNO.indexOf(ruta) !== -1 &&
          MENU_POR_ROL[sesion.rol].indexOf(ruta) === -1) {
        a.style.display = 'none';
      }
    });
  });

  // Avatar del encabezado -> perfil, nombre de la sesión y botón de salir
  var avatar = document.querySelector('header img[alt="Profile"]');
  if (avatar && sesion) {
    var bloque = avatar.parentElement;
    var perfil = sesion.rol === 'organizacion' ? 'PerfilOrganizacionl.html' : 'PerfilVoluntariado.html';
    bloque.style.cursor = 'pointer';
    bloque.title = 'Ver mi perfil';
    bloque.addEventListener('click', function () { location.href = perfil; });

    var nombre = bloque.querySelector('span');
    if (nombre && sesion.userName) nombre.textContent = sesion.userName;

    var salir = document.createElement('button');
    salir.type = 'button';
    salir.textContent = 'Cerrar sesión';
    salir.className = 'ml-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-primary hover:bg-surface-container-high';
    salir.addEventListener('click', function (e) {
      e.stopPropagation();
      try { localStorage.removeItem(CLAVE_SESION); } catch (err) {}
      location.href = 'InicioSesion.html';
    });
    bloque.parentElement.appendChild(salir);
  }
})();
