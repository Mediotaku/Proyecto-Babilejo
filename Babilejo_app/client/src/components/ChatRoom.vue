<template>
  <div class="chat-bar">
    <div class="chat-bar-text" v-if="currentChatUser!=''">
      {{currentChatUser}}
    </div>
    <div class="chat-bar-text" v-else>
      Selecciona a un usuario o evento
    </div>
    <div class="language-selector-button" @click="openModal">
      <img :src="require('@/assets/'+currentLanguageIcon(currentLanguage)+'Icon.svg')"/>
      {{currentLanguageName(currentLanguage)}}
    </div>
  </div>
  <div class="chat-window" :class="{backgroundchat:currentChatUser!=''}">
    <div v-if="currentChatUser!=''" class="messages" id="messages-box">
      <div :class="{'message-wrap':message.usernameFrom!=username, 'mymessage-wrap':message.usernameFrom==username}"
      v-for="message in currentMessages" v-bind:key="messages.indexOf(message)">
        <div :class="{message:message.usernameFrom!=username, mymessage:message.usernameFrom==username}">
          <div class="username" :class="{hide:message.usernameFrom==username}">{{message.usernameFrom}}</div>
          <div class="message-text">{{message.msg}}</div>
          <div class="message-time">{{message.timestamp}}</div>
        </div>
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
  props: ['messages', 'currentChatUser', 'username', 'currentLanguage'],
  emits: ['openLanguageModal', 'sendMessage'],
  data: function () {
    return {
      msg: ""
    }
  },
  methods: {
    sendMessage: function() {
      this.$emit('sendMessage', this.msg);
      this.msg = "";
      //this.updateScroll();
    },
    updateScroll: function(){
      var element = document.getElementById('messages-box');
      element.scrollHeight = element.scrollTop;
    },
    currentLanguageIcon: function(value){
      if(value=="es"){
        value="Spanish"
      }
      else if(value=="ja"){
        value="Japanese"
      }
      else if(value=="ko"){
        value="Korean"
      }
      else if(value=="fr"){
        value="French"
      }
      else if(value=="en"){
        value="English"
      }
      return value
    },
    currentLanguageName: function(value){
      if(value=="es"){
        value="Español"
      }
      else if(value=="ja"){
        value="日本語"
      }
      else if(value=="ko"){
        value="한국어"
      }
      else if(value=="fr"){
        value="Français"
      }
      else if(value=="en"){
        value="English"
      }
      return value
    },
    openModal: function(){
      this.$emit('openLanguageModal', true);
    }
  },
  computed: {
    currentMessages: function() {
      return this.messages.filter(m => (m.usernameFrom == this.currentChatUser && m.usernameTo == this.username)||
      m.usernameFrom == this.username && m.usernameTo == this.currentChatUser).slice().reverse();
    }
  }
}
</script>

<style scoped>
.hide{
  display: none;
}
.chat-window {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  /*Es necesario ~ para que la ruta funcione en <style>*/
  background-image: url("~@/assets/Background1.svg");
  background-repeat: no-repeat;
  background-position: center;
  height: 91%;
}
.backgroundchat {
  background: url("~@/assets/Gradient-overlay.svg"), linear-gradient(127.24deg, rgba(121, 123, 232, 0.76) 2.77%, rgba(121, 123, 232, 0.278026) 54.4%, rgba(121, 123, 232, 0) 97.42%), #79E893;
  background-repeat: repeat;
  background-size: contain;
}
.chat-bar{
  display:flex;
  align-items: center;
  justify-content: space-between;
  background: #5E60CE;
  min-height: 9%;
  width: 100%;
}
.chat-bar-text{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 2rem;
  color:white;
  padding-left: 8rem;
}

.language-selector-button{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  color: #A79A9A;
  background: #FFFFFF;
  box-shadow: 1px 1px 14px rgba(0, 0, 0, 0.47);
  border-radius: 68px;
  margin-right: 2rem;
  padding:0.2rem;
  padding-right: 0.7rem;
  cursor: pointer;
}

.language-selector-button img{
  width: 3rem;
  height: auto;
  margin-right: 0.2rem;
}

.messages {
  flex: 1;
  overflow: auto;
  flex-direction: column-reverse;
  justify-content: flex-start;
  display: flex;
  height: 100%;
}
.message-wrap{
  display: flex;
  flex-direction: row;
}
.mymessage-wrap{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.message{
  position: relative;
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.2rem;
  color:black;
	background: #FAFAFA;
	border-radius: 25px;
  max-width: 20rem;
  padding: 1rem;
  margin-left: 10rem;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.47);
  margin-bottom:2rem;
  word-break: break-all;
} 

.message:after {
	content: '';
  position: absolute;
  border-style: solid;
  border-width: 18px 43px 18px 0;
  border-color: transparent #FAFAFA;
  display: block;
  width: 0;
  z-index: 1;
  margin-top: -18px;
  left: -26px;
  top: 96%;
  transform: rotate(-37deg);
}

.username{
  font-family: 'Roboto';
  font-weight: bold;
  font-size: 0.8rem;
  color:#1DDB49;
  padding-bottom: 0.2rem;
}

.message-time{
  font-size: 0.6rem;
  color: #5B4E4E;
  text-align: end;
}

.mymessage{
  position: relative;
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.2rem;
  color:black;
	background: #DADBFB;
	border-radius: 25px;
  max-width: 20rem;
  padding: 1rem;
  margin-right: 10rem;
  box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom:2rem;
  word-break: break-all;
} 

.mymessage:after {
	content: '';
  position: absolute;
  border-style: solid;
  border-width: 18px 43px 18px 0;
  border-color: transparent #DADBFB;
  display: block;
  width: 0;
  z-index: 1;
  margin-top: -18px;
  right: -22px;
  top: 100%;
  transform: rotate(-130deg);
}

.input-container{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #FFFFFF;
  box-shadow: 1px 1px 14px rgba(0, 0, 0, 0.25);
  border-radius: 68px;
  width: 70rem;
  height: 4rem;
  align-self: center;
  margin-bottom: 3rem;
  margin-top: 3rem;
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