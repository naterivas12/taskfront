<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ task.title }}</h5>
      <p class="card-text">{{ task.description }}</p>
      <span :class="statusClass" class="badge">{{ task.status }}</span>
      <div class="actions">
        <button @click="editTask" class="btn btn-sm btn-primary">Editar</button>
        <button @click="deleteTask" class="btn btn-sm btn-danger">Eliminar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { useRouter } from 'vue-router'; 

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['deleteTask']);

const router = useRouter();

const statusClass = computed(() => {
  switch (props.task.status) {
    case 'Pending':
      return 'badge-warning'; 
    case 'InProgress':
      return 'badge-info'; 
    case 'Completed':
      return 'badge-success'; 
    default:
      return 'badge-secondary'; 
  }
});

// Función para redirigir a la vista de edición
const editTask = () => {
  router.push(`/update/${props.task.id}`);
};

// Función para eliminar una tarea
const deleteTask = () => {
  emit('deleteTask', props.task.id);
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions {
  margin-top: 1rem;
}

.badge-warning {
  background-color: #ffc107;
  color: #fff;
}

.badge-info {
  background-color: #17a2b8;
  color: #fff;
}

.badge-success {
  background-color: #28a745;
  color: #fff;
}

.badge-secondary {
  background-color: #6c757d;
  color: #fff;
}
</style>