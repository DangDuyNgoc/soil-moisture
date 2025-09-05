<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const router = useRouter();
const toast = useToast();

const soilMoisture = ref<number | null>(null);
const soilTemperature = ref<number | null>(null);
const measurementTime = ref<string>("");
const location = ref<string>("");
const note = ref<string>("");
const attachment = ref<File | null>(null);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    attachment.value = target.files[0];
  } else {
    attachment.value = null;
  }
};

const saveData = () => {
  if (
    soilMoisture.value === null ||
    soilMoisture.value < 0 ||
    soilMoisture.value > 100
  ) {
    toast.error("Please enter a valid soil moisture value (0-100%).");
    return;
  }
  if (!measurementTime.value) {
    toast.error("Please select a measurement time.");
    return;
  }

  const data = {
    id: Date.now(),
    soilMoisture: soilMoisture.value,
    soilTemperature: soilTemperature.value,
    measurementTime: measurementTime.value,
    location: location.value.trim(),
    note: note.value.trim(),
    attachment: attachment.value,
  };

  toast.success("Data has been saved successfully!");

  // Reset form
  soilMoisture.value = null;
  soilTemperature.value = null;
  measurementTime.value = "";
  location.value = "";
  note.value = "";
  attachment.value = null;

  router.push("/soil-moisture-records");
};

const cancel = () => {
  router.push("/soil-moisture-records");
};
</script>

<template>
  <div class="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
    <h1 class="text-2xl font-bold text-center mb-6">
      Enter Soil Moisture Data
    </h1>

    <form @submit.prevent="saveData" class="space-y-4">
      <!-- Soil Moisture -->
      <div>
        <label for="soilMoisture" class="block font-semibold mb-1">
          Soil Moisture (%) <span class="text-red-500">*</span>
        </label>
        <input
          id="soilMoisture"
          v-model.number="soilMoisture"
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="Enter soil moisture"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          required
        />
      </div>

      <!-- Soil Temperature -->
      <div>
        <label for="soilTemperature" class="block font-semibold mb-1">
          Soil Temperature (°C)
        </label>
        <input
          id="soilTemperature"
          v-model.number="soilTemperature"
          type="number"
          step="0.1"
          placeholder="Enter soil temperature (optional)"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <!-- Measurement Time -->
      <div>
        <label for="measurementTime" class="block font-semibold mb-1">
          Measurement Time <span class="text-red-500">*</span>
        </label>
        <input
          id="measurementTime"
          v-model="measurementTime"
          type="datetime-local"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
          required
        />
      </div>

      <!-- Location -->
      <div>
        <label for="location" class="block font-semibold mb-1">Location</label>
        <input
          id="location"
          v-model="location"
          type="text"
          placeholder="Enter location or coordinates"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
        />
      </div>

      <!-- Note -->
      <div>
        <label for="note" class="block font-semibold mb-1">Note</label>
        <textarea
          id="note"
          v-model="note"
          rows="3"
          placeholder="Add a note if needed"
          class="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 resize-none"
        ></textarea>
      </div>

      <!-- Attachment -->
      <div>
        <label for="attachment" class="block font-semibold mb-1"
          >Attachment (optional)</label
        >
        <input
          id="attachment"
          type="file"
          @change="handleFileUpload"
          class="w-full border rounded-lg p-2"
        />
        <p v-if="attachment" class="text-sm text-gray-600 mt-1">
          Selected: {{ attachment.name }}
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-between mt-6">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Save
        </button>
        <button
          type="button"
          @click="cancel"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
