<template>
  <div v-if="!showSignIn" class="main-interface">
    <div @click="closeMenu" id="menu-overlay" class="menu-overlay"></div>
    <div id="chat-sidebar" class="chat-sidebar">
      <ChatList v-bind:users="users" v-bind:username="username"  @selectChat="setChatId" 
      v-bind:unreadMessages="unreadMessages" v-bind:messages="messages" @pushNotifications="setPushNotifications"
      @titleNotifications="setTitleNotifications" @soundNotifications="setSoundNotifications" v-bind:eventsData="eventsData"
      v-bind:localization="localization" v-bind:currentLanguage="currentLanguage"/>
    </div>
    <div class="chat-room">
      <ChatRoom v-bind:messages="messages" v-bind:currentChatUser="currentChatUser" v-bind:username="username" v-bind:eventsData="eventsData"
       @sendMessage="this.sendMessage" v-bind:currentLanguage="currentLanguage" @openLanguageModal="openmodal=true" v-bind:eventsSubscribed="eventsSubscribed"
       @openMenu="openMenu" @eventSubscribe="eventSubscribe" @openEventModal="openEventModal=true" v-bind:currentEventStarted="currentEventStarted"
       @currentEventState="currentEventState" v-bind:localization="localization"/>
    </div>
  </div>
  <div v-if="showSignIn">
    <SignIn v-bind:users="users" @signedin="setNickname" />
  </div>
  <div v-if="openmodal">
    <LanguageModal v-bind:currentLanguage="currentLanguage" @setCurrentLanguage="this.setCurrentLanguage"
    @closeLanguageModal="this.closeLanguageModal" />
  </div>
  <div v-if="openEventModal">
    <EventModal v-bind:users="users" v-bind:currentChatUser="currentChatUser" v-bind:eventsData="eventsData" @eventUnsubscribe="eventUnsubscribe"
    v-bind:eventsSubscribed="eventsSubscribed" @closeEventModal="openEventModal=false" @eventSubscribe="eventSubscribe" 
    v-bind:currentEventStarted="currentEventStarted" v-bind:localization="localization" v-bind:currentLanguage="currentLanguage"/>
  </div>
</template>

<script>
import io from 'socket.io-client';
import SignIn from './components/SignIn.vue';
import ChatRoom from './components/ChatRoom.vue';
import ChatList from './components/ChatList.vue';
import LanguageModal from './components/LanguageModal.vue';
import EventModal from './components/EventModal.vue';
import LocalizationConfig from './localization.json';

