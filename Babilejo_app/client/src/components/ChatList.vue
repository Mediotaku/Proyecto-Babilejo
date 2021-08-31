<template>
  <div class="chat-search">
    <div id="animate-button">
      <img id="back-button-x2" @click="toggleNotificationsVar=false,toggleAboutVar=false" :class="{'visible-settings':toggleNotificationsVar || toggleAboutVar}" src="@/assets/BackIconx2.svg"/>
      <img id="back-button" @click="toggleSettingsVar=!toggleSettingsVar" :class="{'back-button-rotated':toggleSettingsVar,'hidden-settings':toggleNotificationsVar || toggleAboutVar}" src="@/assets/BackIcon.svg"/>
      <img id="settings-button" @click="toggleSettingsVar=!toggleSettingsVar" :class="{'settings-button-rotated':toggleSettingsVar}" src="@/assets/SettingsIcon.svg"/>
    </div>
    <input id="chat-input" :class="{'hidden-settings':toggleSettingsVar}" type="text" v-model="search" :placeholder="localization[currentLanguage][0].search_bar_placeholder" />
    <div class="settings-name" :class="{'visible-settings':toggleSettingsVar && !toggleNotificationsVar && !toggleAboutVar}">{{localization[currentLanguage][0].settings_bar}}</div>
    <div class="settings-name" :class="{'visible-settings':toggleNotificationsVar && !toggleAboutVar}">{{localization[currentLanguage][0].notification_option}}</div>
    <div class="settings-name" :class="{'visible-settings':toggleAboutVar}">{{localization[currentLanguage][0].about_option}}</div>
  </div>
  <div class="chat-list">
    <!--Syntax the clase dinamica: si selected es igual al index actual (selected se guarda con el click), 
    la igual es true y la clase highlight se introduce-->
    <div class="chat-preview" v-for="user in filteredUsers" :key="users.indexOf(user)" 
    :class="{highlight:users.indexOf(user)==selected, myself:user==username, 'hidden-settings':toggleSettingsVar}" 
    @click="selected = users.indexOf(user), selectChat(users.indexOf(user))">
      <div class="chat-preview-img">
        <img :class="{hide:eventsData.some(event => event.title === user)}" :src="require('@/assets/Icon'+alternateIcon(users.indexOf(user))+'.svg')"/>
        <div class="image-cropper" :class="{hide:!eventsData.some(event => event.title === user)}">  
          <img :src="eventImage(user)"/>
        </div>
        <span class="messages-number" :class="{zerodigit:unreadMessages[users.indexOf(user)]==0,
        onedigit:unreadMessages[users.indexOf(user)]<=9,
        twodigit:unreadMessages[users.indexOf(user)]>9}">{{unreadMessages[users.indexOf(user)]}}</span>
      </div>
      <div class="chat-data">
        <div class="event-flag" :class="{hide:!eventsData.some(event => event.title === user), flagjp:currentLanguage=='ja', flagen:currentLanguage=='en'}">{{localization[currentLanguage][0].event_flag}}</div>
        <div class="chat-name" >{{user}}</div>
        <div class="chat-last" >{{lastMessage(user)}}</div>
      </div>
    </div>
    <div id="settings-options" :class="{'visible-settings':toggleSettingsVar}">
      <div class="settings-user">
        <img :src="require('@/assets/Icon'+alternateIcon(users.indexOf(username))+'.svg')"/>
        <div class="settings-username">{{username}}</div>
      </div>
      <div class="settings-container-outer" 
      :class="{'notifications-opened':toggleNotificationsVar,'about-opened':toggleAboutVar}">
        <div class="settings-container">
          <div @click="toggleNotificationsVar=!toggleNotificationsVar" class="settings-option" :class="{'settings-option-jp':currentLanguage=='ja'}">
            <img :src="require('@/assets/NotificationIcon.svg')"/>
            <div>{{localization[currentLanguage][0].notification_option}}</div>
          </div>
          <div @click="toggleAboutVar=!toggleAboutVar" class="settings-option" :class="{'settings-option-jp':currentLanguage=='ja'}">
            <img :src="require('@/assets/BabilejoB.svg')"/>
            <div>{{localization[currentLanguage][0].about_option}}</div>
          </div>
        </div>
        <div class="settings-notifications" :class="{'visible-settings':toggleNotificationsVar,'settings-notifications-jp':currentLanguage=='ja'}">
          <label><input type="checkbox" value="push_checkbox" v-model="push_checkbox" @change="$emit('pushNotifications', push_checkbox)">{{localization[currentLanguage][0].notification_option1}}</label><br>
          <label><input type="checkbox" value="sound_checkbox" v-model="sound_checkbox" @change="$emit('soundNotifications', sound_checkbox)">{{localization[currentLanguage][0].notification_option2}}</label><br>
          <label><input type="checkbox" value="title_checkbox" v-model="title_checkbox" @change="$emit('titleNotifications', title_checkbox)">{{localization[currentLanguage][0].notification_option3}}</label><br>
        </div>
        <div class="settings-about" :class="{'visible-settings':toggleAboutVar}">
          <img :src="require('@/assets/BabilejoLogoSmall.svg')"/>
          <p>{{localization[currentLanguage][0].about_p1}}</p> 
          <p>{{localization[currentLanguage][0].about_p2}}</p><p>{{localization[currentLanguage][0].about_p3}}</p>
        </div>
      </div>
    </div>
  </div> 
  <span class="watermark">Babilejo</span>
