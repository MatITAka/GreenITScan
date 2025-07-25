<template>
  <q-page padding>
    <!-- Page title -->
    <h4 class="text-center q-mb-md">Calculate Your Carbon Footprint</h4>

    <q-form @submit="submitForm" class="q-pa-md q-gutter-md">
      <!-- Daily usage section header -->
      <h5>📧 Daily Usage</h5>

      <!-- Input for emails sent per day -->
      <q-input
        v-model.number="formData.emailSimple"
        label="Emails sent per day *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Input for emails with attachments -->
      <q-input
        v-model.number="formData.emailPJ"
        label="Emails with attachment (1 MB) per day *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Input for web queries per day -->
      <q-input
        v-model.number="formData.webQueries"
        label="Web queries per day *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Input for video streaming hours per week -->
      <q-input
        v-model.number="formData.streamingVideo"
        label="Hours of video streaming per week *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Input for music streaming minutes per day -->
      <q-input
        v-model.number="formData.streamingAudio"
        label="Minutes of music streaming per day *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Input for video conferencing hours per week -->
      <q-input
        v-model.number="formData.videoConf"
        label="Hours of video conferencing per week *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Equipment section header -->
      <h5>🖥️ Equipment Used This Year</h5>

      <!-- Input for number of laptops used -->
      <q-input
        v-model.number="formData.pcCount"
        label="Number of laptops used this year *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Input for number of smartphones used -->
      <q-input
        v-model.number="formData.smartphoneCount"
        label="Number of smartphones used this year *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Input for number of gaming consoles used -->
      <q-input
        v-model.number="formData.consoleCount"
        label="Number of gaming consoles used *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Input for number of cloud services used -->
      <q-input
        v-model.number="formData.cloudCount"
        label="Number of cloud or hosting services used *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Note for mandatory fields -->
      <div>
        <p class="q-pa-md">Fields marked with an * are mandatory</p>
      </div>

      <!-- Form submission and cancellation buttons -->
      <div class="row q-pa-md">
        <!-- <BaseButton label="Calculate Footprint" type="submit" color="primary" class="q-ma-lg" />
        <BaseButton label="Cancel" @click="cancelForm" color="negative" class="q-ma-lg" /> -->
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { useNotificationsStore } from '../../stores/notificationsStore';
import { useCarbonFootprintStore } from '../../stores/carbonFootprintStore';
// import BaseButton from 'components/UI/BaseButton.vue';

export default {
  // Register components
  components: {
    // BaseButton,
  },

  setup() {
    // Initialize stores
    const carbonFootprintStore = useCarbonFootprintStore();
    // const notificationsStore = useNotificationsStore();
    const router = useRouter();

    // Reactive form data object
    const formData = ref({
      emailSimple: null,
      emailPJ: null,
      webQueries: null,
      streamingVideo: null,
      streamingAudio: null,
      videoConf: null,
      pcCount: null,
      smartphoneCount: null,
      consoleCount: null,
      cloudCount: null,
    });

    // Handle form submission
    const submitForm = async () => {
      try {
        // Save footprint using the store
        await carbonFootprintStore.createFootprint(formData.value);
        // Redirect to home page
        router.push({ name: 'Home' });
      } catch (error) {
        console.log(error)
        // Error notification should be handled by the store
      }
    };

    // Handle form cancellation
    const cancelForm = () => {
      // Redirect to home page
      router.push({ name: 'Home' });
    };

    return {
      formData,
      submitForm,
      cancelForm,
    };
  },
};
</script>

<style scoped>
/* No additional styles needed for basic functionality */
</style>