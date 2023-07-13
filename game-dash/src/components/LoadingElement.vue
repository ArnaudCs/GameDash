<template>
    <div class="loader">
        <Vue3Lottie :animationData="pac" :height="300" :width="300" />
    </div>
</template>
  
<script>
import { Vue3Lottie } from 'vue3-lottie'
import pac from '../assets/pacLoading.json'

export default {
name: "LoadingElement",
    components: {
        Vue3Lottie
    },
    data() {
        return {
           pac: pac
        };
    },
};
</script>

<style scoped>

.lottie-animation {
  width: 200px;
  height: 200px;
}
.loader{
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(7px);
    display: flex;
    justify-content: center;
    align-items: center;
    position : fixed;
    top: 0;
    left: 0;
    z-index: 9999;
}

</style>