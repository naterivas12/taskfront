<template>
  <div>
    <h1>Lista de Tareas</h1>
    <ul class="grid">
      <li v-for="task in tasks" :key="task.id">
        <Card :task="task" @updateTask="updateTask" @deleteTask="deleteTask" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import Card from '~/components/Card.vue';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string; // Puede ser "Pending", "InProgress", "Completed"
}

// Variables de entorno para la URL del servidor
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT;

// Query para obtener las tareas
const query = `
  query GetTasks {
    tasks {
      id
      title
      description
      status
    }
  }
`;

// Mutación para eliminar una tarea
const deleteMutation = `
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
    }
  }
`;

// Estado reactivo de las tareas
const tasks = ref<Task[]>([]);

// Obtener las tareas desde el servidor
onMounted(async () => {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener tareas');
    }

    const result = await response.json();
    tasks.value = result.data?.tasks || [];
    console.log('Tareas obtenidas:', tasks.value);
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
});

// Función para actualizar una tarea
const updateTask = (updatedTask: Task) => {
  const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = updatedTask;
    console.log(`Tarea actualizada:`, updatedTask);
  }
};

// Función para eliminar una tarea del servidor y del estado local
const deleteTask = async (taskId: string) => {
  try {
    // Enviar mutación para eliminar la tarea
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: deleteMutation,
        variables: { id: taskId },
      }),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar la tarea');
    }

    const result = await response.json();

    // Verificar si la tarea fue eliminada exitosamente
    if (result.data?.deleteTask?.id) {
      // Actualizar el estado local
      tasks.value = tasks.value.filter((task) => task.id !== taskId);
      console.log(`Tarea eliminada con ID: ${taskId}`);
    } else {
      throw new Error('Error en la respuesta del servidor al eliminar la tarea');
    }
  } catch (error) {
    console.error('Error eliminando la tarea:', error);
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 2rem;
}

h1 {
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2rem;
}
</style>
