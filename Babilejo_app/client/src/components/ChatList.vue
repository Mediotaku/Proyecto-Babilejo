<template>
  <div class="chat-search">
    <input type="text" v-model="search" placeholder="Buscar en Babilejo..." />
  </div>
  <div class="chat-list">
    <!--Syntax the clase dinamica: si selected es igual al index actual (selected se guarda con el click), 
    la igual es true y la clase highlight se introduce-->
    <div class="chat-preview" v-for="user in filteredUsers" :key="users.indexOf(user)" 
    :class="{highlight:users.indexOf(user)==selected,myself:user==username}" 
    @click="selected = users.indexOf(user), selectChat(users.indexOf(user))">
      <div class="chat-preview-img">
        <img :src="require('@/assets/Icon'+alternateIcon(users.indexOf(user))+'.svg')"/>
        <span class="messages-number" :class="{zerodigit:unreadMessages[users.indexOf(user)]==0,
        onedigit:unreadMessages[users.indexOf(user)]<=9,
        twodigit:unreadMessages[users.indexOf(user)]>9}">{{unreadMessages[users.indexOf(user)]}}</span>
      </div>
      <div class="chat-data">
        <div class="chat-name" >{{user}}</div>
        <div class="chat-last" >{{lastMessage(user)}}</div>
      </div>
    </div>
  </div>
  <span class="watermark">Babilejo</span>
</template>

<script>
export default {
  name: 'chatlist',
  props: ['users', 'username', 'unreadMessages', 'messages'],
  emits: ['selectChat'],
  data: function () {
    return {
      selected: undefined,
      search:""
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

div.myself {
  display: none;
}
.chat-search{
  display: flex;
  justify-content: flex-end;
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
  height: 60%;
  align-self: center;
  margin-right: 1.6rem;
}
.chat-list{
  width: calc(100% / 1.05);
  flex-grow: 1;
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
}
.chat-last{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1rem;
  padding-left: 1.2rem;
  width: 15rem;
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
</style>