<template>
  <div>
    <el-dialog 
      v-model="visible" 
      :width="width" 
      :before-close="beforeClose" 
      :show-close="false"
    >
      <template #title class="title">
        <div class="modal-header">
          <div class="modal-title">
            <h1>{{ titulo }}</h1>
          </div>
          <button class="close-button" type="text" @click="cerrar">
            <span class="material-icons">close</span>
          </button>
        </div>
      </template>

      <div class="modal-body" :key="contentKey">
        <slot></slot>
      </div>

      <template #footer>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Modal',
    props:{
      titulo:{
        type: String,
        default: ''
      },
      width:{
        type: String,
        default: '900px'
      },
      icon:{
        type: Object,
        default: null
      },
      impedirClose:{
        type: Boolean,
        default: false
      },
    },

    data() {
      return {
        visible: false,
        contentKey: 0,        
      }
    },

    created() {
      const titulo = this.titulo.toLowerCase
    },

    methods: {
      abrir(){
        this.contentKey = 1,
        this.visible = true
      },

      cerrar(){
        this.visible = false
      },

      beforeClose(done) {
        if (this.impedirClose)
          return

        this.$confirm('¿Está seguro de que desea cerrar la ventana?')
          .then((_) => {
            done()
          })
          .catch(() => { })
      },
    },

  }
</script>

<style scoped>
  .material-icons{
    color: var(--light)
  }
  .modal-header {
    background-color: var(--dark);
    color: var(--light);
    padding: 35px;
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
  }
  .modal-body {
    padding: 35px;
    padding-top: 30px;
    padding-bottom: 10px;
  }
  .modal-footer {
    padding: 35px;
    padding-top: 0px;
  }
  .modal-title {
    display: flex;
    color: var(--light);
    /* font-weight: bold; */
    font-size: 10px;
  }
  .modal-title > * {
    margin: auto;
    margin-left: 0px;
    margin-right: 0px;
  }
  .close-button {
    margin: auto;
    margin-right: 0px;
  }

  .span-cerrar{
    margin-bottom: 40px;
    padding-bottom: 5px;
  }
</style>

<style>
  .el-dialog__header {
    padding: 0px;
    width: 100%;
    background: #f0f0f0;
    border-bottom: 1px solid #ddd;
  }

  .el-dialog {
    margin-top: 8vh !important;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 0 6px 10px 1px rgba(0, 0, 0, 0.2);
  }
  .el-dialog__body {
    padding: 0px;
  }
  .el-dialog__footer {
    padding: 0px;
  }
</style>