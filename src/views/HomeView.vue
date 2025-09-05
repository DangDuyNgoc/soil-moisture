<script setup lang="ts">
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

interface Request {
  id: number;
  title: string;
  status: string;
  assignee: string;
  deadline: string;
  attachment: string;
  staffName: string;
  staffEmail: string;
}

const router = useRouter();

const requests = ref<Request[]>([
  {
    id: 1,
    title: "Request for Budget Approval",
    status: "pending",
    assignee: "John Doe",
    deadline: "2025-01-15",
    attachment: "budget_approval.pdf",
    staffName: "Michael Scott",
    staffEmail: "michael.scott@dundermifflin.com",
  },
  {
    id: 2,
    title: "Team Expansion Proposal",
    status: "approved",
    assignee: "Jane Smith",
    deadline: "2025-01-10",
    attachment: "team_expansion.pdf",
    staffName: "Pam Beesly",
    staffEmail: "pam.beesly@dundermifflin.com",
  },
  {
    id: 3,
    title: "Office Equipment Request",
    status: "rejected",
    assignee: "Alice Johnson",
    deadline: "2025-01-12",
    attachment: "equipment_request.pdf",
    staffName: "Jim Halpert",
    staffEmail: "jim.halpert@dundermifflin.com",
  },
]);

const showModal = ref(false);
const currentRequest = ref<Request | null>(null);
const modalAction = ref<"approve" | "reject" | null>(null);
const comments = ref("");

const openModal = (request: Request, action: "approve" | "reject") => {
  currentRequest.value = request;
  modalAction.value = action;
  comments.value = "";
  showModal.value = true;
};

const submitAction = () => {
  if (!currentRequest.value || !modalAction.value) return;

  if (modalAction.value === "reject" && !comments.value) {
    alert("Please provide a reason for rejection.");
    return;
  }

  currentRequest.value.status =
    modalAction.value === "approve" ? "approved" : "rejected";
    
  showModal.value = false;
};
</script>

<template>
  <div class="homepage p-5">
    <header class="header flex justify-between items-center mb-5">
      <h1 class="text-red-500 text-2xl font-bold">Admin Page</h1>
    </header>

    <section class="request-list">
      <h2 class="text-xl font-semibold mb-3">Request List</h2>
      <table class="table w-full border-collapse">
        <thead>
          <tr>
            <th class="p-2 text-left border border-gray-300">#</th>
            <th class="p-2 text-left border border-gray-300">Title</th>
            <th class="p-2 text-left border border-gray-300">Staff Name</th>
            <th class="p-2 text-left border border-gray-300">Staff Email</th>
            <th class="p-2 text-left border border-gray-300">Assignee</th>
            <th class="p-2 text-left border border-gray-300">Deadline</th>
            <th class="p-2 text-left border border-gray-300">Status</th>
            <th class="p-2 text-left border border-gray-300">Attachment</th>
            <th class="p-2 text-left border border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.id">
            <td class="p-2 border border-gray-300">{{ request.id }}</td>
            <td class="p-2 border border-gray-300">{{ request.title }}</td>
            <td class="p-2 border border-gray-300">{{ request.staffName }}</td>
            <td class="p-2 border border-gray-300">{{ request.staffEmail }}</td>
            <td class="p-2 border border-gray-300">{{ request.assignee }}</td>
            <td class="p-2 border border-gray-300">{{ request.deadline }}</td>
            <td class="p-2 border border-gray-300">
              <span
                :class="[
                  'px-2 py-1 rounded text-xs',
                  request.status === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : '',
                  request.status === 'approved'
                    ? 'bg-green-600 text-white'
                    : '',
                  request.status === 'rejected' ? 'bg-red-600 text-white' : '',
                ]"
              >
                {{ request.status }}
              </span>
            </td>
            <td class="p-2 border border-gray-300">
              <a
                :href="request.attachment"
                target="_blank"
                class="text-blue-600 underline"
                >Download</a
              >
            </td>
            <td class="p-2 border border-gray-300">
              <div v-if="request.status === 'pending'">
                <button
                  @click="openModal(request, 'approve')"
                  class="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 cursor-pointer mr-2"
                >
                  Approve
                </button>
                <button
                  @click="openModal(request, 'reject')"
                  class="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 cursor-pointer"
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="modal-overlay fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-[1000]"
    >
      <div class="modal bg-white p-5 rounded-lg text-center max-w-md w-full">
        <h3 class="text-xl font-semibold mb-2">
          {{ modalAction === "approve" ? "Approve Request" : "Reject Request" }}
        </h3>
        <p class="mb-4">
          Are you sure you want to {{ modalAction }} this request?
        </p>

        <textarea
          v-model="comments"
          :placeholder="
            modalAction === 'reject'
              ? 'Enter rejection reason...'
              : 'Add comments (optional)...'
          "
          class="w-full h-20 my-2 p-2 border border-gray-300 rounded-md"
        ></textarea>

        <div class="modal-actions mt-5 flex justify-between">
          <button
            @click="submitAction"
            class="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer"
          >
            Submit
          </button>
          <button
            @click="showModal = false"
            class="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
