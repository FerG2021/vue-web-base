<template>
  <div>
    <modal ref="modal" titulo="Eliminar usuario" :impedir-close="impedirClose">
      <div>
        <h3>¿Desea eliminar el usuario?</h3>
            <div style="float:right">
                <el-button 
                    type="danger"
                    @click="cerrar()"
                >
                    Cancelar
                </el-button>
                <el-button 
                    type="primary"
                    @click="eliminar()"
                >
                    Confirmar
                </el-button>
            </div>
      </div>
    </modal>
  </div>
</template>

<script>
    import { ElMessage, ElMessageBox } from 'element-plus'

  name:'nuevoProducto'
  export default {
    data() {
      return {
        form:{
          nombre: null,
          precio: null,
          stock: null,
        },
        id: null,
        articulos: [],
      }
    },

    methods:{
      abrir(id){
        this.id = null
        this.$refs.modal.abrir()
        this.id = id
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async eliminar(){
        const respuestaApi = await this.axios.delete("/api/usuario/eliminar/" + this.id)

        if (respuestaApi.data.code == 200) {
            ElMessage({
              type: 'success',
              message: '¡Usuario eliminado con éxito!',
            })
            this.$emit('actualizarTabla')
            this.cerrar()
        } else {
            if (respuestaApi.data.code == 400) {
              let erroresMostrar = "// ";
              let erorres = Object.values(respuestaApi.data.data)

              erorres.forEach((elemento) => {                
                erroresMostrar = erroresMostrar + " " + elemento + " //";
              })

              ElMessage({
                type: 'error',
                grouping: true,
                message: erroresMostrar,
                duration: 5000,
              })
            }
        }
        
        



        //     .then(response =>{
        //         ElMessage({
        //             message: 'Producto eliminado con éxito',
        //             type: 'success',
        //         })    
        //         this.$emit('actualizarTabla')
        //         this.cerrar()
        //     }
        // )   
      },
      
    }
  }
</script>

<style>

</style>