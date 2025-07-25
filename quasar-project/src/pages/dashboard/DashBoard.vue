<template>
  <q-page class="my-dashboard q-pa-md" loading="lazy" data-cy="dashboard-welcome">
    <div
      class="row q-col-gutter-md q-px-md"
      style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center"
    >
      <!-- Shortcuts card -->
      <div class="col-12 col-md-4 q-pa-md">
        <!-- <ShortcutsComponent /> -->
      </div>
      <!-- Dashboard card -->
      <div class="col-12 col-md-4 q-pa-md">
        <!-- <DashboardComponent /> -->
      </div>
      <!-- News card -->
      <div class="col-12 col-md-4 q-pa-md">
        <!-- <NewsComponent /> -->
      </div>
            <!-- Chatbot-->
            <div class="col-12 col-md-4 q-pa-md">
        <!-- <ChatBot /> -->
      </div>
    </div>
  </q-page>
</template>

<script setup>
// import ShortcutsComponent from 'components/DashboardComponents/ShortcutsComponent.vue';
// import NewsComponent from 'components/DashboardComponents/NewsComponent.vue';
// import DashboardComponent from 'components/DashboardComponents/DashboardComponent.vue';
// import ChatBot from 'src/components/DashboardComponents/OllamaChatBot.vue';
// import StatsChart from 'components/DashboardComponents/StatsChart.vue';
</script>

<style scoped>
.my-dashboard {
  background-image: url(../../../public/photos/Aalborg_Reno_Nord.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
}
</style>
