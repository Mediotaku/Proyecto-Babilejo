<template>
  <div class="chat-bar">
    <img @click="$emit('openMenu')" id="menu-button" src="@/assets/MenuIcon.svg"/>
    <div class="chat-bar-text" :class="{clickable:isEvent()}" v-if="currentChatUser!=''" @click="openEventMenu">
      {{currentChatUser}}
    </div>
    <div class="chat-bar-text" v-else>
      {{localization[currentLanguage][0].chat_bar_default}}
    </div>
    <div class="language-selector-button" @click="openModal">
      <img :src="require('@/assets/'+currentLanguageIcon(currentLanguage)+'Icon.svg')"/>
      {{currentLanguageName(currentLanguage)}}
    </div>
  </div>
  <div class="chat-window" :class="{backgroundchat:currentChatUser!='','chat-window-event':(isEvent() && !isEventSubscribed()),['background-image-'+currentLanguage]:true}">
    <div class="event-join" :class="{hide:(!isEvent() || isEventSubscribed())}">
      <p v-if="!currentEventStarted">{{localization[currentLanguage][0].event_text1}}</p>
      <p v-else>{{localization[currentLanguage][0].event_text2}}</p>
      <p v-if="!currentEventStarted" class="event-date">{{eventDateFormat()}}</p>
      <p>{{localization[currentLanguage][0].event_text3}}</p>
      <button @click="eventSubscribe" :disabled="!currentEventStarted">{{localization[currentLanguage][0].event_button}}</button>
    </div>
    <div v-if="currentChatUser!=''" class="messages" id="messages-box" :class="{hide:(isEvent() && !isEventSubscribed())}">
      <div :class="{'message-wrap':message.messageNick!=username, 'mymessage-wrap':message.messageNick==username}"
      v-for="message in currentMessages" v-bind:key="messages.indexOf(message)">
        <div :class="{message:message.messageNick!=username, mymessage:message.messageNick==username}">
          <div class="message-full">
            <div class="reply-body" v-if="message.isReply" @click="message.messageOptions=false">
              <div class="username">{{message.replyNick}}</div>
              <div class="message-text">{{message.replyMsg}}</div>
              <div class="message-time">{{message.replyTimestamp}}</div>
            </div>
            <div class="message-body" @click="message.messageOptions=false">
              <div class="username" :class="{hide:message.messageNick==username}">{{message.messageNick}}</div>
              <div class="message-text">{{messageToShow(message)}}</div>
              <div class="message-time">{{message.timestamp}}</div>
            </div>
          </div>
          <img class="message-options" @click="message.messageOptions=!message.messageOptions" :class="{hide:message.messageNick==username}" :src="require('@/assets/message-options.svg')"/>
          <div class="message-options-bubble" v-show="message.messageOptions" :class="{'message-options-bubble-en':currentLanguage=='en'}" >
            <div class="message-options-reply" @click="openPreviewReply(message)">
              <img :src="require('@/assets/message-reply.svg')" />{{localization[currentLanguage][0].message_option_reply}}
            </div>
            <div v-if="message.currentMessageShown==0" class="message-options-original" @click="message.currentMessageShown=1">
              <img :src="require('@/assets/message-original.svg')"/>{{localization[currentLanguage][0].message_option_original}}
            </div>
            <div v-else class="message-options-original" @click="message.currentMessageShown=0">
              <img :src="require('@/assets/message-translation.svg')"/>{{localization[currentLanguage][0].message_option_translate}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentChatUser!=''" class="input-preview" :class="{hide:(isEvent() && !isEventSubscribed()) || !openPreview}">
      <img :src="require('@/assets/message-reply.svg')"/>
      <div class="message-preview">
        <div class="username">{{previewUsername}}</div>
        <div class="message-text">{{previewMsg}}</div>
        <div class="message-time">{{previewTimestamp}}</div>
      </div>
      <img :src="require('@/assets/cancel-preview.svg')" @click="openPreview=false"/>
    </div>
    <div v-if="currentChatUser!=''" class="input-container" :class="{hide:(isEvent() && !isEventSubscribed()), openPreviewMargin:openPreview}" >
      <input type="text" v-model="msg" @keyup.enter="sendMessage" :placeholder="localization[currentLanguage][0].input_message">
      <img @click="sendMessage" src="@/assets/SendIcon.svg"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'chatroom',
  props: ['messages', 'currentChatUser', 'username', 'currentLanguage', 'eventsData', 'eventsSubscribed', 'currentEventStarted', 'localization'],
  emits: ['openLanguageModal', 'sendMessage', 'openMenu', 'eventSubscribe', 'openEventModal', 'currentEventState'],
  data: function () {
    return {
      msg: "",
      eventTime: "",
      openPreview: false,
      previewUsername: "",
      previewMsg: "",
      previewTimestamp: "",
      previewLanguage: ""
    }
  },
  methods: {
    sendMessage: function() {
      this.$emit('sendMessage', this.msg, this.isEvent(), this.openPreview, this.previewUsername, this.previewMsg, this.previewTimestamp, this.previewLanguage);
      this.msg = "";
      this.previewUsername= "",
      this.previewTimestamp= "",
      this.previewMsg= "";
      this.previewLanguage= ""
      this.openPreview=false;
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
      else if(value=="epo"){
        value="Esperanto"
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
      else if(value=="epo"){
        value="Esperanto"
      }
      return value
    },
    openModal: function(){
      this.$emit('openLanguageModal', true);
    },
    isEvent: function(){
      return this.eventsData.some(event => event.title === this.currentChatUser)
    },
    isEventSubscribed: function(){
      return this.eventsSubscribed.some(event => event === this.currentChatUser);
    },
    eventSubscribe: function(){
      this.$emit('eventSubscribe', this.currentChatUser);
    },
    eventDateFormat: function(){
      if(this.currentChatUser!="" && this.currentChatUser!=undefined && this.isEvent()){
        var aux = new Date(this.eventsData[this.eventsData.findIndex(event => event.title === this.currentChatUser)].startDate);
        var options = {hour:"numeric", minute:"numeric", year: 'numeric', month: 'long', day: 'numeric', timeZone: "UTC", timeZoneName: "short"  };
        if(this.currentLanguage=="es"){
          aux = aux.toLocaleDateString("es-ES", options)
        }
        else if(this.currentLanguage=="en"){
          aux = aux.toLocaleDateString("en-GB", options)
        }
        else if(this.currentLanguage=="ja"){
          aux = aux.toLocaleDateString("ja-JP", options)
        }
        else if(this.currentLanguage=="ko"){
          aux = aux.toLocaleDateString("en-GB", options)
        }
        else if(this.currentLanguage=="epo"){
          aux = aux.toLocaleDateString("en-GB", options)
        }
        else if(this.currentLanguage=="fr"){
          aux = aux.toLocaleDateString("en-GB", options)
        }
        return aux
      }
    },
    eventStarted: function(){
      if(this.currentChatUser!="" && this.currentChatUser!=undefined && this.isEvent()){
        var currentTime = new Date();
        if((this.eventTime.getTime()-currentTime.getTime())<0){
          this.$emit('currentEventState', true)
        }
        else{
          this.$emit('currentEventState', false)
        }
      }
      return this.currentEventStarted; 
    },
    openEventMenu: function(){
      if(this.isEvent()){
        this.$emit('openEventModal');
      }
    },
    messageToShow: function(message){
      if(message.currentMessageShown==0){
        return message.msg
      }
      else if(message.currentMessageShown==1){
        return message.originalMsg
      }
    },
    openPreviewReply: function(message){
      message.messageOptions=false;
      this.previewUsername=message.messageNick;
      this.previewMsg=message.msg;
      this.previewTimestamp=message.timestamp;
      this.previewLanguage=message.language;
      this.openPreview=true;
    }
  },
  watch: { 
    currentChatUser: function() { // Comprueba el tiempo de nuevo cuando cambia el focus de evento
      if(this.currentChatUser!="" && this.currentChatUser!=undefined && this.isEvent()){
        this.eventTime = new Date(this.eventsData[this.eventsData.findIndex(event => event.title === this.currentChatUser)].startDate);
      }
      this.eventStarted();
    }
  },
  computed: {
    currentMessages: function() {
      if(this.isEvent()){ //Es un evento?
        return this.messages.filter(m => (m.usernameFrom == this.currentChatUser && m.isEvent == true)).slice().reverse();
      }
      else{
        return this.messages.filter(m => (m.usernameFrom == this.currentChatUser && m.usernameTo == this.username)||
        m.usernameFrom == this.username && m.usernameTo == this.currentChatUser).slice().reverse();
      }
    }
  },
  mounted: function() {
    //Intervalo con el que se calcula el inicio de eventos (10 seg)
    this.interval = setInterval(this.eventStarted,10000)
  },
  beforeUnmount(){
    clearInterval(this.interval);
  }
}
</script>

<style scoped>
/*Classes*/
.hide{
  display: none !important;
}
.chat-window {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-repeat: no-repeat;
  background-position: center;
  height: 91%;
}

.background-image-en{
  /*Es necesario ~ para que la ruta funcione en <style>*/
  background-image: url("~@/assets/Background-en.svg");
}

.background-image-es{
  /*Es necesario ~ para que la ruta funcione en <style>*/
  background-image: url("~@/assets/Background-es.svg");
}

.background-image-ja{
  /*Es necesario ~ para que la ruta funcione en <style>*/
  background-image: url("~@/assets/Background-jp.svg");
}

.background-image-fr{
  /*Es necesario ~ para que la ruta funcione en <style>*/
  background-image: url("~@/assets/Background-es.svg");
}

.background-image-ko{
  /*Es necesario ~ para que la ruta funcione en <style>*/
  background-image: url("~@/assets/Background-es.svg");
}

.background-image-epo{
  /*Es necesario ~ para que la ruta funcione en <style>*/
  background-image: url("~@/assets/Background-es.svg");
}

.chat-window-event{
  justify-content: center;
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
  font-size: 2em;
  color:white;
  margin-left: 8%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  cursor: auto;
}

.clickable{
  cursor: pointer;
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
  white-space: nowrap;
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
  margin-left: 12%;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.47);
  margin-bottom:2rem;
  word-break: break-word;
  display: flex;
  flex-direction: row;
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

.message-full{
  display: flex;
  flex-direction: column;
}


.username{
  font-family: 'Roboto';
  font-weight: bold;
  font-size: 0.8rem;
  color:#1DDB49;
  padding-bottom: 0.2rem;
  margin-right: 0.5rem;
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
  margin-right: 12%;
  box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom:2rem;
  word-break: break-word;
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

.message-options{
  max-width: 1.5rem;
  align-self: flex-start;
}

.input-container{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #FFFFFF;
  box-shadow: 1px 1px 14px rgba(0, 0, 0, 0.25);
  border-radius: 68px;
  width: 80%;
  height: 4rem;
  align-self: center;
  margin-bottom: 3rem;
  margin-top: 3rem;
}

.openPreviewMargin{
  margin-top: 0;
}

.input-container input{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 18px;
  border: 1px solid white; 
  border-radius: 68px;
  width: 90%;
  margin-left: 0.5rem;
  outline: none;
}

.input-container img {
  max-width: 2.5rem;
  margin-right: 0.5rem;
  height: auto;
  cursor: pointer;
}

.input-preview{
  width: 75%;
  min-height: 8rem;
  background: #FFFFFF;
  align-self: center;
  border-radius: 30px 30px 0px 0px;
  display: flex;
}

.input-preview img{
  width: 2rem;
  margin-left: 1rem;
}

.input-preview img:nth-of-type(2){
  width: 1.5rem;
  margin-left: auto;
  margin-right: 1rem;
  margin-top: 1rem;
  align-self: flex-start;
  cursor: pointer;
}

.message-preview{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.2rem;
  color:black;
	background: #FAFAFA;
	border-radius: 25px;
  max-width: 20rem;
  padding: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.47);
  margin-top: 1rem;
  margin-bottom: 1rem;
  word-break: break-word;
}

.reply-body{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.2rem;
  color:black;
	background: #FAFAFA;
	border-radius: 25px;
  max-width: 20rem;
  padding: 1rem;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.47);
  margin-bottom: 0.5rem;
  word-break: break-word;
}

