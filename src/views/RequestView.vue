<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

interface Request {
  id: number;
  soilMoisture: number; // soil moisture %
  soilTemperature?: number | null; // soil temperature (nullable)
  measurementTime: string; // measurement time
  location?: string; // location
  note?: string; // note
  attachment?: string; // attachment link
  staffName: string; // staff name
  staffEmail: string;
  status: "pending" | "approved" | "rejected";
  isValveOpen: boolean;
}

const router = useRouter();
const toast = useToast();

const requests = ref<Request[]>([
  {
    id: 1,
    soilMoisture: 45.5,
    soilTemperature: 22.3,
    measurementTime: "2025-06-01T08:30",
    location: "Field A - Zone 3",
    note: "Stable moisture",
    attachment: "https://example.com/attachment1.pdf",
    staffName: "Nguyen Van A",
    staffEmail: "nguyenvana@example.com",
    status: "pending",
    isValveOpen: false,
  },
  {
    id: 2,
    soilMoisture: 38.2,
    soilTemperature: 20.1,
    measurementTime: "2025-06-02T09:15",
    location: "Field B - Zone 1",
    note: "Lower than usual moisture",
    attachment: "https://example.com/attachment2.pdf",
    staffName: "Tran Thi B",
    staffEmail: "tranthib@example.com",
    status: "approved",
    isValveOpen: false,
  },
  {
    id: 3,
    soilMoisture: 50.0,
    soilTemperature: null,
    measurementTime: "2025-06-03T07:45",
    location: "Field C - Zone 2",
    note: "",
    attachment: "",
    staffName: "Tran Van C",
    staffEmail: "tranvanc@example.com",
    status: "rejected",
    isValveOpen: false,
  },
]);

// Auto check soil moisture < 50% => turn valve ON
requests.value.forEach((req) => {
  if (req.soilMoisture < 50 && !req.isValveOpen) {
    req.isValveOpen = true;
    toast.info(
      `Soil moisture ${req.soilMoisture.toFixed(
        1
      )}% is below 50%. The irrigation valve has been automatically turned ON.`
    );
  }
});

const showDeleteModal = ref(false);
const requestToDelete = ref<Request | null>(null);

const showDetailModal = ref(false);
const requestDetail = ref<Request | null>(null);

const navigateToCreateRequest = () => {
  router.push("/create-soil-moisture");
};

const navigateToEditRequest = (id: number) => {
  router.push(`/edit-soil-moisture/${id}`);
};

const confirmDelete = (request: Request) => {
  requestToDelete.value = request;
  showDeleteModal.value = true;
};

const deleteRequest = () => {
  if (requestToDelete.value) {
    requests.value = requests.value.filter(
      (req) => req.id !== requestToDelete.value?.id
    );
    toast.success("Data deleted successfully!");
    closeDeleteModal();
  }
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  requestToDelete.value = null;
};

const openDetailModal = (request: Request) => {
  requestDetail.value = request;
  showDetailModal.value = true;
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  requestDetail.value = null;
};

const toggleValve = (request: Request) => {
  request.isValveOpen = !request.isValveOpen;
  toast.success(
    `Irrigation valve has been ${
      request.isValveOpen ? "turned ON" : "turned OFF"
    }.`
  );
};
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <header class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Soil Moisture Data</h1>
      <button
        @click="navigateToCreateRequest"
        class="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg shadow transition"
      >
        Add New Data
      </button>
    </header>

    <!-- Request List -->
    <section>
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Data List</h2>
      <div class="overflow-x-auto">
        <table
          class="min-w-full border border-gray-200 rounded-lg overflow-hidden"
        >
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-2 text-left">#</th>
              <th class="px-4 py-2 text-left">Staff</th>
              <th class="px-4 py-2 text-left">Soil Moisture (%)</th>
              <th class="px-4 py-2 text-left">Valve</th>
              <th class="px-4 py-2 text-left">Attachment</th>
              <th class="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="request in requests"
              :key="request.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ request.id }}</td>
              <td class="px-4 py-2 font-medium">{{ request.staffName }}</td>
              <td class="px-4 py-2">{{ request.soilMoisture.toFixed(1) }}</td>

              <!-- Switch Valve -->
              <td class="px-4 py-2">
                <button
                  @click="toggleValve(request)"
                  :class="[
                    'px-4 py-1 rounded font-semibold text-white',
                    request.isValveOpen ? 'bg-green-600' : 'bg-gray-400',
                  ]"
                >
                  {{ request.isValveOpen ? "ON" : "OFF" }}
                </button>
              </td>

              <td class="px-4 py-2">
                <a
                  v-if="request.attachment"
                  :href="request.attachment"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  Download
                </a>
                <span v-else class="text-gray-400 italic">None</span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                <button
                  @click="openDetailModal(request)"
                  class="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white px-3 py-1 rounded-md text-sm shadow"
                >
                  Details
                </button>

                <button
                  v-if="request.status === 'pending'"
                  @click="navigateToEditRequest(request.id)"
                  class="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm shadow ml-2"
                >
                  Edit
                </button>

                <button
                  @click="confirmDelete(request)"
                  class="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded-md text-sm shadow ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 flex items-center justify-center bg-black/50"
    >
      <div class="bg-white rounded-lg shadow-lg w-96 p-6 max-w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Measurement Details</h3>
        <div class="space-y-2 text-gray-700">
          <p><strong>Staff:</strong> {{ requestDetail?.staffName }}</p>
          <p><strong>Email:</strong> {{ requestDetail?.staffEmail }}</p>
          <p>
            <strong>Measurement Time:</strong>
            {{
              new Date(requestDetail?.measurementTime || "").toLocaleString()
            }}
          </p>
          <p>
            <strong>Location:</strong>
            {{ requestDetail?.location || "None" }}
          </p>
          <p><strong>Note:</strong> {{ requestDetail?.note || "None" }}</p>
          <p>
            <strong>Soil Moisture:</strong>
            {{ requestDetail?.soilMoisture.toFixed(1) }}%
          </p>
          <p
            v-if="
              requestDetail?.soilTemperature !== null &&
              requestDetail?.soilTemperature !== undefined
            "
          >
            <strong>Soil Temperature:</strong>
            {{ requestDetail?.soilTemperature.toFixed(1) }}°C
          </p>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="closeDetailModal"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 flex items-center justify-center bg-black/50"
    >
      <div class="bg-white rounded-lg shadow-lg w-96 p-6 max-w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
        <p class="mb-6">
          Are you sure you want to delete the data measured by
          <span class="font-bold">{{ requestToDelete?.staffName }}</span> at
          <span class="font-semibold">{{
            new Date(requestToDelete?.measurementTime || "").toLocaleString()
          }}</span
          >?
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="closeDeleteModal"
            class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="deleteRequest"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
