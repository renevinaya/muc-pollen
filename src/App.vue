<script setup lang="ts">
import Pollen from './Pollen.vue'
import { version } from '../package.json'
import { displayNames, getBrowserLanguage, type language } from './translations';
import { ref, Ref } from 'vue';

const language: Ref<language> = ref(getBrowserLanguage());
</script>

<template>
  <header class="hero is-primary">
    <div class="hero-body">
      <div class="level">
        <div class="level-left">
          <h1 class="title">
            Pollen in Munich
          </h1>
        </div>
        <div class="level-right">
          <div class="level is-mobile">
            <div class="level-item" v-for="(name, key) in displayNames">
              <button class="button" :class="[language == key ? 'is-outlined' : 'is-primary']" v-text="name"
                @click="language = key" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <section class="section">
    <Pollen :language="language" />
  </section>
  <footer class="hero is-link is-small">
    <div class="hero-body has-text-centered has-text-white">
      <p>Version V{{ version }}</p>
      <p>Made by <a href="https://github.com/renevinaya" class="has-text-white">René Mueller</a> with data from <a
          href="https://epin.lgl.bayern.de/" class="has-text-white">Landesamtes für Gesundheit und
          Lebensmittelsicherheit
          Bayern</a>.</p>
      <p>Hosted by <a href="https://aws.amazon.com/" class="has-text-white">Amazon</a>. Check their <a
          href="https://d1.awsstatic.com/legal/aws-gdpr/AWS_GDPR_DPA.pdf" class="has-text-white">data privacy
          regulations</a>.</p>
    </div>
  </footer>
</template>
