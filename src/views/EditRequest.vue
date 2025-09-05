<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

interface Request {
  id: number;
  title: string;
  status: string;
  deadline: string;
  attachment: string;
  staffEmail: string;
}

const route = useRoute();
const router = useRouter();
const toast = useToast();

const requests = ref<Request[]>([
  {
    id: 1,
    title: "Request for Budget Approval",
    deadline: "2025-01-15",
    attachment: "budget_approval.pdf",
    staffEmail: "ductv.21it@vku.udn.vn",
  },
  {
    id: 2,
    title: "Team Expansion Proposal",
    deadline: "2025-01-10",
    attachment: "team_expansion.pdf",
    staffEmail: "ductv.21it@vku.udn.vn",
  },
  {
    id: 3,
    title: "Office Equipment Request",
    deadline: "2025-01-12",
    attachment: "equipment_request.pdf",
    staffEmail: "ductv.21it@vku.udn.vn",
  },
]);

const requestId = Number(route.params.id);

const currentRequest = ref<Request | null>(
  requests.value.find((req) => req.id === requestId) || null
);

if (!currentRequest.value) {
  alert("Request not found!");
  router.push("/requests");
}

const saveRequest = () => {
  if (currentRequest.value) {
    const index = requests.value.findIndex((req) => req.id === requestId);
    if (index !== -1) {
      requests.value[index] = { ...currentRequest.value };
    }
    toast.success("Request saved successfully!");
    router.push("/requests");
  }
};

const cancelEdit = () => {
  router.push("/requests");
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Edit Request</h1>

    <div v-if="currentRequest" class="space-y-4">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input
          v-model="currentRequest.title"
          type="text"
          class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Deadline -->
      <div>
        <label class="block text-sm font-medium mb-1">Deadline</label>
        <input
          v-model="currentRequest.deadline"
          type="date"
          class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Staff Email -->
      <div>
        <label class="block text-sm font-medium mb-1">Staff Email</label>
        <input
          v-model="currentRequest.staffEmail"
          type="email"
          class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
        />
      </div>

      <!-- Attachment -->
      <div>
        <label class="block font-semibold mb-1">Attachment</label>
        <input
          type="file"
          @change="handleFileUpload"
          class="w-full border rounded-lg p-2"
        />
        <p class="text-sm text-gray-600 mt-1">
          Current: {{ currentRequest.attachment }}
        </p>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-3 mt-6">
        <button
          @click="cancelEdit"
          class="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          @click="saveRequest"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>