</template>

<script>
export default {
  name: 'chatlist',
  props: ['users', 'username', 'unreadMessages', 'messages', 'eventsData', 'currentLanguage', 'localization'],
  emits: ['selectChat', 'pushNotifications', 'titleNotifications','soundNotifications'],
  data: function () {
    return {
      selected: undefined,
      search:"",
      toggleSettingsVar: false,
      toggleNotificationsVar: false,
      toggleAboutVar: false,
      push_checkbox: false,
      sound_checkbox: false,
      title_checkbox: true
    }
  },
  methods: {
    selectChat: function(currentChatId) {
      this.$emit('selectChat', currentChatId);
    },
    alternateIcon: function(value){ 
      while(value>5){
        value= Math.floor(value/5);
      }
      if(value<0){
        value=0;
      }
      return value
    },
    lastMessage: function(currentChat){
      var chatpreview="";
      if(this.messages!=undefined){
        for(var i=this.messages.length-1;i>=0;i--){
          if(this.messages[i].usernameFrom==currentChat || this.messages[i].usernameTo==currentChat){
            chatpreview=this.messages[i].msg;
            break;
          }
        }
      }
      return chatpreview;
    },
    eventImage: function(user){
      if(this.eventsData.some(event => event.title === user)){ //Primero, es un evento?
        if(this.eventsData[this.eventsData.findIndex(event => event.title === user)].img===""){
          return require('@/assets/Icon'+this.alternateIcon(this.users.indexOf(user))+'.svg');
        }
        else{
          return 'https://babilejo.herokuapp.com/eventIcons/'+this.eventsData[this.eventsData.findIndex(event => event.title === user)].img;
        }
      }
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {return user.toLowerCase().includes(this.search.toLowerCase())})
    }
  } 
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bellota:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');
.hide{
  display: none;
}
div.myself {
  display: none;
}
.chat-search{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #797BE8;
  box-shadow: 1px 1px 14px rgba(0, 0, 0, 0.47);
  border-radius: 0 68px 68px 0;
  height: 9%;
  position: relative;
  right: -2.2em;
  width: 110%;
  left: -0.4em;
}
.chat-search input{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 18px;
  text-indent: 20px;
  border-radius: 68px;
  border: 1px solid white; 
  width: 18rem;
  min-width: 3rem;
  height: 60%;
  align-self: center;
  margin-right: 1.6rem;
  resize: horizontal;
  transition: opacity 0.5s ease-in, visibility 0.5s ease-in;
}
.chat-search input::placeholder{
  text-overflow:ellipsis;
}
.chat-list{
  width: calc(100% / 1.05);
  flex-grow: 1;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 2;
  position: relative;
}
.chat-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 1rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  border-radius: 30px;
  background-color: white;
  height: 5.7rem;
  cursor: pointer;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.5s ease-in, visibility 0.5s ease-in;
 }
.chat-preview:hover{
  background-color: #E8E8E8;
}
.chat-preview.highlight{
  background-color: #E8E8E8;
}
.chat-preview-img{
  position: relative;
  display: flex;
}
.chat-preview-img img{
  width: 5rem;
  margin-left: 0.3rem;
  align-self: center;
}
.image-cropper{
  width: 73px;
  height: 73px;
  min-width: 73px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  margin-left: 0.5rem;
  align-self: center;
}

.image-cropper img{
  display: inline;
  margin: -5px 0px 0px -5px;
  margin-left: -5px;
  height: 112%;
  width: auto;
}
.messages-number{
  position:absolute; 
  left: 58px;
  top: 52px;
  background-color: #1DDB49;
  border: #FFFFFF 1px solid;
  border-radius: 50%;
  display: block;
  font-family: 'Roboto';
  font-weight: normal;
  color: white;
  text-align: center;
  line-height: 25px;
}
.zerodigit{
  display: none;
}
.onedigit{
  padding-left: 8px;
  padding-right: 8px;
}
.twodigit{
  padding-left: 3.5px;
  padding-right: 3.5px;
}
.chat-name{
  font-family: 'Roboto';
  font-weight: bold;
  font-size: 1.5rem;
  padding-left: 1.2rem;
  max-width: 15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.event-flag{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 0.8rem;
  margin-left: 0.8rem;
  margin-bottom: 0.2rem;
  padding: 2px;
  padding-left: 0.5em;
  color:white;
  background-color: #5E60CE;
  width: 2.7rem;
  border-radius: 26px;
}

.flagjp{
  width: 3.4rem;
}

.flagen{
  width: 2.3rem;
}

.chat-data {
  width: 100%;
  min-width: 0;
}
.chat-last{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1rem;
  padding-left: 1.2rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding-top: 0.2rem;
}
.watermark{
  position: absolute;
  bottom: 0;
  align-self: center;
  font-family: 'Bellota';
  font-weight: bold;
  font-size: 3.8rem;
  color: #E2D2D2;
  margin-bottom: 2.5rem;
  margin-right: 2rem;
}

#animate-button{
  position: relative;
  min-width: 2.8rem;
  max-width: 3rem;
  min-height: 2.8rem;
  max-height: 3rem;
  margin-left: 2rem;
  margin-right: 2rem;
  cursor: pointer;
}