.event-join{
  font-family: Roboto;
  font-style: normal;
  font-size: 14px;
  color: white;
  width: 25rem;
  background: #5E60CE;
  border-radius: 157px;
  padding:0 1rem 1rem 1rem;
  text-align: center;
  align-self: center;
  margin-top: auto;
  margin-bottom: auto;
}

.event-join p:nth-child(1){
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
}
.event-date{
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
  font-size: 18px;
  background-color: white;
  color: black;
  border-radius: 157px;
  padding: 0.5rem;
}
.event-join p:nth-child(3){
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
}
.event-join button{
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
  cursor: pointer;
}

.event-join button:disabled{
  background: silver;
  border: 1px solid silver; 
  color: rgb(240, 232, 232);
  cursor: auto;
}

.message-options-bubble{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 18px;
  position: absolute;
  z-index:6;
  background: #F2F2F2;
  color: #766969;
  width: 165px;
  height: 65px;
  padding: 10px 5px 5px 5px;
  filter: drop-shadow(3px 3px 4px rgba(0, 0, 0, 0.2));
  border-radius: 14px;
  top: -70px;
  right: -117px;
}

.message-options-bubble-en{
  width: 180px;
  right: -129px;
}

.message-options-reply{
  margin-left: 10px;
  display:flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}
