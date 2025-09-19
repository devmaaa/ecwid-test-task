<template>
  <div class="flex min-h-screen flex-col bg-app text-body transition-colors">
    <header
      class="border-b border-subtle bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 transition-colors"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <RouterLink to="/" class="text-lg font-semibold text-heading transition-colors">
          Ecwid Storefront
        </RouterLink>
        <nav class="flex items-center gap-4 text-sm font-medium text-muted">
          <RouterLink to="/" class="transition hover:text-heading" active-class="text-heading">
            Home
          </RouterLink>
          <RouterLink to="/cart" class="transition hover:text-heading" active-class="text-heading">
            Cart
          </RouterLink>
        </nav>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <CartIcon />
        </div>
      </div>
    </header>
    <main class="flex-1 bg-gradient-to-b from-surface to-app/60 px-4 py-10">
      <div class="mx-auto max-w-7xl">
        <RouterView />
      </div>
    </main>
    <footer class="border-t border-subtle bg-surface transition-colors">
      <div class="mx-auto max-w-7xl px-4 py-6 text-sm text-muted">
        © {{ currentYear }} Ecwid Demo Store. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { CartIcon } from '@entities/cart'
import ThemeToggle from '@shared/ui/theme-toggle.vue'

const currentYear = computed(() => new Date().getFullYear())
</script>
