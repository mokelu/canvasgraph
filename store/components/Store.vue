<template>
  <div class="store">
    <template v-if="!selectedItem">
      <div class="store-header">
        <h1>Store</h1>
      </div>

      <div class="store-search">
        <input
          v-model="search"
          type="text"
          placeholder="Search apps, libraries..."
          class="search-input"
        />
      </div>

      <div class="store-section">
        <div class="section-header">Built into FAIRY</div>
        <div class="card-list">
          <StoreCard
            v-for="item in filteredBuiltIn"
            :key="item.id"
            :item="item"
            :installed="true"
            @select="selectedItem = item"
          />
        </div>
      </div>

      <div class="store-section">
        <div class="section-header">Available</div>
        <div class="card-list">
          <StoreCard
            v-for="item in filteredAvailable"
            :key="item.id"
            :item="item"
            :installed="isInstalled(item.id)"
            @select="selectedItem = item"
            @install="install(item)"
            @uninstall="uninstall(item.id)"
          />
          <div v-if="!filteredAvailable.length" class="empty-state">
            Nothing available yet
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <StoreDetail
        :item="selectedItem"
        :installed="isInstalled(selectedItem.id)"
        @close="selectedItem = null"
        @install="install(selectedItem)"
        @uninstall="uninstall(selectedItem.id)"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { catalog } from '../catalog.js'
import { installPlugin, uninstallPlugin } from '../../core/installer.js'
import { pluginStorage } from '../../core/storage/plugin.js'
import StoreCard from './StoreCard.vue'
import StoreDetail from './StoreDetail.vue'

const search = ref('')
const selectedItem = ref(null)
const installedIds = ref(new Set())

onMounted(async () => {
  const plugins = await pluginStorage.getAll()
  installedIds.value = new Set(plugins.map(p => p.id))
})

function isInstalled(id) {
  const entry = catalog.find(c => c.id === id)
  if (entry?.builtIn) return true
  return installedIds.value.has(id)
}

async function install(entry) {
  await installPlugin(entry)
  installedIds.value.add(entry.id)
}

async function uninstall(id) {
  await uninstallPlugin(id)
  installedIds.value.delete(id)
}

const filteredBuiltIn = computed(() => {
  const q = search.value.toLowerCase()
  return catalog.filter(item =>
    item.builtIn && (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    )
  )
})

const filteredAvailable = computed(() => {
  const q = search.value.toLowerCase()
  return catalog.filter(item =>
    !item.builtIn && (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    )
  )
})
</script>

<style scoped>
.store {
  height: 100%;
  overflow-y: auto;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.store-header {
  padding: 20px 20px 0;
}

.store-header h1 {
  font-size: 18px;
  font-weight: 500;
}

.store-search {
  padding: 16px 20px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  background: var(--bg-secondary);
  border: var(--border-width) solid var(--border-color);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  outline: none;
}

.search-input:focus {
  border-color: var(--text-primary);
}

.store-section {
  padding: 0 20px 20px;
}

.section-header {
  color: var(--text-primary);
  opacity: 0.4;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: var(--text-primary);
  opacity: 0.3;
  font-size: var(--font-size-sm);
}
</style>
