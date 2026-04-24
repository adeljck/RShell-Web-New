<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import '#/views/_shared/workspace-page.css';

import './generator.css';

import GeneratorForwardPanel from './components/generator-forward-panel.vue';
import GeneratorProxyPanel from './components/generator-proxy-panel.vue';
import GeneratorShellcodePanel from './components/generator-shellcode-panel.vue';
import GeneratorStagePanel from './components/generator-stage-panel.vue';
import {
  dllTargets,
  ebpfModes,
  ebpfTargets,
  generatorTabs,
  getTabLabel,
  stageTargets,
  type GeneratorTab,
  listenModes,
  useGeneratorListeners,
} from './generator.shared';

defineOptions({ name: 'Generator' });

const activeTab = ref<GeneratorTab>('stage');
const tabRefs = new Map<GeneratorTab, HTMLButtonElement>();
const tabIndicatorStyle = ref<Record<string, string>>({
  opacity: '0',
  transform: 'translateX(0px)',
  width: '0px',
});

const { listenerOptions, loadingListeners, loadListeners } = useGeneratorListeners();

function setTabRef(tab: GeneratorTab, el: HTMLButtonElement | null) {
  if (el) {
    tabRefs.set(tab, el);
  } else {
    tabRefs.delete(tab);
  }
}

function updateTabIndicator() {
  const element = tabRefs.get(activeTab.value);
  if (!element) {
    tabIndicatorStyle.value = {
      opacity: '0',
      transform: 'translateX(0px)',
      width: '0px',
    };
    return;
  }

  tabIndicatorStyle.value = {
    opacity: '1',
    transform: `translateX(${element.offsetLeft}px)`,
    width: `${element.offsetWidth}px`,
  };
}

onMounted(() => {
  void loadListeners();
  void nextTick(updateTabIndicator);
  window.addEventListener('resize', updateTabIndicator);
});

watch(activeTab, async () => {
  await nextTick();
  updateTabIndicator();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTabIndicator);
});
</script>

<template>
  <div class="workspace-page generator-page">
    <section class="workspace-page__header generator-page__header">
      <h1 class="workspace-page__title generator-title">{{ $t('page.generator.title') }}</h1>
    </section>

    <div class="generator-tabs">
      <span class="generator-tabs__indicator" :style="tabIndicatorStyle"></span>
      <button
        v-for="tab in generatorTabs"
        :key="tab"
        :class="['generator-tab', { 'generator-tab--active': activeTab === tab }]"
        :ref="(el) => setTabRef(tab, el as HTMLButtonElement | null)"
        type="button"
        @click="activeTab = tab"
      >
        {{ getTabLabel(tab) }}
      </button>
    </div>

    <section class="workspace-page__surface generator-panel">
      <GeneratorStagePanel
        v-show="activeTab === 'stage'"
        :listener-options="listenerOptions"
        :loading-listeners="loadingListeners"
      />

      <GeneratorShellcodePanel
        v-show="activeTab === 'shellcode'"
        :listener-options="listenerOptions"
        :loading-listeners="loadingListeners"
      />

      <GeneratorProxyPanel
        v-show="activeTab === 'stageless'"
        i18n-key="stageless"
        :listener-options="listenerOptions"
        :loading-listeners="loadingListeners"
        :target-options="stageTargets"
      />

      <GeneratorProxyPanel
        v-show="activeTab === 'dllStageless'"
        i18n-key="dllStageless"
        :listener-options="listenerOptions"
        :loading-listeners="loadingListeners"
        :target-options="dllTargets"
        compact-targets
        show-loader-button
      />

      <GeneratorForwardPanel
        v-show="activeTab === 'listen'"
        i18n-key="listen"
        :mode-options="listenModes"
        :target-options="stageTargets"
        show-host-port
      />

      <GeneratorForwardPanel
        v-show="activeTab === 'dllListen'"
        i18n-key="dllListen"
        :mode-options="listenModes"
        :target-options="dllTargets"
        compact-targets
        show-host-port
        show-loader-button
      />

      <GeneratorForwardPanel
        v-show="activeTab === 'ebpfListen'"
        i18n-key="ebpfListen"
        :mode-options="ebpfModes"
        :target-options="ebpfTargets"
        compact-targets
      />
    </section>
  </div>
</template>