#animate-button img{
  position:absolute;
  width: 100%;
  height: 100%;
}

#settings-button{
  transition: transform 0.8s ease-in, opacity 0.8s ease-in, visibility 0.8s ease-in;
}

#back-button{
  transform: rotate(-0.5turn);
  opacity: 0;
  visibility: hidden;
  transition: transform 0.8s ease-in, opacity 0.8s ease-in, visibility 0.8s ease-in;
}

#back-button-x2{
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.8s ease-in, visibility 0.8s ease-in;
}

.settings-button-rotated{
  transform: rotate(0.4turn);
  opacity: 0;
  visibility: hidden;
}

.back-button-rotated{
  transform: rotate(0turn) !important;
  opacity: 1 !important;
  visibility: visible !important;
}

.settings-name{
  position: absolute;
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 2rem;
  color: white;
  margin-left: 40%;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease-in, visibility 0.5s ease-in;
}
.settings-name:nth-of-type(3){
  margin-left: 30%;
}
.settings-name:nth-of-type(4){
  margin-left: 28%;
}
.hidden-settings{
  opacity: 0 !important;
  visibility: hidden !important;
}

.visible-settings{
  opacity: 1 !important;
  visibility: visible !important;
}

#settings-options{
  position: absolute;
  top: 3rem;
  left: 2rem;
  display: flex;
  flex-direction: column;
  opacity: 0;
  visibility: hidden;
  z-index: 3;
  transition: opacity 0.5s ease-in, visibility 0.5s ease-in;
}

.settings-user{
  display: flex;
  align-items: center;
}
.settings-user img{
  width:5rem;
}

.settings-about{
  display: flex;
  flex-direction: column;
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.3rem;
  text-align: center;
  margin-top: 2rem;
  margin-left: 2rem;
  opacity:0;
  visibility: hidden;
  background-color: white;
  transition: opacity 0.5s ease-in, visibility 0.5s ease-in;
}

.settings-about img{
  width:10rem;
  margin-left: 1.5rem;
}

.settings-username{
  font-family: 'Roboto';
  font-weight: bold;
  font-size: 2rem;
  margin-left: 1rem;
  width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.settings-option{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.3rem;
  color: #645656;
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
  margin-left: 1rem;
  cursor: pointer;
  transition: opacity 0.5s ease-in, visibility 0.5s ease-in;
}

.settings-option-jp{
  width: 15rem;
}

.settings-option img{
  width: 3rem;
  margin-right: 1rem;
}

.settings-option:nth-child(2){
  margin-left: 1.25rem;
}
.settings-option:nth-child(2) img{
  width: 2.5rem;
  margin-right: 1.25rem;
}

.settings-notifications{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.2rem;
  color: #645656;
  margin-left: 9rem;
  margin-top: 2rem;
  min-width: 20rem;
  opacity:0;
  visibility: hidden;
  transition: opacity 0.5s ease-in, visibility 0.5s ease-in;
}

.settings-notifications-jp{
  margin-left: 6rem !important;
}

.settings-notifications input{
  width: 1.2rem;
  height: 1.2rem;
  margin-bottom: 0.7rem; 
  margin-right: 0.5rem;
}

.settings-container-outer{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 50rem;
  transition: transform 600ms ease-in;
}

.notifications-opened{
  transform: translateX(-21rem);
}

.about-opened{
  transform: translateX(-41rem);
}
@media (max-height: 600px) {
  .chat-search{
    height: 4.5rem;
  }
}
@media (max-width: 800px){
  .chat-search{
    width: 114%;
  }
  .settings-about{
    margin-left: 1rem;
  }
}
@media (max-width: 400px){
  #settings-options{
    left: 1rem;
  }
}
@media (max-width: 450px){
  .settings-notifications{
    margin-left: 8rem;
  }
  .settings-notifications-jp{
    margin-left: 5rem !important;
  }
}
@media (max-width: 370px){
  .settings-notifications{
    margin-left: 7rem;
  }
}

@media (max-width: 950px) and (min-width: 800px){
  #settings-options{
    left: 1rem;
  }
}
@media (max-width: 1000px) and (min-width: 800px){
  .settings-name:nth-of-type(3){
    font-size: 1.7rem;
  }
}
@media (max-width: 1150px) and (min-width: 800px){
  .settings-notifications{
    min-width: 14rem;
  }
  .settings-about{
    margin-left: 4rem;
  }
}  
@media (max-width: 1200px) and (min-width: 800px) and (min-height: 600px){
  .chat-search{
    width: 115%;
  }
}
</style>