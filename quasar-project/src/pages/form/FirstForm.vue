<template>
  <q-page padding>
    <!-- Page title -->
    <h4 class="text-center q-mb-md">Calculate Your Carbon Footprint</h4>

    <q-form @submit="submitForm" class="q-pa-md q-gutter-md">
      <!-- Daily Usage Section -->
      <h5>📧 Daily Usage</h5>

      <!-- Email Simple Input -->
      <q-input
        v-model.number="formData.emailSimple"
        label="Emails sent per day *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Email with Attachment Input -->
      <q-input
        v-model.number="formData.emailPJ"
        label="Emails with attachment (1 MB) per day *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Web Queries Input -->
      <q-input
        v-model.number="formData.webQueries"
        label="Web queries per day *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Streaming Video Input -->
      <q-input
        v-model.number="formData.streamingVideo"
        label="Hours of video streaming per week *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Streaming Audio Input -->
      <q-input
        v-model.number="formData.streamingAudio"
        label="Minutes of music streaming per day *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Video Conference Input -->
      <q-input
        v-model.number="formData.videoConf"
        label="Hours of video conferencing per week *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Equipment Section -->
      <h5>🖥️ Equipment Used This Year</h5>

      <!-- PC Count Input -->
      <q-input
        v-model.number="formData.pcCount"
        label="Number of laptops used this year *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Smartphone Count Input -->
      <q-input
        v-model.number="formData.smartphoneCount"
        label="Number of smartphones used this year *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Console Count Input -->
      <q-input
        v-model.number="formData.consoleCount"
        label="Number of gaming consoles used *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Cloud Count Input -->
      <q-input
        v-model.number="formData.cloudCount"
        label="Number of cloud or hosting services used *"
        type="number"
        :rules="[(val) => val >= 0 || 'Value must be non-negative', (val) => val !== null || 'Field is required']"
      />

      <!-- Mandatory Fields Note -->
      <div>
        <p class="q-pa-md">Fields marked with an * are mandatory</p>
      </div>

      <!-- Form Buttons -->
      <div class="row q-pa-md">
        <BaseButton label="Calculate Footprint" type="submit" color="primary" class="q-ma-lg" />
        <BaseButton label="Cancel" @click="cancelForm" color="negative" class="q-ma-lg" />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { useNotificationsStore } from '../../stores/notificationsStore';
// import BaseButton from 'components/UI/BaseButton.vue';

export default {
  components: {
    // BaseButton,
  },

  setup() {
    // Initialize notifications store
    // const notificationsStore = useNotificationsStore();
    const router = useRouter();

    // Form data reactive object
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

    // Function to calculate carbon footprint (mock implementation)
    const calculateCarbonFootprint = (data) => {
      // Mock calculation: replace with actual carbon footprint calculation logic
      const footprint = (
        data.emailSimple * 0.01 + // g CO2 per email
        data.emailPJ * 0.05 + // g CO2 per email with attachment
        data.webQueries * 0.02 + // g CO2 per web query
        data.streamingVideo * 150 + // g CO2 per hour of video streaming
        data.streamingAudio * 0.1 + // g CO2 per minute of audio streaming
        data.videoConf * 200 + // g CO2 per hour of video conferencing
        data.pcCount * 200000 + // g CO2 per laptop per year
        data.smartphoneCount * 80000 + // g CO2 per smartphone per year
        data.consoleCount * 100000 + // g CO2 per console per year
        data.cloudCount * 50000 // g CO2 per cloud service per year
      ).toFixed(2); // Total in grams CO2

      return footprint;
    };

    // Handle form submission
    const submitForm = async () => {
      try {
        // Perform calculation
        const footprint = calculateCarbonFootprint(formData.value);
console.log(`Carbon footprint calculated: ${footprint} g CO2`)
        // Show success notification
        // notificationsStore.createNotification({
        //   message: `Carbon footprint calculated: ${footprint} g CO2`,
        //   type: 'positive',
        //   position: 'top-right',
        // });

        // Redirect to a results page or home (adjust as needed)
        router.push({ name: 'Home' });
      } catch (error) {
        // Show error notification
        console.log(error)
        // notificationsStore.createNotification({
        //   message: `Error calculating footprint: ${error.message}`,
        //   type: 'negative',
        //   position: 'top-right',
        // });
      }
    };

    // Handle form cancellation
    const cancelForm = () => {
      // Redirect to home or another page
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