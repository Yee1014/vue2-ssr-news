<template>
<div id="app">
  <header class="header">
    <nav class="inner">
      <router-link to="/" exact>
        <img class="logo" src="~public/logo-48.png" alt="logo">
      </router-link>
      <router-link v-for="category in categories" :to="category.path" :key="category.id">{{category.title}}</router-link>
      <a class="github" href="https://github.com/tiodot/vnews" target="_blank" rel="noopener">
        Built with Vue.js
      </a>
    </nav>
  </header>
  <transition name="fade" mode="out-in">
    <router-view class="view"></router-view>
  </transition>
</div>
</template>
<script>
import Category from './config/category';
export default {
  name: 'app',
  data() {
    return {
      categories: Category.map(category => ({
        path: '/' + category.title,
        title: category.name,
        id: category.id
      }))
    }
  }
}
</script>

<style lang="stylus">
@import "./app.stylus";
</style>
