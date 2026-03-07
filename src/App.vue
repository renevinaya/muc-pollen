<script setup lang="ts">
import Pollen from './Pollen.vue'
import { version } from '../package.json'
import { displayNames, getBrowserLanguage, ui, type language } from './translations';
import { ref, Ref, computed, watch } from 'vue';

const LANG_KEY = 'language';
const stored = localStorage.getItem(LANG_KEY);
const initial: language = stored && stored in displayNames ? stored as language : getBrowserLanguage();
const language: Ref<language> = ref(initial);
watch(language, (lang) => localStorage.setItem(LANG_KEY, lang));
const t = computed(() => {
  const lang = language.value;
  return (key: string) => ui[key][lang];
});
</script>

<template>
  <header class="hero is-primary">
    <div class="hero-body">
      <div class="level">
        <div class="level-left">
          <h1 class="title">
            {{ t('title') }}
          </h1>
        </div>
        <div class="level-right">
          <div class="level is-mobile">
            <div class="level-item" v-for="(name, key) in displayNames">
              <button class="button" :class="[language === key ? 'is-outlined' : 'is-primary']" v-text="name"
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
      <p>{{ t('madeBy') }} <a href="https://github.com/renevinaya" class="has-text-white">René Mueller</a> {{ t('withDataFrom') }}
        <a href="https://pollenscience.eu" class="has-text-white">PollenScience</a>,
        <a href="https://epin.lgl.bayern.de/" class="has-text-white">LGL Bayern</a>,
        <a href="https://open-meteo.com/" class="has-text-white">Open-Meteo</a>,
        <a href="https://www.dwd.de/" class="has-text-white">DWD</a>,
        <a href="https://modis.ornl.gov/" class="has-text-white">NASA ORNL DAAC (MODIS)</a>.
      </p>
      <p>{{ t('hostedBy') }} <a href="https://aws.amazon.com/" class="has-text-white">Amazon</a>, <a
          href="https://d1.awsstatic.com/legal/aws-gdpr/AWS_GDPR_DPA.pdf" class="has-text-white">{{ t('privacyRegulations') }}</a>.</p>
    </div>
  </footer>
</template>
