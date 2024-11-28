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

// Estado del formulario
const title = ref('');
const description = ref('');
const status = ref('Pending'); // Estado inicial

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
    const response = await fetch('http://localhost:4000/graphql', {
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

    if (!response.ok) throw new Error('Error al crear la tarea');

    const result = await response.json();
    console.log('Tarea creada:', result.data.createTask);

    // Limpiar el formulario
    title.value = '';
    description.value = '';
    status.value = 'Pending';

    // Redireccionar (opcional)
    alert('¡Tarea creada con éxito!');
  } catch (error) {
    console.error('Error creando la tarea:', error);
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