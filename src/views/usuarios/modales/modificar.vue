<template>
  <div>
    <modal ref="modal" titulo="Modificar usuario" :impedir-close="impedirClose">
      <el-form
        label-width="170px"
        v-loading="loading"
        :rules="formRules"
      >
        <!-- Nombre -->
        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="form.nombre"></el-input>
        </el-form-item>

        <!-- Email -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <!-- Contraseña -->
        <el-form-item label="Contraseña" prop="contrasena" >
          <el-input v-model="form.contrasena" type="password"></el-input>
        </el-form-item>

        <!-- Repetir contraseña -->
        <el-form-item label="Repet. contraseña" prop="repetirContrasena" >
          <el-input v-model="form.repetirContrasena" type="password"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button 
          type="primary" 
          @click="onSubmit()"
          :disabled="deshabilitarBtnGuardar()"
        >Guardar</el-button>
      </template>
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
          email: null,
          contrasena: null,
          repetirContrasena: null,
        },
        id: null,
        articulos: [],
        loading: false,


        // formRules: {
        //   nombre: [
        //     {
        //       required: true,
        //       message: "Por favor introduzca el nombre.",
        //       trigger: "change",
        //     },
        //   ],
          
        //   precio: [
        //     {
        //       required: true,
        //       message: "Por favor introduzca el precio.",
        //       trigger: "change",

        //     },
        //   ],

        //   stock: [
        //     {
        //       required: true,
        //       message: "Por favor introduzca el stock.",
        //       trigger: "change",            
        //     },
        //   ],
        // },
      }
    },

    methods:{
      abrir(id){
        this.loading = true
        this.id = null
        this.id = id

        
        this.form.nombre = null
        this.form.email = null
        this.form.contrasena = null
        this.form.repetirContrasena = null
        

        this.$refs.modal.abrir()

        // limpio los campos
        this.form.nombre = null
       

        this.getDatos()
        
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      async getDatos(){
        await this.axios.get("/api/usuario/obtenerDatos/" + this.id)
          .then(response =>{
            const respuestaApi = response.data
            
            if (respuestaApi.code == 200) {
              this.form.nombre = respuestaApi.data.nombre
              this.form.email = respuestaApi.data.email


              this.loading = false
            } else{
              this.cerrar()
            }
        })   
      },

      

      async onSubmit(){
        let params = {
            id: this.id,
            nombre: this.form.nombre,
            email: this.form.email,            
        }

        if (this.form.contrasena != null) {
          params.contrasena = this.form.contrasena
        } else {
          params.contrasena = null
        }

        if (this.form.repetirContrasena != null) {
          params.repetirContrasena = this.form.repetirContrasena
        } else {
          params.repetirContrasena = null
        }

        console.log(params);

        const respuestaApi = await this.axios.put("/api/usuario/actualizar/" + this.id, params)
            
            console.log(respuestaApi);

            if (respuestaApi.data.code == 200) {
              ElMessage({
                    type: 'success',
                    message: '¡Usuario modificado con éxito!',
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
       
            // .then(response => {
            //   console.log("reponse");
            //   console.log(response);
            //     // ElMessage({
            //     //     type: 'success',
            //     //     message: '¡Producto modificado con éxito!',
            //     // })
            //     // this.$emit('actualizarTabla')
            //     // this.cerrar()
            // })
            // .catch(error => {
            //     console.log(error)
            // })
      },

      deshabilitarBtnGuardar(){
        if (this.form.nombre == null || 
            this.form.nombre == ""
            // this.form.email == null || 
            // this.form.email == ""
          ) 
        {
          return true    
        } else {
          return false
        }
      },
    }
  }
</script>

<style>

</style>