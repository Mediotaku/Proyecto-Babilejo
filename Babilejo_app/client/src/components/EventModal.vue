<template>
<div class="event-modal" >
    <div class="event-modal-content">
      <div class="event-modal-header">
        <div class="image-cropper">  
          <img :src="eventImage()"/>
        </div>  
        <div>
          <div class="event-modal-title">{{currentChatUser}}</div>
          <div class="event-modal-date">
            <div class="event-flag" :class="{flagjp:currentLanguage=='ja'}">{{localization[currentLanguage][0].event_flag}}</div>
            <div>{{localization[currentLanguage][0].event_date + eventDateFormat()}}</div>
          </div>
        </div>
      </div>
      <div class="event-modal-description">
        <p>{{localization[currentLanguage][0].event_description}}</p>
        <p>{{eventsData[eventsData.findIndex(event => event.title === currentChatUser)].description}}</p>
      </div>
      <div class="event-modal-footer">
        <div @click="$emit('closeEventModal')" :class="{fullength:!currentEventStarted}">{{localization[currentLanguage][0].event_close}}</div>
        <div @click="eventButton" :class="{redtext:buttonText()===localization[currentLanguage][0].event_leave, hidden:!currentEventStarted}">{{buttonText()}}</div>
      </div>    
    </div>
  </div>
</template>

<script>
export default {
  name: 'eventmodal',
  props: ['users','currentChatUser', 'eventsData', 'eventsSubscribed', 'currentEventStarted', 'currentLanguage', 'localization'],
  emits: ['closeEventModal', 'eventSubscribe', 'eventUnsubscribe'],
  data: function () {
    return {
      test: ""
    }
  },
  methods: {
    eventDateFormat: function(){
      if(this.currentChatUser!="" && this.currentChatUser!=undefined){
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
    alternateIcon: function(value){ 
      while(value>5){
        value= Math.floor(value/5);
      }
      if(value<0){
        value=0;
      }
      return value
    },
    eventImage: function(){
      if(this.eventsData[this.eventsData.findIndex(event => event.title === this.currentChatUser)].img===""){
        return require('@/assets/Icon'+this.alternateIcon(this.users.indexOf(this.currentChatUser))+'.svg');
      }
      else{
        return 'https://babilejo.herokuapp.com/eventIcons/'+this.eventsData[this.eventsData.findIndex(event => event.title === this.currentChatUser)].img;
      }
    },
    isEventSubscribed: function(){
      return this.eventsSubscribed.some(event => event === this.currentChatUser);
    },
    buttonText: function(){
      if(!this.isEventSubscribed()){
        return this.localization[this.currentLanguage][0].event_join
      }
      else{
        return this.localization[this.currentLanguage][0].event_leave
      }
    },
    eventButton: function(){
      if(!this.isEventSubscribed()){
        this.$emit('eventSubscribe', this.currentChatUser);
      }
      else{
        this.$emit('eventUnsubscribe', this.currentChatUser);
      }
    }
  }
}
</script>

<style scoped>
.hidden{
  display:none !important;
}
.event-modal{
  position: fixed;
  z-index: 5; 
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(119, 119, 119, 0.59);
}

.event-modal-content{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 59px;
  width: 34rem;
  padding: 1.3rem 0rem 0rem 0rem;
}

.image-cropper{
  width: 100px;
  height: 100px;
  min-width: 100px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  border: 5px solid #5E60CE;
}

.image-cropper img{
  display: inline;
  margin: -5px 0px 0px -5px;
  margin-left: -5px;
  height: 112%;
  width: auto;
}

.event-modal-title{
  font-weight: bold;
  font-size: 1.8rem;
  margin-left: 1.3rem;
  margin-bottom: 0.5rem;
}

.event-flag{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 0.8rem;
  margin-left: 0.8rem;
  margin-right: 0.5rem;
  margin-bottom: 0.2rem;
  padding: 2px;
  padding-left: 0.5em;
  color:white;
  background-color: #5E60CE;
  width: 2.7rem;
  height: 0.95rem;
  border-radius: 26px;
}

.flagjp{
  width: 3.4rem;
}

.event-modal-header{
  display: flex;
  flex-direction: row;
  align-items: center;
}

.event-modal-date{
  display: flex;
  flex-direction: row;
}
.event-modal-description{
  width: 90%;
}
.event-modal-description p:nth-of-type(1){
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 1.3rem;
  line-height: 28px;
  letter-spacing: 0.0095em;
  color: #645656;
}

.event-modal-description p:nth-of-type(2){
  font-size: 1rem;
  color: #141414;
}

.event-modal-footer{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 3.5rem;
  margin-top: 1.5rem
}
.event-modal-footer div{
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  font-size: 1.3rem;
  color: #5E60CE;
  width: 50%;
  text-align: center;
  border-style: solid;
  border-color: #5E60CE;
  border-radius: 59px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(159, 161, 242, 0.47);
  cursor: pointer;
}

.redtext{
  color: #C84D4D !important;
}

.event-modal-footer div:nth-of-type(1){
  border-radius: 0px 0px 0px 59px;
  border-width: 3px 0px 0px 0px;
}
.fullength{
  width: 100% !important;
  border-radius: 0px 0px 59px 59px !important;
}
.event-modal-footer div:nth-of-type(2){
  border-radius: 0px 0px 59px 0px;
  border-width: 3px 0px 0px 3px;
}

@media (max-width: 800px) and (min-height: 500px){
  .event-modal-content{
    width: 21rem;
  }
  .event-modal-title{
    width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .image-cropper{
    width: 80px;
    height: 80px;
    min-width: 80px;
    margin-left: 1rem;
  }
  .image-cropper img{
    margin: -4px 0px 0px -5px;
    margin-left: -6px;
    width: 115%;
  }
  .event-modal-date{
    flex-direction: column;
  }
  .event-modal-date div:nth-of-type(2){
    width: 12rem;
    padding-left: 1rem;
  }
  .event-modal-description p:nth-of-type(2){
    text-align: justify;
    text-justify: auto;
  }
  .event-modal-footer div{
    font-size: 1rem;
  }
  .event-modal-footer div:nth-of-type(1){
    padding-left: 1rem;
  }
  .event-modal-footer div:nth-of-type(2){
    padding-right: 1rem;
  }
}
</style>