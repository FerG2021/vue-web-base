<template>
  <div>
    <modal ref="modal" titulo="Nuevo usuario" :impedir-close="impedirClose">
      
      <el-form
        label-width="150px"
        ref="form"
        :model="form"
        :rules="rules"
        status-icon
      >
        <!-- Nombre -->
        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="form.nombre" placeholder="Ingrese su nombre y apellido"></el-input>
        </el-form-item>

        <!-- Email -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" placeholder="Ingrese su mail"></el-input>
        </el-form-item>

        <!-- Contraseña -->
        <el-form-item label="Contraseña" prop="contrasena">
          <el-input v-model="form.contrasena" type="password" placeholder="Ingrese la contraseña (mínimo 8 caracteres)"></el-input>
        </el-form-item>

        <!-- Repetir contraseña -->
        <el-form-item label="Confirmar contraseña" prop="repetirContrasena">
          <el-input v-model="form.repetirContrasena" type="password" placeholder="Confirme la contraseña ingresada (mínimo 8 caracteres)"></el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button 
          type="primary"
          @click="onSubmit()"
          :disabled="deshabilitarBtnGuardar()"
        > Guardar</el-button>
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
          rules: {
            nombre: [
              {
                required: true,
                message: "Por favor ingrese un nombre.",
                trigger: "change",
              },
            ],

            email: [
              {
                required: true,
                message: "Por favor ingrese un email.",
                trigger: "change",
              },
            ],

            contrasena: [
              {
                required: true,
                message: "Por favor ingrese una contraseña.",
                trigger: "change",
              },
            ],

            repetirContrasena: [
              {
                required: true,
                message: "Por favor repita la contraseña.",
                trigger: "change",
              },
            ],
          },

      }
    },

    methods:{
      abrir(){
        this.form.nombre = null
        this.form.email = null
        this.form.contrasena = null
        this.form.repetirContrasena = null
        if (this.$refs.form) this.$refs.form.resetFields();
        this.$refs.modal.abrir()
      },

      cerrar(){
        this.$refs.modal.cerrar()
      },

      
      onSubmit(){
        let params = {
          nombre: this.form.nombre,
          email: this.form.email,
          contrasena: this.form.contrasena,
          repetirContrasena: this.form.repetirContrasena
        }

        this.axios.post("api/usuario/crear", params)
          .then(response => {

            if (response.data.code == 400) {
              let erroresMostrar = "// ";
              let erorres = Object.values(response.data.data)

              erorres.forEach((elemento) => {                
                erroresMostrar = erroresMostrar + " " + elemento + " //";
              })

              ElMessage({
                type: 'error',
                grouping: true,
                message: erroresMostrar,
                duration: 5000,
              })
            } else {
              ElMessage({
                type: 'success',
                message: '¡Usuario añadido con éxito!',
              })
              this.$emit('actualizarTabla')
              this.cerrar()
            }



            // ElMessage({
            //     type: 'success',
            //     message: '¡Usuario añadido con éxito!',
            // })
            // this.$emit('actualizarTabla')
            // this.cerrar()
          })
      },

      deshabilitarBtnGuardar(){
        if (this.form.nombre == null ||
            this.form.nombre == "" ||
            this.form.email == null ||
            this.form.email == "" ||
            this.form.nombre == null ||
            this.form.nombre == "" ||
            this.form.contrasena == null ||
            this.form.contrasena == "" ||
            this.form.repetirContrasena == null ||
            this.form.repetirContrasena == ""
        ) {
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