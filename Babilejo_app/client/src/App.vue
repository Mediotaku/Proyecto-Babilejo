<template>
  <div v-if="!showSignIn" class="main-interface">
    <div @click="closeMenu" id="menu-overlay" class="menu-overlay"></div>
    <div id="chat-sidebar" class="chat-sidebar">
      <ChatList v-bind:users="users" v-bind:username="username"  @selectChat="setChatId" 
      v-bind:unreadMessages="unreadMessages" v-bind:messages="messages" @pushNotifications="setPushNotifications"/>
    </div>
    <div class="chat-room">
      <ChatRoom v-bind:messages="messages" v-bind:currentChatUser="currentChatUser" v-bind:username="username"
       @sendMessage="this.sendMessage" v-bind:currentLanguage="currentLanguage" @openLanguageModal="openmodal=true"
       @openMenu="openMenu"/>
    </div>
  </div>
  <div v-if="showSignIn">
    <SignIn v-bind:users="users" @signedin="setNickname" />
  </div>
  <div v-if="openmodal">
    <LanguageModal v-bind:currentLanguage="currentLanguage" @setCurrentLanguage="this.setCurrentLanguage"
    @closeLanguageModal="this.closeLanguageModal" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import SignIn from './components/SignIn.vue';
import ChatRoom from './components/ChatRoom.vue';
import ChatList from './components/ChatList.vue';
import LanguageModal from './components/LanguageModal.vue';


export default {
  name: 'App',
  components: { SignIn, ChatRoom, ChatList, LanguageModal },
  data: function (){
    return {
      username: "",
      socket: io("http://localhost:3000"),
      messages: [],
      users: [],
      showSignIn: true,
      currentChatId: "",
      currentChatUser: "",
      currentLanguage: "es",
      openmodal: false,
      unreadMessages: [],
      pushNotifications: false,
      windowFocus: true,
      unreadMessagesTotal: 0
    }
  },
  methods: {
    joinServer: function () {
      this.socket.emit('start', this.showSignIn);

      this.listen();
    },
    listen: function () {
      this.socket.on('loggedIn', data => {
        this.users = data.users;
        this.socket.emit('newuser', this.username);
      });
      this.socket.on('msg', message => {
        //Si no esta la ventana seleccionada, cambiar titulo 
        /*if(!this.windowFocus){
          this.unreadMessagesTotal++;
          let title_el = document.querySelector("title")
          title_el.innerHTML="Babilejo ("+this.unreadMessagesTotal+")";
        }*/
        //Añadir a mensajes no leidos si no es el chat actualmente seleccionado
        if(this.users.indexOf(message.usernameFrom)!=this.currentChatId){
          this.unreadMessages[this.users.indexOf(message.usernameFrom)]++;
        }
        //Tienen los dos usuarios el mismo idioma seleccionado?
        if(message.language==this.currentLanguage){
          if(this.pushNotifications){
            var img = require("@/assets/BabilejoIcon.png");
            this.$notification.show(message.usernameFrom, {
            body: message.msg, icon: img}, {})
          }
          this.messages.push(message);
        }
        else{
          this.requestTranslation(message);  
        }    
      })
    },
    async requestTranslation(message) {
      const res = await fetch("https://translate.astian.org/translate", {
        method: "POST",
        body: JSON.stringify({
          q: message.msg,
          source: message.language,
          target: this.currentLanguage
        }),
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      message.msg = json.translatedText;
      if(this.pushNotifications){
        var img = require("@/assets/BabilejoIcon.png");
        this.$notification.show(message.usernameFrom, {
        body: message.msg, icon: img}, {})
      }
      this.messages.push(message);
    },
    setNickname: function(value){
      this.showSignIn=false;
      this.username = value;
      if(!this.username) {
        this.username = "Anonymous";
      }

      this.joinServer();
    },
    sendMessage: function (msg) {
      let message = {
          usernameFrom: this.username,
          usernameTo: this.users[this.currentChatId],
          msg: msg,
          timestamp: this.getTime(),
          language: this.currentLanguage
      }
      this.messages.push(message);
      this.socket.emit('msg', message);
    },
    setChatId: function (value){
      this.currentChatId = value;
      this.currentChatUser = this.users[this.currentChatId];
      //Poner los unreadMessages de user seleccionado a 0
      this.unreadMessages[this.currentChatId] = 0;
      
      //Cerrar menu al seleccionar chat
      document.getElementById("menu-overlay").classList.remove('menu-overlay-visible');
      document.getElementById("chat-sidebar").classList.remove('chat-sidebar-visible');
    },
    getTime: function () {
      var aux = new Date().toLocaleTimeString();
      aux = aux.substr(0, aux.lastIndexOf(':'));
      return aux;
    },
    setCurrentLanguage: function (value) {
      this.currentLanguage=value;
    },
    closeLanguageModal: function(){
      this.openmodal= false;
    },
    openMenu: function(){
      document.getElementById("menu-overlay").classList.add('menu-overlay-visible');
      document.getElementById("chat-sidebar").classList.add('chat-sidebar-visible');
    },
    closeMenu: function(){
      document.getElementById("menu-overlay").classList.remove('menu-overlay-visible');
      document.getElementById("chat-sidebar").classList.remove('chat-sidebar-visible');
    },
    setPushNotifications: function(value){
      this.pushNotifications=value;
    }
  },
  created: function() {
    //Pedir los nombres de usuario para comprobar la disponibilidad del nickname
    this.socket.emit('start', this.showSignIn);
    this.socket.on('userData', data => {
        this.users = data.users;
        for(var i=0;i<this.users.length;i++){
          this.unreadMessages.push(0)
        }
    });
    this.socket.on('userOnline', user => {
        this.unreadMessages.push(0);
        this.users.push(user);
    });
    this.socket.on('userLeft', user => {
        this.unreadMessages.splice(this.users.indexOf(user), 1);
        this.users.splice(this.users.indexOf(user), 1);
    });
  },
  mounted: function() {
    window.addEventListener('blur', function(){
      this.windowFocus=false;});
    window.addEventListener('focus', function(){
      document.title="Babilejo";
      this.unreadMessagesTotal=0; 
      this.windowFocus=true;
    });
  }
}
</script>

<style>
html, body { height: 100%; min-height: 30rem; }
body {
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
#app {
  height: 100%;
  width: 100%;
  margin: 0 auto; 
}
.main-interface {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.chat-sidebar{
  z-index: 2;
  display: flex;
  flex-direction: column;
  width: calc(100% / 3.5);
  height: 100%;
}
.menu-overlay{
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(119, 119, 119, 0.59);
}
.chat-room{
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.menu-overlay{
  visibility: hidden;
  opacity: 0;
}
@media (max-width: 800px){
  .chat-sidebar{
    z-index: 4;
    position: fixed;
    left: -45rem;
    width: calc(100% / 1.3);
    background-color: white;
    transition: transform 1s ease-in;
    transform: translateX(-45rem);
  }
  .chat-sidebar-visible{
    transform: translateX(45rem);
  }
  .menu-overlay{
    transition: opacity 600ms ease-in, visibility 600ms ease-in;
  }
  .menu-overlay-visible{
    opacity: 1;
    visibility: visible;
  }
}
</style>
