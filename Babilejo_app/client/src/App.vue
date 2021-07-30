<template>
    <div v-if="!showSignIn" class="header">
      <h1>Chatroom</h1>
      <p class="username">Username: {{username}}</p>
      <p class="online">Online: {{users.length}}</p>
    </div>
     <div v-if="showSignIn">
      <SignIn @signedin="setNickname" />
    </div>
</template>

<script>
import io from 'socket.io-client';
import SignIn from './components/SignIn.vue';

export default {
  name: 'App',
  components: { SignIn },
  data: function (){
    return {
      username: "",
      socket: io("http://localhost:3000"),
      messages: [],
      users: [],
      showSignIn: true
    }
  },
  methods: {
    joinServer: function () {
      console.log("voy")
      this.socket.emit('start', this.showSignIn);

      this.listen();
    },
    listen: function () {
      this.socket.on('loggedIn', data => {
        this.messages = data.messages;
        this.users = data.users;
        console.log(this.username)
        this.socket.emit('newuser', this.username);
      });
      this.socket.on('userOnline', user => {
        this.users.push(user);
        console.log(this.users.length);
      });
      this.socket.on('userLeft', user => {
        this.users.splice(this.users.indexOf(user), 1);
      });
      this.socket.on('msg', message => {
        this.messages.push(message);
      })
    },
    setNickname: function(value){
      this.showSignIn=false;
      this.username = value;
      if(!this.username) {
        this.username = "Anonymous";
      }

      this.joinServer();
    }
  },
  mounted: function() {
    /*this.username = prompt("What is your username?", "Anonymous")
    if(!this.username) {
      this.username = "Anonymous";
    }
    this.joinServer();*/

  }
}
</script>

<style>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}
#app {
  display: flex;
  flex-direction: column;
  height: 108vh;
  width: 100%;
  max-width: 768px;
  margin: 0 auto; 
}
</style>
