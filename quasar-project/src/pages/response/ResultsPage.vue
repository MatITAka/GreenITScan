<template>
  <q-page padding>
    <!-- Page title -->
    <h4 class="text-center q-mb-md">Your Carbon Footprint Results</h4>

    <!-- Card to display results -->
    <q-card class="q-ma-md">
      <q-card-section>
        <!-- Display calculated footprint -->
        <h5 class="text-center">Your Carbon Footprint: {{ carbonFootprint }} g CO2</h5>
        <p class="text-center q-mt-md">Thank you for calculating your carbon footprint. Below is a summary of your inputs.</p>
      </q-card-section>

      <!-- Summary of submitted data -->
      <q-card-section>
        <h6>Summary of Your Inputs</h6>
        <q-list>
          <q-item>
            <q-item-section>Emails sent per day:</q-item-section>
            <q-item-section>{{ formData.emailSimple }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Emails with attachment (1 MB) per day:</q-item-section>
            <q-item-section>{{ formData.emailPJ }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Web queries per day:</q-item-section>
            <q-item-section>{{ formData.webQueries }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Hours of video streaming per week:</q-item-section>
            <q-item-section>{{ formData.streamingVideo }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Minutes of music streaming per day:</q-item-section>
            <q-item-section>{{ formData.streamingAudio }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Hours of video conferencing per week:</q-item-section>
            <q-item-section>{{ formData.videoConf }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Laptops used this year:</q-item-section>
            <q-item-section>{{ formData.pcCount }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Smartphones used this year:</q-item-section>
            <q-item-section>{{ formData.smartphoneCount }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Gaming consoles used this year:</q-item-section>
            <q-item-section>{{ formData.consoleCount }}</q-item-section>
          </q-item>
          <q-item>
            <q-item-section>Cloud or hosting services used:</q-item-section>
            <q-item-section>{{ formData.cloudCount }}</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <!-- Action buttons -->
      <q-card-actions align="center">
        <!-- <BaseButton label="Recalculate" @click="recalculate" color="primary" class="q-ma-lg" />
        <BaseButton label="Back to Home" @click="goToHome" color="secondary" class="q-ma-lg" /> -->
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import { useNotificationsStore } from '../../stores/notificationsStore';
import { useCarbonFootprintStore } from '../../stores/carbonFootprintStore';
// import BaseButton from 'components/UI/BaseButton.vue';

export default {
  // Register components
  components: {
    // BaseButton,
  },

  setup() {
    // Initialize stores and router
    const carbonFootprintStore = useCarbonFootprintStore();
    // const notificationsStore = useNotificationsStore();
    const router = useRouter();
    const route = useRoute();

    // Reactive state for form data and footprint
    const formData = ref({
      emailSimple: 0,
      emailPJ: 0,
      webQueries: 0,
      streamingVideo: 0,
      streamingAudio: 0,
      videoConf: 0,
      pcCount: 0,
      smartphoneCount: 0,
      consoleCount: 0,
      cloudCount: 0,
    });
    const carbonFootprint = ref(0);

    // Fetch footprint data on component mount
    onMounted(async () => {
      try {
        // Check if footprint ID is provided in route params
        if (route.params.id) {
          const footprint = await carbonFootprintStore.viewFootprint(route.params.id);
          formData.value = {
            emailSimple: footprint.emailSimple,
            emailPJ: footprint.emailPJ,
            webQueries: footprint.webQueries,
            streamingVideo: footprint.streamingVideo,
            streamingAudio: footprint.streamingAudio,
            videoConf: footprint.videoConf,
            pcCount: footprint.pcCount,
            smartphoneCount: footprint.smartphoneCount,
            consoleCount: footprint.consoleCount,
            cloudCount: footprint.cloudCount,
          };
          carbonFootprint.value = footprint.calculatedFootprint;
        } else {
          // notificationsStore.createNotification({
          //   message: 'No footprint data found.',
          //   type: 'warning',
          //   position: 'top-right',
          // });

          // router.push({ name: 'Dashboard' });
        }
      } catch (error) {
        console.log(error)
        // notificationsStore.createNotification({
        //   message: 'Error loading footprint data.',
        //   type: 'negative',
        //   position: 'top-right',
        // });
        // router.push({ name: 'Dashboard' });
      }
    });

    // Navigate to form to recalculate
    const recalculate = () => {
      router.push({ name: 'CarbonFootprintForm' });
    };

    // Navigate to home page
    const goToHome = () => {
      router.push({ name: 'Dashboard' });
    };

    return {
      formData,
      carbonFootprint,
      recalculate,
      goToHome,
    };
  },
};
</script>

<style scoped>
/* Center the card and add subtle shadow */
.q-card {
  max-width: 600px;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Style for the list items */
.q-list {
  padding: 16px;
}

/* Ensure buttons are evenly spaced */
.q-card-actions {
  padding-bottom: 16px;
}
</style>