.message-options-reply img{
  margin-right: 5px;
}
.message-options-original{
  margin-left: 10px; 
  display:flex;
  align-items: center;
  cursor: pointer;
}
.message-options-original img{
  margin-right: 5px;
}

.message-options-bubble:after {
  content: '';
  position: absolute;
  display: block;
  width: 0;
  z-index: 1;
  border-style: solid;
  border-color: #F2F2F2 transparent;
  border-width: 19px 12px 0;
  bottom: -19px;
  left: 17%;
  margin-left: -12px;
}

/*IDs*/

#menu-button{
  width: 3em;
  padding-left: 1rem;
  display: none;
  cursor: pointer;
}

@media (max-width: 1000px){
  .chat-window{
    background-size: contain;
  }
}

@media (max-width: 800px) {
  #menu-button{
    display: block;
  }
  .chat-bar-text{
    font-size: 5vw !important;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    white-space: normal !important;
  }
  .language-selector-button{
    font-size: 1rem;
  }
  .language-selector-button img {
    width: 2.5rem;
  }
  .message{
    margin-bottom:1rem;
  }
  .mymessage{
    margin-bottom:1rem;
  }
  .input-container input{
    margin-left: 1rem;
  }
  .event-join{
    width: 18rem;
  }
  .event-join p:nth-child(1){
    width: 10rem;
    margin-left: auto;
    margin-right: auto;
  }
  .event-date{
    width: 15rem;
  }
  .event-join p:nth-child(3){
    width: 16rem;
    margin-left: auto;
    margin-right: auto;
  }
  .input-preview{
    width: 65%;
  }
  .message-preview{
    font-size: 0.8rem;
  }
}
@media (max-width: 325px){
  .chat-bar-text{
    font-size: 4vw !important;
    padding-left: 0.1rem;
  }
}
@media (max-height: 600px) {
  .chat-bar-text{
    font-size: 1.5rem;
    padding-left: 3.5rem;
  }
  .language-selector-button{
    font-size: 1rem;
  }
  .language-selector-button img {
    width: 2.5rem;
  }
  .chat-bar{
    min-height: 12%;
  }
}
@media (max-width: 550px){
  .message-options-bubble{
    top: -70px;
    right: -7px;
  }
  .message-options-bubble:after {
    left: 80%;
    margin-left: -12px;
  }
}
</style>