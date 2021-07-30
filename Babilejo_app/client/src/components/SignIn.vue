<template>
  <div class="SignInForm">
    <label for="signinfield">Nickname:</label>
    <input type="text" id="signinfield" name="signinfield" v-model='nickname' placeholder="Introduce un Nickname" /><br /><br />
    <button @click="sendNickname">Acceder</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickname: ''
    }
  },
  methods: {
    sendNickname: function() {
      this.$emit('signedin', this.nickname);
    }
  }
};
</script>


<style scoped>
.SignInForm {
  margin: 1em;
}
</style>