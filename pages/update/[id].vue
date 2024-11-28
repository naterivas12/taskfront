<template>
  <div class="edit-task">
    <h1>Editar Tarea</h1>
    <form @submit.prevent="updateTask">
      <div class="mb-3">
        <label for="title" class="form-label">Título</label>
        <input
          v-model="task.title"
          type="text"
          class="form-control"
          id="title"
          placeholder="Escribe el título de la tarea"
          required
          :disabled="loading"
        />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Descripción</label>
        <textarea
          v-model="task.description"
          class="form-control"
          id="description"
          rows="3"
          placeholder="Escribe la descripción de la tarea"
          required
          :disabled="loading"
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="status" class="form-label">Estado</label>
        <select v-model="task.status" id="status" class="form-select" required :disabled="loading">
          <option value="Pending">Pendiente</option>
          <option value="InProgress">En Progreso</option>
          <option value="Completed">Completada</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">Actualizar</button>
      <button @click="cancelEdit" type="button" class="btn btn-secondary ms-2" :disabled="loading">
        Cancelar
      </button>
    </form>
    <p v-if="loading" class="text-center mt-3">Cargando...</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Estado para la tarea
const task = ref({
  title: '',
  description: '',
  status: 'Pending',
});

// Estado de carga
const loading = ref(false);

// Router y ruta actual
const router = useRouter();
const route = useRoute();

// URL del servidor desde variables de entorno
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

// Cargar la tarea según el ID
const fetchTask = async (id: string) => {
  loading.value = true;
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetTask($id: ID!) {
            task(id: $id) {
              id
              title
              description
              status
            }
          }
        `,
        variables: { id },
      }),
    });

    const result = await response.json();
    if (result.data?.task) {
      task.value = result.data.task;
    } else {
      console.error('Tarea no encontrada');
      alert('Error: La tarea no fue encontrada.');
    }
  } catch (error) {
    console.error('Error al obtener la tarea:', error);
    alert('Error al cargar la tarea. Por favor, inténtelo nuevamente.');
  } finally {
    loading.value = false;
  }
};

// Actualizar la tarea
const updateTask = async () => {
  loading.value = true;
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation UpdateTask($id: ID!, $title: String!, $description: String!, $status: String!) {
            updateTask(id: $id, title: $title, description: $description, status: $status) {
              id
              title
              description
              status
            }
          }
        `,
        variables: {
          id: route.params.id,
          title: task.value.title,
          description: task.value.description,
          status: task.value.status,
        },
      }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error('Errores en la respuesta:', result.errors);
      alert('Error al actualizar la tarea.');
    } else {
      console.log('Tarea actualizada:', result.data.updateTask);
      alert('¡Tarea actualizada con éxito!');
      router.push('/');
    }
  } catch (error) {
    console.error('Error en la mutación de actualización:', error);
    alert('Error al actualizar la tarea. Por favor, inténtelo nuevamente.');
  } finally {
    loading.value = false;
  }
};

// Cancelar y volver a la lista de tareas
const cancelEdit = () => {
  router.push('/');
};

// Cargar la tarea cuando el componente se monta
onMounted(() => {
  const taskId = route.params.id;
  if (typeof taskId === 'string') {
    fetchTask(taskId);
  }
});
</script>

<style scoped>
.edit-task {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.text-center {
  text-align: center;
}
</style>