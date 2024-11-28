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
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="status" class="form-label">Estado</label>
        <select v-model="task.status" id="status" class="form-select" required>
          <option value="Pending">Pendiente</option>
          <option value="InProgress">En Progreso</option>
          <option value="Completed">Completada</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Actualizar</button>
      <button @click="cancelEdit" type="button" class="btn btn-secondary ms-2">Cancelar</button>
    </form>
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

// Router y ruta actual
const router = useRouter();
const route = useRoute();

// Cargar la tarea según el ID
const fetchTask = async (id: string) => {
  try {
    const response = await fetch('http://localhost:4000/graphql', {
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
    }
  } catch (error) {
    console.error('Error al obtener la tarea:', error);
  }
};

// Actualizar la tarea
const updateTask = async () => {
  try {
    const response = await fetch('http://localhost:4000/graphql', {
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
    if (result.data?.updateTask) {
      console.log('Tarea actualizada:', result.data.updateTask);
      router.push('/');
    } else {
      console.error('Error al actualizar la tarea');
    }
  } catch (error) {
    console.error('Error en la mutación de actualización:', error);
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
</style>