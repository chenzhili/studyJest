<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld id="12323" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { mapState, mapMutations, createNamespacedHelpers } from "vuex";

const {
  mapState: aMapState,
  mapActions: aMapActions
} = createNamespacedHelpers("aModule");

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  computed: {
    ...mapState(["count"]),
    ...aMapState(["countA"])
  },
  methods: {
    ...mapMutations(["changeCount"]),
    ...aMapActions(["incrementAction"]),
    test() {
      console.log(this.$store);
    }
  }
};
</script>
