<style lang="stylus">
@keyframes rotateAnim {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

.webpack-logo {
  text-align: center;
  img {
    width: 70px;
    animation: rotateAnim 5s infinite linear;
  }
}
</style>

<template>
  <div class="webpack-logo">
    <img  src="../images/logo.svg">
  </div>
</template>
