<template>
  <div>
    <button type="button" :class="buttonClass" :disabled="disabled" class="btn">
      <div class="button-slot">
        <slot></slot>
      </div>
      <div class="button-highlight"></div>
    </button>
  </div>
</template>

<script>
  export default {
    name: "boton",
    props:{
      round:{
        type: Boolean,
        default: false,
      },

      disabled:{
        type: Boolean,
        default: false,
      },

      size:{
        type: String,
        default: "medium",
      },

      type:{
        type: String,
        default: "default",
      },

      circle:{
        type: String,
        default: false,
      }
    },

    data() {
      return {
        
      }
    },
  }
</script>

<style>
  .btn{
    background-color: var(--dark);
    padding: 10px;
    border-radius: 5px;
    color: var(--light); 
    font-size: 14px;  
  }

  .btn:hover{
    background-color: var(--dark-alt);
  }
</style>