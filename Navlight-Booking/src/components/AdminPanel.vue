<template>
  <div>
    <h2>Admin Panel</h2>
    <div v-if="!adminToken">
      <div class="dialog">
        <h3>Admin Login</h3>
        <input type="password" v-model="adminPassword" placeholder="Enter admin password" />
        <div v-if="loginError" class="error">{{ loginError }}</div>
        <button @click="login">Login</button>
      </div>
    </div>
    <div v-else>
      <ul v-if="bookings.length">
        <li v-for="booking in bookings" :key="booking.id" class="admin-booking">
          <div>
            <strong>{{ booking.eventName }}</strong> ({{ booking.navlightSet }})<br>
            Name: {{ booking.name }}<br>
            Pickup: {{ booking.pickupDate }} | Event: {{ booking.eventDate }} | Return: {{ booking.returnDate }}<br>
            Status: {{ booking.status }}
          </div>
          <div v-if="booking.status === 'confirmed'">
            <button @click="startPickup(booking)">Mark as Picked Up</button>
          </div>
          <div v-if="booking.status === 'pickedup'">
            <div>
              Picked up: {{ booking.actualPickupDate }}<br>
              Missing punches: {{ booking.pickupMissingPunches?.join(', ') || 'None' }}
            </div>
            <button @click="startReturn(booking)">Mark as Returned</button>
          </div>
          <div v-if="booking.status === 'returned'">
            <div>
              Returned: {{ booking.actualReturnDate }}<br>
              Missing punches: {{ booking.returnMissingPunches?.join(', ') || 'None' }}
            </div>
          </div>
          <button @click="deleteBooking(booking.id)" class="delete">Delete Booking</button>
        </li>
      </ul>
      <div v-else>No bookings found.</div>

      <!-- Pickup Dialog -->
      <div v-if="showPickupDialog" class="dialog">
        <h3>Mark as Picked Up</h3>
        <label>Date of Pickup: <input type="date" v-model="pickupDate" /></label>
        <label>Missing Punch Numbers (comma separated):
          <input v-model="pickupMissingPunches" placeholder="e.g. 101,102" />
        </label>
        <button @click="confirmPickup">Confirm</button>
        <button @click="cancelDialog">Cancel</button>
      </div>

      <!-- Return Dialog -->
      <div v-if="showReturnDialog" class="dialog">
        <h3>Mark as Returned</h3>
        <label>Date of Return: <input type="date" v-model="returnDate" /></label>
        <label>Missing Punch Numbers (comma separated):
          <input v-model="returnMissingPunches" placeholder="e.g. 101,102" />
        </label>
        <button @click="confirmReturn">Confirm</button>
        <button @click="cancelDialog">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchBookings, updateBooking, deleteBooking as apiDeleteBooking, adminLogin } from '../api/bookings.js'

const bookings = ref([])
const showPickupDialog = ref(false)
const showReturnDialog = ref(false)
const pickupDate = ref('')
const pickupMissingPunches = ref('')
const returnDate = ref('')
const returnMissingPunches = ref('')
let currentBooking = null

const adminPassword = ref('')
const adminToken = ref(localStorage.getItem('adminToken') || '')
const loginError = ref('')

async function login() {
  loginError.value = ''
  try {
    const { token } = await adminLogin(adminPassword.value)
    adminToken.value = token
    localStorage.setItem('adminToken', token)
    await loadBookings()
  } catch (e) {
    loginError.value = e.message || 'Login failed'
  }
}

async function loadBookings() {
  bookings.value = await fetchBookings()
}

onMounted(() => {
  if (adminToken.value) loadBookings()
})

function startPickup(booking) {
  currentBooking = booking
  pickupDate.value = ''
  pickupMissingPunches.value = ''
  showPickupDialog.value = true
}
function startReturn(booking) {
  currentBooking = booking
  returnDate.value = ''
  returnMissingPunches.value = ''
  showReturnDialog.value = true
}
function cancelDialog() {
  showPickupDialog.value = false
  showReturnDialog.value = false
  currentBooking = null
}
async function confirmPickup() {
  if (!currentBooking) return
  await updateBooking(currentBooking.id, {
    status: 'pickedup',
    actualPickupDate: pickupDate.value,
    pickupMissingPunches: pickupMissingPunches.value.split(',').map(s => s.trim()).filter(Boolean),
  }, adminToken.value)
  await loadBookings()
  showPickupDialog.value = false
  currentBooking = null
}
async function confirmReturn() {
  if (!currentBooking) return
  await updateBooking(currentBooking.id, {
    status: 'returned',
    actualReturnDate: returnDate.value,
    returnMissingPunches: returnMissingPunches.value.split(',').map(s => s.trim()).filter(Boolean),
  }, adminToken.value)
  await loadBookings()
  showReturnDialog.value = false
  currentBooking = null
}
async function deleteBooking(id) {
  await apiDeleteBooking(id, adminToken.value)
  await loadBookings()
}
</script>

<style scoped>
.admin-booking {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  background: #f9f9f9;
}
.delete {
  color: #fff;
  background: #c00;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  margin-top: 8px;
}
.dialog {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  background: #fff;
  border: 1px solid #888;
  border-radius: 8px;
  padding: 24px;
  z-index: 1000;
  box-shadow: 0 2px 12px rgba(0,0,0,0.2);
}
</style>
