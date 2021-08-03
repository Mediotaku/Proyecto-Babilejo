<template>
  <div class="chat-search">
    <input type="text" placeholder="Buscar en Babilejo..." />
  </div>
  <div class="chat-list">
    <!--Syntax the clase dinamica: si selected es igual al index actual (slected se guarda con el click), 
    la igual es true y la clase highlight se introduce-->
    <div class="chat-preview" v-for="user in users" :key="users.indexOf(user)" 
    :class="{highlight:users.indexOf(user)==selected,myself:user==username}" 
    @click="selected = users.indexOf(user), selectChat(users.indexOf(user))">
      <img :src="require('@/assets/Icon'+alternateIcon(users.indexOf(user))+'.svg')"/>
      <div class="chat-name" >{{user}}</div>
    </div>
  </div>
  <span class="watermark">Babilejo</span>
</template>

<script>
export default {
  name: 'chatlist',
  props: ['users', 'username'],
  data: function () {
    return {
      selected: undefined
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
  height: 5rem;
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
  height: 3rem;
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
.chat-preview img{
  width: 5rem;
  margin-left: 0.3rem;
}
.chat-name{
  font-family: 'Roboto';
  font-weight: bold;
  font-size: 1.5rem;
  padding-left: 1.2rem;
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