export default {
  name: 'App',
  components: { SignIn, ChatRoom, ChatList, LanguageModal, EventModal },
  data: function (){
    return {
      username: "",
      socket: io("https://babilejo.herokuapp.com/"),
      messages: [],
      users: [], //Contiene los nombre de los usuarios individuales y los eventos
      showSignIn: true,
      currentChatId: "",
      currentChatUser: "",
      currentLanguage: "es",
      openmodal: false,
      unreadMessages: [],
      pushNotifications: false,
      soundNotifications: false,
      titleNotifications:true,
      windowFocus: true,
      unreadMessagesTotal: 0,
      eventsData: [],
      eventsSubscribed: [],
      openEventModal: false,
      currentEventStarted: false,
      localization: []
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
        //Es un mensaje de un evento?
        if(message.isEvent){
          message.usernameFrom = message.usernameTo; 
        }
        //Si lo es, está suscrito a ese evento? Si no lo esta, no notificarle del mensaje
        if(!message.isEvent || (message.isEvent && this.eventsSubscribed.some(event => event === message.usernameFrom))){
          //Actualizar titulo de la pagina
          this.updatePageTitle();
          //Reproducir sonido si es el primer unreadMessage de un usuario o evento y no esta la app en primer plano
          if(this.soundNotifications && !this.windowFocus && this.unreadMessages[this.users.indexOf(message.usernameFrom)]==0){
            var audio = new Audio(require('@/assets/MessageNotificationSoundExtended.wav'));
            audio.play();
            //Si esta en focus el chat se suma igualmente porque esta en segundo plano
            if(this.users.indexOf(message.usernameFrom)==this.currentChatId){
              this.unreadMessages[this.users.indexOf(message.usernameFrom)]++;
            }
          }
          //Añadir a mensajes no leidos si no es el chat actualmente seleccionado
          if(this.users.indexOf(message.usernameFrom)!=this.currentChatId){
            this.unreadMessages[this.users.indexOf(message.usernameFrom)]++;
          }
        }
        //Tienen los dos usuarios el mismo idioma seleccionado?
        if(message.language==this.currentLanguage){
          this.postMessage(message);
        }
        else if(message.language=='epo' || this.currentLanguage=='epo'){
          if(message.language=='epo'){
            this.requestTranslationEsperanto(message, 0).then((result) => {
              message=result;
              //Si el lenguaje objetivo es ingles, enviar a la interfaz, sino, traducir de nuevo a la lengua objetivo
              if(this.currentLanguage=="en"){
                this.postMessage(message);
              }
              else{
                this.requestTranslation(message).then((result) => {
                  this.postMessage(result);
                });
              }
            });
          }
          else if(this.currentLanguage=='epo'){
            this.requestTranslation(message, "en").then((result) => {
              message=result;
              this.requestTranslationEsperanto(message, 1).then((result) => {
                this.postMessage(result);
              });
            });  
          } 
        }
        else{
          this.requestTranslation(message).then((result) => {
            this.postMessage(result);
          });  
        }    
      })
    },
    async requestTranslation(message, targetLanguage = this.currentLanguage) {
      const res = await fetch("https://translate.astian.org/translate", {
        method: "POST",
        body: JSON.stringify({
          q: message.msg,
          source: message.language,
          target: targetLanguage
        }),
        headers: { "Content-Type": "application/json" }
      });
      const json = await res.json();
      message.msg = json.translatedText;
      
      return message;
    },
    async requestTranslationEsperanto(message,direction){
      var langPair=""
      if(direction==0){
        langPair="epo|eng";
        message.language="en";
      }
      else{
        langPair="eng|epo";
        message.language="epo";
      }      
      let requestBody = new URLSearchParams(Object.entries({
        langpair: langPair,
        markUnknown: "no",
        prefs: "",
        q: message.msg
      })).toString();
      const res = await fetch("https://apertium.org/apy/translate", {
      method: "POST",
      body: requestBody,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const json = await res.json();
      message.msg=json.responseData.translatedText;
        
      return message
    },
    postMessage: function (message){
      //Notificaciones de escritorio activadas y si es un evento, estar suscrito
      if((this.pushNotifications && !message.isEvent) || (this.pushNotifications && message.isEvent && this.eventsSubscribed.some(event => event === message.usernameFrom))){
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
    sendMessage: function (msg, isevent = false) {
      let message = {
          isEvent: isevent,
          usernameFrom: this.username,
          usernameTo: this.users[this.currentChatId],
          msg: msg,
          timestamp: this.getTime(),
          language: this.currentLanguage,
          messageNick: this.username
      }
      this.socket.emit('msg', message);
      //Despues de enviarlo para el resto de usuarios, postearlo en mi mismo
      if(message.isEvent){
        message.usernameFrom = this.users[this.currentChatId];
      }
      this.messages.push(message);
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
    },
    setTitleNotifications: function(value){
      this.titleNotifications=value;
    },
    setSoundNotifications: function(value){
      this.soundNotifications=value;
    },
    updatePageTitle: function(){
      //Si no esta la ventana seleccionada, cambiar titulo 
      if(!this.windowFocus && this.titleNotifications){
        this.unreadMessagesTotal++;
        document.title="Babilejo ("+this.unreadMessagesTotal+")";
      }
    },
    eventSubscribe: function(eventName){
      this.eventsSubscribed.push(eventName);
    },
    eventUnsubscribe: function(eventName){
      this.eventsSubscribed.splice(this.eventsSubscribed.indexOf(eventName), 1);
    },
    currentEventState: function(value){
      this.currentEventStarted=value;
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
        this.currentChatUser="";
    });
    this.socket.on('eventList', eventlist => {
      if(eventlist!=null && eventlist!=undefined && eventlist!=""){
        this.eventsData=JSON.parse(eventlist)['events']
      }
    });
  },
  mounted: function() {
    //Asignar archivo de localizacion a su variable
    this.localization = LocalizationConfig
    //Necesita ser un operador arrow para que this no sea undefined
    window.addEventListener('blur', () =>{
      this.windowFocus=false;});
    window.addEventListener('focus', () =>{
      document.title="Babilejo";
      this.unreadMessagesTotal=0; 
      this.windowFocus=true;
      this.unreadMessages[this.currentChatId] = 0;
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
