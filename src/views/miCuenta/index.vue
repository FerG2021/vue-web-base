<template>
  <main>
    <el-card>
      <template #header>
        <h1>Mi cuenta</h1>          
      </template>

      <div>    
        <div style="margin-bottom: 20px">
          <span style="margin-right: 10px">Habilitar edición de datos</span>
          <el-switch v-model="habilitarEdicion" />
          <div v-if="habilitarEdicion == true">
            <el-alert title="IMPORTANTE" description="Al modificar algunos de los datos de su cuenta la sesión se cerrará y deberá voler a ingresar" type="warning" show-icon/>
          </div>
        </div>   
        <el-form 
          label-width="150px" 
          ref="form"
          :model="form"
          :rules="rules"
          status-icon
        >
          <!-- Nombre -->
          <el-form-item label="Nombre" prop="nombre">
            <el-input v-model="form.nombre"  :disabled="habilitarEdicionNombre()"/>
          </el-form-item>
          
          <!-- Email -->
          <el-form-item label="Email" prop="email">
            <el-input v-model="form.email"  :disabled="habilitarEdicionEmail()"/>
          </el-form-item>

          <!-- Contraseña -->
          <el-form-item label="Contraseña" prop="contrasena">
            <el-input v-model="form.contrasena" :disabled="habilitarEdicionContrasena()" type="password"/>
          </el-form-item>

          <!-- Repetir contraseña -->
          <el-form-item label="Repetir contraseña" prop="repetirContrasena">
            <el-input v-model="form.repetirContrasena" :disabled="habilitarEdicionRepetirContrasena()" type="password"/>
          </el-form-item>

          <el-form-item>
            <el-button 
              class="btnEnviar" 
              type="primary" 
              @click="onSubmit()"
              :disabled="deshabilitarBtnGuardarDatos()"
            >
              Guardar datos
            </el-button>
          </el-form-item>

          
        </el-form>
      </div>
    </el-card>
  </main>
</template>

<script>
  import { ElMessage, ElMessageBox } from 'element-plus'

  export default {
    data() {
      return {
        id: null,
        form:{
          nombre: null,
          email: null,
          contrasena: null,
          repetirContrasena: null,
        },
        habilitarEdicion: false,


        rules: {
          nombre: [
            {
              required: true,
              message: "Por favor ingrese su mail.",
              trigger: "change",
            },
          ],
          email: [
            {
              required: true,
              message: "Por favor ingrese su mail.",
              trigger: "change",
            },
          ],
          contrasena: [
            {
              required: true,
              message: "Por favor ingrese su contraseña.",
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

    created() {
      this.getDatosMiCuenta()
    },

    methods: {
      getDatosMiCuenta(){
        // console.log(this.store.state.user.name)
        console.log("created");
        console.log(this.$store.state.user);

        this.id = this.$store.state.user.id
        this.form.nombre = this.$store.state.user.name
        this.form.email = this.$store.state.user.email
      },

      habilitarEdicionNombre(){
        if (this.habilitarEdicion == false) {
          return true
        } else {
          return false
        }
      },

      habilitarEdicionEmail(){
        if (this.habilitarEdicion == false) {
          return true
        } else {
          return false
        }
      },
      habilitarEdicionContrasena(){
        if (this.habilitarEdicion == false) {
          return true
        } else {
          return false
        }
      },
      habilitarEdicionRepetirContrasena(){
        if (this.habilitarEdicion == false) {
          return true
        } else {
          return false
        }
      },

      
      
      async onSubmit(){
        console.log("guadarDatos");
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

        const respuestaApi = await this.axios.put("/api/usuario/actualizar/" + this.id, params)

        if (respuestaApi.data.code == 200) {
          ElMessage({
            type: 'success',
            message: '¡Datos de la cuenta modificados con éxito!',
          })
          this.$emit('actualizarTabla')
          this.logout()
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


      },

      deshabilitarBtnGuardarDatos(){
        if (this.form.nombre == null ||
            this.form.nombre == "" ||
            this.form.email == null ||
            this.form.email == "" || 
            this.habilitarEdicion == false
        ) {
          return true
        } else {
          return false
        }
      },

      async logout(){
        await this.$store.dispatch("logout")
        // redirect
        return this.$router.replace("/login")
      }
    },
  }
</script>

<style>

</style>