<template>
  <div class="chat-bar">
    <div class="chat-bar-text" v-if="currentChatUser!=''">
      {{currentChatUser}}
    </div>
    <div class="chat-bar-text" v-else>
      Selecciona a un usuario o evento
    </div>
  </div>
  <div class="chat-window" :class="{backgroundchat:currentChatUser!=''}">
    <div v-if="currentChatUser!=''" class="messages">
      <div class="message" v-for="message in currentMessages" v-bind:key="messages.indexOf(message)">
        <div class="username">{{message.usernameFrom}}</div>
        <div class="message-text">{{message.msg}}</div>
      </div>
    </div>
    <div v-if="currentChatUser!=''" class="input-container" >
      <input type="text" v-model="msg" placeholder="Introduce tu mensaje...">
      <img @click="sendMessage" src="@/assets/SendIcon.svg"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'chatroom',
  props: ['messages', 'currentChatUser', 'username'],
  data: function () {
    return {
      msg: ""
    }
  },
  methods: {
    sendMessage: function() {

      this.$emit('sendMessage', this.msg);
      this.msg = "";
    }
  },
  computed: {
    currentMessages: function() {
      return this.messages.filter(m => (m.usernameFrom == this.currentChatUser && m.usernameTo == this.username)||
      m.usernameFrom == this.username && m.usernameTo == this.currentChatUser)
    }
  }
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  /*Es necesario ~ para que la ruta funcione en <style>*/
  background-image: url("~@/assets/Background1.svg");
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
}
.backgroundchat {
  background: url("~@/assets/Gradient-overlay.svg"), linear-gradient(127.24deg, rgba(121, 123, 232, 0.76) 2.77%, rgba(121, 123, 232, 0.278026) 54.4%, rgba(121, 123, 232, 0) 97.42%), #79E893;
  background-repeat: repeat;
  background-size: contain;
}
.chat-bar{
  display:flex;
  align-items: center;
  background: #797BE8;
  height: 5.4rem;
  width: 100%;
}
.chat-bar-text{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 2rem;
  color:white;
  padding-left: 8rem;
}
.messages {
  flex: 1;
}

.message{
  display: flex;
  align-self: flex-end;
  position: relative;
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1rem;
  color:black;
	background: #FAFAFA;
	border-radius: 25px;
  max-width: 20rem;
  padding: 1rem;
  margin-left: 10rem;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.47);
  margin-top:2rem;
} 

.message:after {
	content: '';
  position: absolute;
  border-style: solid;
  border-width: 18px 43px 18px 0;
  border-color: transparent #FFFFFF;
  display: block;
  width: 0;
  z-index: 1;
  margin-top: -18px;
  left: -26px;
  top: 96%;
  transform: rotate(-37deg);
}

.input-container{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #FFFFFF;
  box-shadow: 1px 1px 14px rgba(0, 0, 0, 0.25);
  border-radius: 68px;
  width: 70rem;
  height: 3.5rem;
  align-self: center;
  margin-bottom: 3rem;
}

.input-container input{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 18px;
  border: 1px solid white; 
  border-radius: 68px;
  width: 60rem;
  outline: none;
}

.input-container img {
  max-width: 2.5rem;
  height: auto;
  cursor: pointer;
}
</style>