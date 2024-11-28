<template>
  <div>
    <h1>Crear Nueva Tarea</h1>
    <!-- Formulario para crear tareas -->
    <form @submit.prevent="createTask">
      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <input
          type="text"
          id="title"
          v-model="title"
          class="form-control"
          placeholder="Ingrese el título"
          required
        />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea
          id="description"
          v-model="description"
          class="form-control"
          placeholder="Ingrese la descripción"
          rows="3"
          required
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="status" class="form-label">Estado</label>
        <select v-model="status" id="status" class="form-select" required>
          <option value="Pending">Pending</option>
          <option value="InProgress">InProgress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Crear Tarea</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Importa el router para redirección

// Estado del formulario
const title = ref('');
const description = ref('');
const status = ref('Pending'); // Estado inicial

// Configuración del router
const router = useRouter();

// URL del servidor GraphQL (usando variables de entorno)
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

// Consulta GraphQL para crear tareas
const mutation = `
  mutation CreateTask($title: String!, $description: String!, $status: String!) {
    createTask(title: $title, description: $description, status: $status) {
      id
      title
      description
      status
    }
  }
`;

// Función para enviar la tarea al servidor
const createTask = async () => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: mutation,
        variables: {
          title: title.value,
          description: description.value,
          status: status.value,
        },
      }),
    });

    if (!response.ok) throw new Error('Error en la comunicación con el servidor');

    const result = await response.json();

    if (result.errors) {
      console.error('Errores en la respuesta:', result.errors);
      alert('Ocurrió un error al crear la tarea.');
      return;
    }

    console.log('Tarea creada:', result.data.createTask);

    // Limpiar el formulario
    title.value = '';
    description.value = '';
    status.value = 'Pending';

    // Mostrar mensaje y redirigir
    alert('¡Tarea creada con éxito!');
    router.push('/'); // Redirigir a la lista de tareas (opcional)
  } catch (error) {
    console.error('Error creando la tarea:', error);
    alert('Error al crear la tarea. Intente nuevamente.');
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

form {
  max-width: 500px;
  margin: 0 auto;
}

.mb-3 {
  margin-bottom: 1rem;
}
</style>
