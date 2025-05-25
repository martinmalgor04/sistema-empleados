# ElderCare - Manual de Usuario

## 🚀 Inicio Rápido

### 1. **Acceso al Sistema**
- **URL:** http://localhost:3000
- **Credenciales de prueba:**
  - Email: `test@example.com`
  - Contraseña: `password`
  - Rol: Supervisor (acceso completo)

### 2. **Primera Vez en el Sistema**
1. Inicia sesión con las credenciales de prueba
2. Explora el sidebar izquierdo para ver las opciones disponibles
3. Haz clic en el icono de colapsar/expandir para optimizar el espacio
4. Cambia entre tema claro/oscuro usando el botón en la esquina superior derecha

---

## 👥 Guías por Rol

## 🔰 **SUPERVISOR** (Acceso Completo)

### 📋 **Gestión de Empleados**
1. **Ver Empleados:** Clic en "Empleados" en el sidebar
2. **Buscar:** Usa la barra de búsqueda por nombre o DNI
3. **Filtrar:** Selecciona filtros por rol o estado
4. **Ver Detalles:** Clic en cualquier empleado para ver su perfil completo
5. **Nuevo Empleado:** Botón "Agregar Empleado" → completar formulario

### ⏰ **Control de Asistencia**
1. **Tu Asistencia:** "Reg. Asistencia" → registrar entrada/salida
2. **Reportes:** Ver estadísticas de asistencia de todo el personal
3. **Seguimiento:** Monitorear ausencias y tardanzas

### 💊 **Medicamentos**
1. **Inventario:** "Medicamentos" → ver stock disponible
2. **Alertas:** Revisar medicamentos con stock bajo (marca roja/amarilla)
3. **Pedidos:** Crear pedidos automáticos para stock bajo
4. **Estadísticas:** Ver pestaña "Estadísticas" para análisis de consumo

### 🛒 **Compras** (En desarrollo)
1. **Registrar:** Documentar compras por área/categoría
2. **Historial:** Consultar gastos anteriores
3. **Reportes:** Analizar tendencias de gasto

---

## 🩺 **ENFERMERO**

### 💊 **Gestión de Medicamentos**
1. **Stock Diario:** Revisar "Medicamentos" para ver disponibilidad
2. **Más Frecuentes:** Sección superior muestra medicamentos de uso regular
3. **Alertas:** Prestar atención a indicadores de stock bajo
4. **Categorías:** Usar pestañas para filtrar por estado (stock/faltantes/pedidos)

### ⏰ **Mi Asistencia**
1. **Entrada:** "Reg. Asistencia" → seleccionar "Entrada" → hora
2. **Salida:** Mismo proceso pero seleccionar "Salida"
3. **Validación:** El sistema valida horarios lógicos automáticamente

### 👥 **Consulta de Personal**
- **Ver Lista:** "Empleados" → consulta de información básica
- **Sin edición:** Solo lectura de datos de otros empleados

---

## 👨‍⚕️ **MÉDICO**

### 💊 **Consulta de Medicamentos**
1. **Disponibilidad:** Ver qué medicamentos están disponibles
2. **Proveedores:** Consultar información de proveedores
3. **Estadísticas:** Revisar tendencias de uso

### ⏰ **Registro Personal**
- **Asistencia:** Registrar entrada/salida personal
- **Horarios:** Respetar validaciones del sistema

---

## 👨‍🦳 **CUIDADORA**

### ⏰ **Registro Básico**
1. **Asistencia Personal:** Única función principal
2. **Entrada/Salida:** Proceso simple de registro de horarios
3. **Validaciones:** Sistema previene errores automáticamente

---

## 🔧 Funciones Transversales

### 🎨 **Personalización**
- **Tema:** Botón superior derecho para cambiar entre claro/oscuro
- **Sidebar:** Botón de chevrones para colapsar/expandir menú
- **Navegación:** Móvil = menú hamburguesa, Desktop = sidebar fijo

### 🔍 **Búsqueda y Filtros**
- **Empleados:** Barra de búsqueda + filtros por rol/estado
- **Medicamentos:** Pestañas por categoría + búsqueda por nombre
- **Tiempo Real:** Resultados actualizados mientras escribes

### 📱 **Responsive**
- **Móvil:** Menú hamburguesa, cards apiladas, formularios optimizados
- **Tablet:** Layout híbrido adaptativo
- **Desktop:** Sidebar fijo, tablas completas, múltiples columnas

---

## ❗ Resolución de Problemas

### 🔐 **Problemas de Login**
- **Error "Usuario no registrado":** Verificar email exacto
- **Contraseña incorrecta:** Usar "password" para cuenta de prueba
- **Pantalla en blanco:** Verificar que JavaScript esté habilitado

### 🔄 **Problemas de Navegación**
- **Sidebar no aparece:** Recargar página (F5)
- **Botones no responden:** Verificar conexión a internet
- **Datos no aparecen:** Limpiar caché del navegador

### 📊 **Problemas de Datos**
- **Lista vacía:** Datos pueden estar cargando, esperar 2-3 segundos
- **Búsqueda sin resultados:** Verificar ortografía o usar menos filtros
- **Formulario no envía:** Completar todos los campos requeridos (*)

### 🎨 **Problemas de Interfaz**
- **Tema no cambia:** Verificar que el botón esté en la esquina superior derecha
- **Layout roto:** Probar en navegador actualizado (Chrome/Firefox/Safari)
- **Móvil mal:** Rotar dispositivo o usar navegador completo

---

## 📞 Soporte Técnico

### 🆘 **Contacto Inmediato**
- **Desarrollador:** Martin Malgor
- **Email:** martinmalgor@example.com
- **Repositorio:** GitHub - sistema-empleados

### 🔧 **Información del Sistema**
- **Versión:** ElderCare v1.0
- **Navegadores soportados:** Chrome, Firefox, Safari, Edge (últimas 2 versiones)
- **Dispositivos:** Móvil, tablet, desktop
- **Resolución mínima:** 320px de ancho

### 📋 **Al Reportar Problemas**
1. **Descripción:** Qué estabas intentando hacer
2. **Error:** Mensaje exacto que aparece
3. **Navegador:** Cuál estás usando y versión
4. **Pasos:** Cómo reproducir el problema
5. **Pantalla:** Screenshot si es posible

---

## 🎓 Tips y Mejores Prácticas

### ⚡ **Eficiencia**
- **Atajos:** Usa la búsqueda en lugar de scroll largo
- **Filtros:** Combina filtros para encontrar información específica
- **Favoritos:** Guarda el sitio como favorito para acceso rápido

### 🛡️ **Seguridad**
- **Sesión:** El sistema cierra sesión automáticamente por seguridad
- **Datos:** Información sensible protegida por roles
- **Logout:** Siempre cerrar sesión en computadoras compartidas

### 📱 **Móvil**
- **Orientación:** Rotar para mejor experiencia en formularios
- **Zoom:** Pellizcar para hacer zoom en tablas grandes
- **Scroll:** Deslizar horizontalmente en tablas anchas

---

*Manual actualizado para ElderCare v1.0 - Mayo 2025* 