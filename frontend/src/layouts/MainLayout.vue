<template>
  <div class="constrained q-pa-md" style="min-height: 100vh;">
    <QLayout view="lHh LpR lFf">
      <QHeader reveal elevated class="bg-blue text-primary" style="background: #144372 !important;max-height: 5rem">
        <QToolbar>
          <QAvatar rounded size="120px">
            <img
              tabindex="-1"
              src="../assets/bc-gov-logo.svg"
              class="logo"
              alt="B.C. Government Logo"
            >
          </QAvatar>
          <QToolbarTitle>
            <span style="color:white">BCGov Starter Template</span>
          </QToolbarTitle>
        </QToolbar>
      </QHeader>
      <QFooter reveal elevated style="background: #144372 !important;">
        <QBtn tabindex="-1" id="footer-home" target="_blank" href="https://www.gov.bc.ca/">Home</QBtn>
        <QBtn tabindex="-1" id="footer-about" target="_blank" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">About
          gov.bc.ca
        </QBtn>
        <QBtn tabindex="-1" id="footer-disclaimer" target="_blank" href="https://gov.bc.ca/disclaimer">Disclaimer</QBtn>
        <QBtn tabindex="-1" id="footer-privacy" target="_blank" href="https://gov.bc.ca/privacy">Privacy</QBtn>
        <QBtn tabindex="-1" id="footer-accessibility" target="_blank" href="https://gov.bc.ca/webaccessibility">Accessibility
        </QBtn>
        <QBtn tabindex="-1" id="footer-copyright" target="_blank" href="https://gov.bc.ca/copyright">Copyright</QBtn>
        <QBtn tabindex="-1" id="footer-contact" target="_blank" href="https://www2.gov.bc.ca/gov/content/home/contact-us">
          Contact Us
        </QBtn>
      </QFooter>
      <QPageContainer class="">
        <HelloWorld msg="Welcome to BCGov Starter"/>
      </QPageContainer>

    </QLayout>
  </div>
</template>


<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
</script>


<style scoped>
.constrained {
  width: 100%;
  height: 100%;
}

.constrained .q-layout,
.constrained .q-header,
.constrained .q-footer {
  margin: 0 auto
}
</style>
