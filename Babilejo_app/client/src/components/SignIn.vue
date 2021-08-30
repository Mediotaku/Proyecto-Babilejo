<template>
  <div class="signin-container">
    <div class="full-logo">
      <img src="@/assets/BabilejoLogoSVG.svg"/>
      <div id="logoanimate">
        <img :class="{hide:animateTurn!=1}" src="@/assets/Frame1.svg"/>
        <img :class="{hide:animateTurn!=2}" src="@/assets/Frame2.svg"/>
        <img :class="{hide:animateTurn!=3}" src="@/assets/Frame3.svg"/>
        <img :class="{hide:animateTurn!=4}" src="@/assets/Frame4.svg"/>
        <img :class="{hide:animateTurn!=5}" src="@/assets/Frame5.svg"/>
        <img :class="{hide:animateTurn!=6}" src="@/assets/Frame6.svg"/>
      </div>
    </div>
    <img class="splitbar" src="@/assets/Split_bar2.svg"/>
    <div class="SignInForm">
      <label for="signinfield">¡Bienvenid@! Introduce un nickname para empezar a chatear</label><br />
      <!--On keydown provisionalmente true para evitar la aparicion del aviso de span -->
      <input type="text" id="signinfield" name="signinfield" v-model='nickname' 
      v-on:keydown="inputOk=true" v-on:keyup="checkInput" placeholder="Nombre de usuario" /><br />
      <span :class="{hide:inputOk || nickname==''}">🚫 El nickname introducido no está disponible</span><br :class="{hide:inputOk || nickname==''}" />
      <button @click="sendNickname" :disabled="!inputOk">Acceder</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['users'],
  data() {
    return {
      nickname: '',
      inputOk: false,
      animateTurn: 1
    }
  },
  methods: {
    checkInput: function () {
      if(this.nickname != "" && !this.users.includes(this.nickname)){
           this.inputOk = true;
      }
      else{
        this.inputOk = false;
      }
    },
    sendNickname: function() {
      if(!this.users.includes(this.nickname)){
        this.$emit('signedin', this.nickname);
      }
    },
    changeFrame: function() {
      this.animateTurn++
      if(this.animateTurn>6){
        this.animateTurn=1;
      }
    }
  },
  mounted: function() {
    setInterval(this.changeFrame, 1000);
  }
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bellota:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');

#logoanimate {
  position:relative;
  margin:0 auto;
}

.hide {
  display:none;
}

.splitbar{
  align-self: center;
  max-height: 100%;
  width: auto;
}

.signin-container{
  display: flex;
  width: 100%;
  font-family: 'Bellota';
  font-weight: bold;
  font-size: 1.8rem;
  line-height: 38px;
  letter-spacing: 0.0095em;
  color: #5E60CE;
}

.signin-container label{
  display: inline-block;
  max-width: 521px;
  margin-bottom: 1em;
}

.signin-container input{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 18px;
  text-indent: 20px;
  background: #FFFFFF;
  box-shadow: 1px 1px 14px rgba(0, 0, 0, 0.25);
  border: 1px solid white; 
  width: 20rem;
  height: 3rem;
  border-radius: 68px;
}

.signin-container button{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 18px;
  color: white;
  padding: 5px;
  padding-left: 20px;
  padding-right: 20px;
  background: #1DDB49;
  border: 1px solid #1DDB49; 
  box-shadow: 1px 6px 4px rgba(0, 0, 0, 0.25);
  border-radius: 68px;
  margin-top: 2rem;
  cursor: pointer;
}

.signin-container button:disabled{
  background: silver;
  border: 1px solid silver; 
  color: rgb(240, 232, 232);
  cursor: auto;
}

.signin-container span {
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 18px;
  color: red;
  margin-top: 1rem;
}
.full-logo{
  /*display: flex;*/
  flex: 1;
  /*flex-direction: column;*/
  text-align: center;
  align-self: center;
}
.full-logo img{
  max-width: 100%;
  height: auto;
}

.SignInForm {
  flex: 1;
  text-align: center;
  align-self: center;
  margin-bottom: 4rem;
}

@media (max-width: 761px) {
  #logoanimate{
    display: none;
  }
  .splitbar{
    display: none;
  }
  .signin-container{
    flex-direction: column;
  }
}
@media (max-width: 1100px){
  .signin-container label{
    font-size: 1.3rem;
    max-width: 350px;
  }
} 
</style>