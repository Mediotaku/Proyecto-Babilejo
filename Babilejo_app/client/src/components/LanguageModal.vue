<template>
  <div id="myModal" class="modal" @click="$emit('closeLanguageModal')">
    <div class="modal-content" @wheel="handleWheel()">
      <img :src="require('@/assets/'+currentLanguageIcon(localcurrentLanguage)+'Icon.svg')"/>
      <div class="wheel-selector">
        <div class="wheel-selector-text wheel2">{{currentLanguageName(languageSelectorArray[0])}}</div>
        <div class="wheel-selector-text wheel1">{{currentLanguageName(languageSelectorArray[1])}}</div>
        <div class="wheel-selector-text-bold">{{currentLanguageName(languageSelectorArray[2])}}</div>
        <div class="wheel-selector-text wheel1">{{currentLanguageName(languageSelectorArray[3])}}</div>
        <div class="wheel-selector-text wheel2">{{currentLanguageName(languageSelectorArray[4])}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['currentLanguage'],
   data: function () {
    return {
      languageArray: ['ko','ja','es','fr','en'],
      languageSelectorArray: [],
      localcurrentLanguage: this.currentLanguage
    }
  },
  methods: {
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
    handleWheel: function() {
      window.addEventListener('wheel', this.handleWheelThis)
    },
    handleWheelThis: function(event){
      var initialindex=this.languageArray.indexOf(this.currentLanguage)
        if (event.deltaY < 0) {
            //console.log("scrolling up")
            initialindex--;
            if(initialindex<0){
              initialindex=this.languageArray.length-1;
            }
            this.$emit('setCurrentLanguage', this.languageArray[initialindex]);
        } else if (event.deltaY > 0) {
            //console.log("scrolling down")         
            initialindex++;
            if(initialindex>(this.languageArray.length-1)){
              initialindex=0;
            }
            this.$emit('setCurrentLanguage', this.languageArray[initialindex]);
        }
        this.localcurrentLanguage=this.languageArray[initialindex];
        this.renderLanguageList(initialindex);
    },
    renderLanguageList: function(value){
      var index1=value-2;
      if(index1<0){
        index1=this.languageArray.length+index1;
      }
      var index2=value-1;
      if(index2<0){
        index2=this.languageArray.length+index2;
      }
      var index3=value+1;
      if(index3>(this.languageArray.length-1)){
        index3=index3-this.languageArray.length;
      }
      var index4=value+2;
      if(index4>(this.languageArray.length-1)){
        index4=index4-this.languageArray.length;
      }
      //console.log(index1,index2,value,index3,index4);
      this.languageSelectorArray=[this.languageArray[index1],this.languageArray[index2],
      this.languageArray[value],this.languageArray[index3],this.languageArray[index4]];      
    }
  },
  //Antes de generar el DOM
  created: function() {
    //Posicion 0
    var initialindex=this.languageArray.indexOf(this.currentLanguage)
    this.renderLanguageList(initialindex);
  },
  //Eliminar evento antes de cerrar el componente
  beforeUnmount() {
    window.removeEventListener('wheel', this.handleWheelThis);
  }
}
</script>

<style scoped>
/* The Modal (background) */
.modal {
  position: fixed;
  z-index: 3; 
  padding-top: 20rem;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(119, 119, 119, 0.59);
}

/* Modal Content */
.modal-content {
  display: flex;
  align-items: center;
  background: #5E60CE;
  border-radius: 157px;
  margin: auto;
  padding: 20px;
  width: 28rem;
  box-shadow: 1px 1px 14px rgba(0, 0, 0, 0.25);
}
.modal-content img{
  width: 10rem;
  height: auto;
}
.wheel-selector {
  width: 17.3rem;
  height: 9rem;
  background: url("~@/assets/BackgroundSelector.svg");
  background-repeat: no-repeat;
  background-size: cover;
}
.wheel-selector-text{
  font-family: 'Roboto';
  font-weight: normal;
  font-size: 1.2rem;
  margin-bottom: 0.35rem;
}
.wheel-selector-text-bold{
  font-family: 'Roboto';
  font-weight: bold;
  font-size: 1.2rem;
  margin-left: 1.8rem;
  margin-bottom: 0.35rem;
}
.wheel1 {
  margin-left: 1.5rem;
}
.wheel2 {
  margin-left: 1.1rem;
}
</style>