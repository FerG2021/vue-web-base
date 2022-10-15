<template>
	<main class="home-page">
		<el-card>
			<h1>Home</h1>

      <!-- <el-row :gutter="10" style="margin-top: 20px">
        <el-col :span="6">
          <el-card @click="$router.replace('/presupuestacion')" class="botonHome">
            <h3 style="text-align: center">Provisiones</h3>            
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">assignment</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card @click="$router.replace('/borrador')"  class="botonHome">
            <h3 style="text-align: center">Borradores</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">assignment_late</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card @click="$router.replace('/ordencompra')"  class="botonHome">
            <h3 style="text-align: center">Órdenes de compra</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">receipt</span>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card @click="$router.replace('/transferencia')"  class="botonHome">
            <h3 style="text-align: center">Transferencias</h3>
            <div style="display:flex">
              <div style="margin: auto">
                <span class="material-icons iconoTarjeta" style="font-size: 16vh">move_up</span>
              </div>
            </div>
          </el-card>
        </el-col>
        
      </el-row> -->

      

		</el-card>     
	</main>
</template>

<script>
	export default {

	}
</script>

<style>
	el-card{
		margin: 0px;
		padding: 0px;
	}

  .botonHome:hover{
    transform: translateY(-2px);
    box-shadow: 0px 2px 5px #0000002a !important;
    cursor: pointer;
    background-color: #cccccc
;
  }

  .iconoTarjeta{
    font-size: 16vh; 
    margin-top: 20px; 
    color: var(--dark-alt);
  }
</style>