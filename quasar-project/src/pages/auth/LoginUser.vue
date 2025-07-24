<template>
  <q-page class="flex flex-center">
    <!-- Form for user login -->
    <q-form @submit.prevent="onSubmit" class="q-gutter-md">
      <q-input v-model="email" label="Email" type="email" />
      <q-input v-model="password" label="Password" type="password" />
      <q-checkbox v-model="rememberMe" label="Remember Me" />
      <div class="q-mt-lg q-mb-lg q-ml-xl">
        <q-btn type="submit" label="Login" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';

// Reactive references for form inputs
const email = ref('');
const password = ref('');
const rememberMe = ref(true);

// Initialize router
const router = useRouter();

// Handle form submission
const onSubmit = async () => {
  try {
    // Send login request to Symfony backend
    const response = await api.post('http://localhost:8000/api/auth/login', {
      email: email.value,
      password: password.value,
    });

    // Store token and expiration in localStorage
    const token = response.data.token;
    const expirationDate = new Date(response.data.expiration);
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', expirationDate.toISOString());

    // Store user info in localStorage (assuming response.data.userWithInfo contains user data)
    const userInfo = response.data.userWithInfo || {};
    localStorage.setItem('userInfo', JSON.stringify({
      id: userInfo.id || null,
      email: userInfo.email || '',
      roles: userInfo.roles || [],
      firstName: userInfo.firstname || '',
      lastName: userInfo.lastname || '',
      position: userInfo.position || '',
      workplace: userInfo.workplace || '',
      tel: userInfo.tel || '',
    }));

    // Store email in localStorage if "Remember Me" is checked
    if (rememberMe.value) {
      localStorage.setItem('rememberedEmail', email.value);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    // Redirect to dashboard
    // Note: Role-based redirection (e.g., /dashboardGuest) can be added here if needed
    router.push('/dashboard');
  } catch (error) {
    // Error handling is minimal since notificationsStore is removed
    // Log errors to console for debugging; consider adding UI feedback later
    console.error('Login error:', error.response ? error.response.status : 'Network error');
  }
};

// Prefill form with default credentials or remembered email on mount
onMounted(() => {
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail) {
    email.value = rememberedEmail;
    rememberMe.value = true;
  } else {
    // Set default credentials for testing
    email.value = 'gotham@dc.us';
    password.value = 'batman';
    rememberMe.value = true;
  }
});
</script>
