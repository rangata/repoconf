<template>

  <b-container fluid>
    <form-wizard>
      <tab-content title="Изберете Вашия юнит">
        <b-row>
          <b-container>
            <ul v-for="(vx, index) in grouped" :key="index">
              <h2>{{ index }}</h2>
              <li v-for="(ti, ind) in vx" :key="ind">
                  {{ ti.title }}
              </li>
            </ul>
          </b-container>
          <b-card-group v-for="unit in units" :key="unit.model">
            <b-card header-bg-variant="dark" header-text-variant="white">
              <div class="title" slot="header">
                <strong>
                  {{ unit.title + ' ' + unit.model }}
                </strong>
              </div>
              <!-- <b-card-img src="https://www.miglionico.eu/wp-content/uploads/2017/03/poltrona-one-4254x1714.jpg" alt="" /> -->
              <hr>
              <b-card-body style="text-align: left">
                {{ unit.longDescription }}
             <b-row>
                <b-col>
                <h2>Спецификация на машината</h2>
                <ul class="list-group" v-for="(vx, index) in grouped" :key="index">
                  <h2>{{ index }}</h2>
                     <draggable>
                        <li v-for="(ti, ind) in vx" :key="ind" class="list-group-item">
                          {{ ti.title }}
                      </li>
                     </draggable>
                </ul>
              </b-col>
              <b-col>
                <h2>Възможности</h2>
                <draggable group="b" :list="availableTechFeatures" class="list-group">
                 <transition-group>
                    <div  class="list-group-item" ghost-class="ghost" v-for="(element, index) in availableTechFeatures" :key="element.title" handle=".handle">
                      <span class="handle">>><<</span>
                        {{element.title}}
                       <div class="align-right">
                         <b-button variant="info" @click="editRec(index)">few</b-button>
                       </div>
                    </div>
                </transition-group>
              </draggable>
              </b-col>
             </b-row>
              <hr>
              </b-card-body>
              <div class="footer" slot="footer">
                <b-btn block @click="selectUnit(unit)">Конфигурирай</b-btn>
              </div>
            </b-card>
          </b-card-group>
        </b-row>
      </tab-content>
      <tab-content title="'Вашият дентален юнит е '">
        My second tab content
      </tab-content>
      <tab-content title="Last step">
        Yuhuuu! This seems pretty damn simple
      </tab-content>
    </form-wizard>
  </b-container>
</template>

<script>
import jsonData from '../../dataStore'
import draggable from 'vuedraggable'

import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default {
  name: 'list',
  components: {
    draggable
  },
  data () {
    return {
      units: jsonData.dentalUnits,
      options: jsonData.options,
      editOffset: -1,
      editPost: {},
      editPostOri: {},
      grouped: [],
      availableTechFeatures: [
        {
          "section": "Работен пулт на стоматолога",
          "title": "Осветително тяло FARO MAIA",
        },
        {
          "section": "Работен пулт на стоматолога",
          "title": "Възможност за ръчно пускане и спиране на система за светлинаcx"
        },
      ]
    }
  },
  mounted () {
    this.grouped = this.$_.groupBy(this.units[0].specification, 'section')
  },
  methods: {
    editRec(index) {
     console.log(index)
     this.editPost = this.unit[index]
     console.log(this.editPost)
    },
    selectUnit (unit) {
      this.$store.commit('setUnit', unit)
    }
  }
}
</script>

<style scoped>

.ghost {
  opacity: 0.5;
  background: #1f94ca;
}
</style>
