<template>
  <div>
    <el-select
      v-model="seleccionado"
      remote
      reserve-keyword
      :remote-method="remoteMethod"
      :loading="loading || typeando"
      :filterable="permitirInput"
      :placeholder="placeholder"
      :clearable="clearable"
      :size="size"
      :disabled="disabled"
      :multiple="multiple"
      :multiple-limit="multipleLimit"
      @change="input($event)"
      @clear="seleccionarOpcion(null)"
    >
      <template #prefix>
        <div v-if="icon != null" style="width: 25px; line-height: 40px">
          <i :class="icon"></i>
        </div>
      </template>
      <!-- Al comienzo, si nosotros le ponemos un valor al select.
      se queda con el ID en la casilla hasta cargar los datos en los select
      normales. En los select de busqueda, al nunca cargar a menos que el usuario
      ponga algo, el ID no se va.

      Para solucionar esto, verificar si el arreglo esta vacio y el value (vmodel)
      no. Si esto ocurre, mostrar una opción en duro con los vamores
      del vmodel. Se utilizarán las opciones reales cuando carguen-->

      <div v-if="opciones.length > 0">
        <el-option
          v-for="item in opciones"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </div>
      <div v-else>
        <div v-if="itemLabel == 'nombre'">
          <el-option v-if="modelValue != null" :label="modelValue.nombre" :value="modelValue.id"></el-option>
        </div>
        <div v-else>
          <div v-if="Array.isArray(itemLabel)">
            <el-option
              v-if="modelValue != null"
              :label="obtenerLabel(modelValue)"
              :value="modelValue[itemValue]"
            ></el-option>
          </div>
          <div v-else>
            <el-option
              v-if="modelValue != null"
              :label="obtenerLabel(modelValue)"
              :value="modelValue[itemValue]"
            ></el-option>
          </div>
        </div>
      </div>
    </el-select>
    <div class="slot-wrapper">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MacaSelectBox',
  props: {
    url: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },

    // Opcion elegida por defecto
    default: {
      type: Object,
      default: () => { },
    },
    // Datos por defecto
    datos: {
      type: Object,
      default: () => { },
    },
    modelValue: {
      type: [Object, Array],
      default: null,
    },

    getParams: {
      type: Function,
      default: (query) => { },
    },
    itemLabel: {
      type: [Array, String],
      default: 'nombre',
    },
    itemValue: {
      type: String,
      default: 'id',
    },
    necesitaParams: {
      type: Boolean,
      default: false,
    },
    permitirInput: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: null,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    seleccionarPrimero: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    multipleLimit: {
      type: Number,
      default: null,
    },
    // Devolver todos los datos a v-model si es true
    devolverTodo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      datosApi: [],
      opciones: [],
      loading: false,
      typeando: false,

      queryTimeout: null,
      ultimoQuery: null,

      seleccionado: null,
    }
  },
  watch: {
    modelValue: {
      handler() {
        if (this.modelValue != null) {
          if (this.multiple) {
            this.seleccionado = []
            if (this.multipleLimit == 1) {
              this.agregarAMultiple(this.modelValue.id);
            } else {
              this.modelValue.forEach((element) => {
                this.agregarAMultiple(element.id)
              })
            }
          }
          else {
            // agregar opcion si no existe
            let existe = false

            if (this.opciones.length != 0) {
              this.opciones.forEach((element) => {
                if (element.value == this.modelValue[this.itemValue])
                  existe = true
              })
            }

            if (!existe) {
              this.opciones.push({
                label: this.obtenerLabel(this.modelValue),
                value: this.modelValue[this.itemValue],
              })
            }

            this.seleccionado = this.modelValue[this.itemValue]
          }
        }
        else {
          this.seleccionado = null
        }
      },
      deep: true,
    },
  },
  mounted() {
    // Si necesita params, llamar la funcion del componente padre para obtenerlos.
    // getParams puede necesitar el query del input o no. Ignorar si necesita query
    // Esa verificacion se hace en el get.
    if (this.datos != null && this.datos.length) {
      this.guardarDatosApi(this.datos)
      this.llenarOpciones()
    }
    else {
      this.recargar()
    }
  },
  methods: {
    async recargar(query = null) {
      if (this.url == null || this.url == '')
        return

      if (this.necesitaParams) {
        if (query) {
          const datos = await this.get(this.getParams(query))
          await this.guardarDatosApi(datos)
          this.llenarOpciones()
        }
        else {
          const datos = await this.get(this.getParams(query))
          await this.guardarDatosApi(datos)
          this.llenarOpciones()
        }
      }
      else {
        const datos = await this.get()
        await this.guardarDatosApi(datos)
        this.llenarOpciones()
      }
    },

    guardarDatosApi(datos) {
      // A veces la API trae un objeto en vez de arreglo
      if (Array.isArray(datos) || datos == null)
        this.datosApi = datos
      else
        this.datosApi = datos.datos

      this.$emit('datos-cargados', this.datosApi)
    },

    // Realizar GET de api. En caso de que el subcomponente necesite params y
    // params sea vacio no realizar consulta
    get(params = null) {
      if (this.necesitaParams && !params) {
        return new Promise(() => {
          return null
        })
      }
      this.loading = true
      console.log("this.url")
      console.log(this.url)

      return this.axios.get(this.url, params)
    },

    // Metodo que utiliza el-select para traer la lista de opciones
    // Hacer la consulta a la API, guardar el resultado, y procesar el resultado
    remoteMethod(query) {
      this.ultimoQuery = query

      // limpiar cada vez que escriba para evitar confuciones en cuanto
      // a qué se esta buscando actualmente
      this.datosApi = []
      this.llenarOpciones()

      // Mostrar cargando antes de llamar a la API para
      // evitar que se muestre "Sin Datos" al escribir
      this.typeando = true

      // esperar a que el usuario termine de escribir
      clearTimeout(this.queryTimeout)
      this.queryTimeout = setTimeout(async () => {
        await this.recargar(query)
        this.typeando = false
      }, 700)
    },

    // Cuando datosApi tiene datos, formatea los mismos en la variable de opciones
    // para el-select. Formato: [{label:, value:}]
    llenarOpciones() {
      this.loading = false

      if (this.datosApi == null)
        return

      let datos = this.datosApi
      const opciones = []

      if (datos != null && !Array.isArray(datos))
        datos = datos.datos

      datos.forEach((itemDatos) => {
        const label = this.obtenerLabel(itemDatos)
        const value = itemDatos[this.itemValue]

        // Si hay un item por defecto, seleccionarlo
        // default={label:, value:}
        if (this.default != null) {
          if (this.default.label == label || this.default.value == value) {
            if (this.multiple)
              this.agregarAMultiple(value)
            else
              this.seleccionado = value

            // la opcion debe tener el mismo formato con el que llega de la api
            const opcion = {}

            // formatear opcion
            if (Array.isArray(this.itemLabel)) {
              opcion[this.itemLabel[0]] = label
            }
            else {
              // dividir label si este tiene puntos
              // para acceder a un objeto a dentro de los datos de la api
              const labelSeparado = this.itemLabel.split('.')

              if (labelSeparado.length > 0) {
                // el label es anidado. Ej: itemLabel="detallePersona.nombre"
                let itemAnterior = {}
                for (let index = 0; index < labelSeparado.length; index++) {
                  const subLabel = labelSeparado[index]
                  if (index < labelSeparado.length - 1) {
                    // los objetos se pasan por referencia asi que
                    // opcion siempre se va a ir agregando de esta forma:
                    // opcion[label1][label2][label3]
                    opcion[subLabel] = itemAnterior
                    itemAnterior = {}
                  }
                  else {
                    // hasta llegar al final, que contiene el valor que queremos
                    opcion[subLabel] = label
                  }
                }
              }
              else {
                // el label es simple. Ej: itemLabel="nombre"
                opcion[this.itemLabel] = label
              }
            }
            opcion[this.itemValue] = value

            // la opcion debe tener el mismo formato con el que llega de la api
            this.seleccionarOpcion(opcion)
          }
        }

        //
        opciones.push({
          label,
          value,
        })
      })

      // Setear opciones para el-select
      this.opciones = opciones

      // seleccionar primera opcion si esta seteada la opcion
      if (this.seleccionarPrimero && opciones.length > 0) {
        const datos = this.obtenerDatosSeleccionado(opciones[0].value)
        this.seleccionarOpcion(
          datos,
        )
      }
    },

    obtenerLabel(fila) {
      let label = ''

      // Si itemLabel es un arreglo, concatenar atributos en datos para label
      // Ej: :itemLabel="['nombre', 'apellido', 'dni']"
      // Si no, label es igual al valor del atributo
      // Ej: itemLabel='nombre'
      if (Array.isArray(this.itemLabel)) {
        this.itemLabel.forEach((elementLabel) => {
          // Verificar alternativas de label.
          // Ej: para ['nombre', ['dni', 'cuit']], si no hay dni, utilizar cuit
          if (Array.isArray(elementLabel)) {
            let anadido = false
            elementLabel.forEach((opElementLabel) => {
              if (
                fila[opElementLabel] != null
                && fila[opElementLabel] != ''
                && !anadido
              ) {
                label = `${label + fila[opElementLabel]} `
                anadido = true
              }
            })
          }
          else {
            if (fila[elementLabel] != null && fila[elementLabel] != '')
              label = `${label + fila[elementLabel]} `
          }
        })
        label = label.substr(0, label.length - 1)
      }
      else {
        // dividir label si este tiene puntos
        // para acceder a un objeto a dentro de los datos de la api
        const labelSeparado = this.itemLabel.split('.')

        if (labelSeparado.length > 1) {
          // el label es anidado. Ej: itemLabel="detallePersona.nombre"
          let datoFinal = fila
          labelSeparado.forEach((subLabel) => {
            datoFinal = datoFinal[subLabel]
          })

          label = datoFinal
        }
        else {
          // el label es simple. Ej: itemLabel="nombre"
          label = fila[this.itemLabel]
        }
      }

      return label
    },

    // Funcion que se ejecuta al seleccionar una opcion para emitir señales
    // ya sea manualmente, con una funcion externa, o con algun prop de este comp.
    // Para algunos eventos, this.seleccionado ya contiene el valor
    // pero aqui se lo asigna otra vez por las dudas, porque hay veces que esta
    // funcion se llama pero el valor no esta asignado (en el caso del
    // prop "seleccionarPrimero" por ejemplo)
    seleccionarOpcion(opcion) {
      this.$emit('opcion-seleccionada', opcion)

      if (opcion != null) {
        // Si hay opcion seleccionada, procesar...

        if (this.multiple) {
          this.agregarAMultiple(opcion.id)

          const listaDatos = []
          this.seleccionado.forEach((elem) => {
            listaDatos.push(this.obtenerDatosSeleccionado(elem))
          })

          // Si es opcion multiple, devolver todos los seleccionados
          if (this.multipleLimit == 1) {
            this.$emit('update:modelValue', listaDatos[0])
          } else {
            this.$emit('update:modelValue', listaDatos)
          }
        }
        else {
          this.seleccionado = opcion[this.itemValue]
          this.$emit('update:modelValue', opcion)
        }
      }
      else {
        // Si no hay nada seleccionado, devolver null en vmodel
        this.seleccionado = null
        this.$emit('update:modelValue', null)
      }

      // Ejecutar el evento @change por si el componente padre necesita
      this.$emit('change')
    },

    // Devuelve los datos correspondientes de datosApi a la opcion seleccionada
    obtenerDatosSeleccionado(valueSeleccionado = 0) {
      if (this.datosApi == null)
        return []

      for (let i = 0; i < this.datosApi.length; i++) {
        if (this.datosApi[i][this.itemValue] === valueSeleccionado)
          return this.datosApi[i]
      }

      return []
    },

    // Para procesar evento seleccion de el-select
    // Emite evento "opcion-seleccionada" con datos de datosAPI de la seleccion
    input(valueSeleccionado) {
      this.seleccionarOpcion(this.obtenerDatosSeleccionado(valueSeleccionado))
    },

    // Usado por otros componentes para forzar la seleccion de un elemento
    // si no hay opciones, agregar el dato (objeto) como opcion y seleccionarlo
    // al final recargar para obtener los demás datos si no lo hizo
    seleccionar(dato) {
      if (dato == null) {
        this.seleccionado = null
        this.seleccionarOpcion(null)
        return
      }

      let existe = false

      if (this.opciones.length != 0) {
        this.opciones.forEach((element) => {
          if (element.value == dato[this.itemValue])
            existe = true
        })
      }

      if (!existe) {
        this.opciones.push({
          label: this.obtenerLabel(this.modelValue),
          value: this.modelValue[this.itemValue],
        })
      }

      if (this.multiple)
        this.agregarAMultiple(dato[this.itemValue])
      else
        this.seleccionado = dato[this.itemValue]

      this.seleccionarOpcion(dato)

      this.recargar()
    },

    // Funcion que agrega al arreglo de seleccionados si el select es multiple
    agregarAMultiple(valor) {
      const index = this.seleccionado.findIndex(elemento => elemento == valor)

      // por alguna razón se agrega undefined al seleccionar algo
      if (index == -1 && valor !== undefined)
        this.seleccionado.push(valor)
    },
  },
}
</script>

<style scoped>
.slot-wrapper > * {
  margin-left: 10px;
}
</style>
